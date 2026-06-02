import net from 'node:net';
import tls from 'node:tls';

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

const getSmtpConfig = (): SmtpConfig | null => {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!host || !from) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from,
  };
};

const encodeHeader = (value: string) => {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
};

const escapeAddress = (value: string) => `<${value.replace(/[<>\r\n]/g, '')}>`;

const buildMessage = ({ to, subject, text }: SendMailInput, from: string) => [
  `From: ${escapeAddress(from)}`,
  `To: ${escapeAddress(to)}`,
  `Subject: ${encodeHeader(subject)}`,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  '',
  text,
].join('\r\n');

const readResponse = (socket: net.Socket | tls.TLSSocket) => new Promise<string>((resolve, reject) => {
  let buffer = '';
  const onData = (chunk: Buffer) => {
    buffer += chunk.toString('utf8');
    const lines = buffer.split(/\r?\n/).filter(Boolean);
    const lastLine = lines[lines.length - 1];
    if (lastLine && /^\d{3}\s/.test(lastLine)) {
      socket.off('data', onData);
      socket.off('error', reject);
      resolve(buffer);
    }
  };

  socket.on('data', onData);
  socket.once('error', reject);
});

const writeCommand = async (socket: net.Socket | tls.TLSSocket, command: string) => {
  socket.write(`${command}\r\n`);
  return readResponse(socket);
};

const assertSmtpOk = (response: string, acceptedCodes: string[]) => {
  if (!acceptedCodes.some((code) => response.startsWith(code))) {
    throw new Error(`SMTP command failed: ${response.trim()}`);
  }
};

export const sendMail = async (input: SendMailInput): Promise<boolean> => {
  const config = getSmtpConfig();
  if (!config) return false;

  let socket: net.Socket | tls.TLSSocket = config.secure
    ? tls.connect({ host: config.host, port: config.port, servername: config.host })
    : net.connect({ host: config.host, port: config.port });

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once(config.secure ? 'secureConnect' : 'connect', resolve);
      socket.once('error', reject);
    });

    assertSmtpOk(await readResponse(socket), ['220']);
    let ehlo = await writeCommand(socket, 'EHLO localhost');
    assertSmtpOk(ehlo, ['250']);

    if (!config.secure && process.env.SMTP_SECURE !== 'false' && ehlo.includes('STARTTLS')) {
      assertSmtpOk(await writeCommand(socket, 'STARTTLS'), ['220']);
      socket = tls.connect({ socket, servername: config.host });
      await new Promise<void>((resolve, reject) => {
        socket.once('secureConnect', resolve);
        socket.once('error', reject);
      });
      ehlo = await writeCommand(socket, 'EHLO localhost');
      assertSmtpOk(ehlo, ['250']);
    }

    if (config.user && config.pass) {
      assertSmtpOk(await writeCommand(socket, 'AUTH LOGIN'), ['334']);
      assertSmtpOk(await writeCommand(socket, Buffer.from(config.user).toString('base64')), ['334']);
      assertSmtpOk(await writeCommand(socket, Buffer.from(config.pass).toString('base64')), ['235']);
    }

    assertSmtpOk(await writeCommand(socket, `MAIL FROM:${escapeAddress(config.from)}`), ['250']);
    assertSmtpOk(await writeCommand(socket, `RCPT TO:${escapeAddress(input.to)}`), ['250', '251']);
    assertSmtpOk(await writeCommand(socket, 'DATA'), ['354']);
    socket.write(`${buildMessage(input, config.from)}\r\n.\r\n`);
    assertSmtpOk(await readResponse(socket), ['250']);
    await writeCommand(socket, 'QUIT').catch(() => undefined);
    return true;
  } finally {
    socket.end();
  }
};
