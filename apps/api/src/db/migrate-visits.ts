import { db } from '../config/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Migrating visits table...');
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "visits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "device" varchar(20) NOT NULL,
        "visitor_type" varchar(20) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log('Visits table migrated successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
  process.exit(0);
}

main();
