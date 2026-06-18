#!/usr/bin/env python3
"""
Convert a PostgreSQL dump into a cPanel/phpPgAdmin-friendly import file.

Usage:
  python scripts/make_pg_dump_cpanel_compatible.py input_dump.sql
  python scripts/make_pg_dump_cpanel_compatible.py input_dump.sql output.sql

Default output:
  compatible_import.sql
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


DEFAULT_OUTPUT = "compatible_import.sql"


BLOCKED_STATEMENT_PATTERNS = [
    r"CREATE\s+ROLE\b",
    r"ALTER\s+ROLE\b",
    r"CREATE\s+EXTENSION\b",
    r"COMMENT\s+ON\s+EXTENSION\b",
    r"CREATE\s+TYPE\b",
    r"GRANT\b",
    r"REVOKE\b",
    r"ALTER\s+.*?\s+OWNER\s+TO\b",
]


BLOCKED_LINE_PATTERNS = [
    r"\bOWNER\s+TO\b",
]


def decode_sql(path: Path) -> str:
    raw = path.read_bytes()

    if raw.startswith(b"\xff\xfe") or raw.startswith(b"\xfe\xff"):
        return raw.decode("utf-16")

    if raw.startswith(b"\xef\xbb\xbf"):
        return raw.decode("utf-8-sig")

    return raw.decode("utf-8", errors="replace")


def comment_statement(statement: str, reason: str) -> str:
    lines = statement.splitlines()
    commented = [f"-- cPanel compatible: skipped {reason}"]
    commented.extend(f"-- {line}" if line.strip() else "--" for line in lines)
    return "\n".join(commented)


def starts_blocked_statement(statement: str) -> str | None:
    candidate_lines = []
    for line in statement.splitlines():
        stripped_line = line.strip()
        if not stripped_line or stripped_line.startswith("--"):
            continue
        candidate_lines.append(line)

    stripped = "\n".join(candidate_lines).lstrip()
    if not stripped or stripped.startswith("--"):
        return None

    for pattern in BLOCKED_STATEMENT_PATTERNS:
        if re.match(pattern, stripped, flags=re.IGNORECASE | re.DOTALL):
            return pattern.replace("\\s+", " ").replace("\\b", "")

    return None


def remove_blocked_statements(sql: str) -> str:
    output: list[str] = []
    statement: list[str] = []

    for line in sql.splitlines():
        if re.match(r"^\s*\\", line):
            output.append(f"-- cPanel compatible: skipped psql meta-command: {line}")
            continue

        statement.append(line)
        if ";" not in line:
            continue

        joined = "\n".join(statement)
        reason = starts_blocked_statement(joined)

        if reason:
            output.append(comment_statement(joined, reason))
        else:
            output.append(joined)

        statement = []

    if statement:
        joined = "\n".join(statement)
        reason = starts_blocked_statement(joined)
        output.append(comment_statement(joined, reason) if reason else joined)

    return "\n".join(output) + "\n"


def comment_blocked_lines(sql: str) -> str:
    cleaned_lines: list[str] = []

    for line in sql.splitlines():
        if "set_config('search_path'" in line:
            cleaned_lines.append(f"-- cPanel compatible: skipped search_path reset: {line}")
            continue

        should_comment = any(re.search(pattern, line, flags=re.IGNORECASE) for pattern in BLOCKED_LINE_PATTERNS)
        if should_comment:
            cleaned_lines.append(f"-- cPanel compatible: skipped owner/privilege line: {line}")
        else:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines) + "\n"


def qualify_create_table(sql: str) -> str:
    def replace(match: re.Match[str]) -> str:
        prefix = match.group("prefix")
        name = match.group("name")
        if "." in name:
            return f"{prefix}{name}"
        return f"{prefix}public.{name}"

    return re.sub(
        r"(?im)^(?P<prefix>\s*CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?)(?P<name>(?:\"[^\"]+\"|[A-Za-z_][\w$]*)(?:\.(?:\"[^\"]+\"|[A-Za-z_][\w$]*))?)",
        replace,
        sql,
    )


def qualify_create_sequence(sql: str) -> str:
    def replace(match: re.Match[str]) -> str:
        prefix = match.group("prefix")
        name = match.group("name")
        if "." in name:
            return f"{prefix}{name}"
        return f"{prefix}public.{name}"

    return re.sub(
        r"(?im)^(?P<prefix>\s*CREATE\s+SEQUENCE\s+(?:IF\s+NOT\s+EXISTS\s+)?)(?P<name>(?:\"[^\"]+\"|[A-Za-z_][\w$]*)(?:\.(?:\"[^\"]+\"|[A-Za-z_][\w$]*))?)",
        replace,
        sql,
    )


def qualify_alter_table(sql: str) -> str:
    def replace(match: re.Match[str]) -> str:
        name = match.group("name")
        qualified = name if "." in name else f"public.{name}"
        return f"ALTER TABLE {qualified}"

    return re.sub(
        r"(?im)^\s*(?P<prefix>ALTER\s+TABLE\s+(?:ONLY\s+)?)(?P<name>(?:\"[^\"]+\"|[A-Za-z_][\w$]*)(?:\.(?:\"[^\"]+\"|[A-Za-z_][\w$]*))?)",
        replace,
        sql,
    )


def normalize_role_enum_usage(sql: str) -> str:
    # If CREATE TYPE role is skipped, table definitions cannot reference public.role.
    # Convert enum columns to varchar so the import remains valid on shared hosting.
    sql = re.sub(r"\bpublic\.role\b", "varchar(50)", sql, flags=re.IGNORECASE)
    sql = re.sub(r"\brole\b\s+public\.role\b", "role varchar(50)", sql, flags=re.IGNORECASE)
    return sql


def make_compatible(sql: str) -> str:
    sql = remove_blocked_statements(sql)
    sql = comment_blocked_lines(sql)
    sql = normalize_role_enum_usage(sql)
    sql = qualify_create_table(sql)
    sql = qualify_create_sequence(sql)
    sql = qualify_alter_table(sql)

    header = """-- cPanel/phpPgAdmin compatible import
CREATE SCHEMA IF NOT EXISTS public;
SET search_path = public;

"""
    return header + sql


def main() -> int:
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print("Usage: python scripts/make_pg_dump_cpanel_compatible.py input_dump.sql [output.sql]", file=sys.stderr)
        return 2

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) == 3 else Path(DEFAULT_OUTPUT)

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    sql = decode_sql(input_path)
    compatible = make_compatible(sql)
    output_path.write_text(compatible, encoding="utf-8", newline="\n")

    print(f"Wrote {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
