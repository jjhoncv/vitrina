import { connect } from "node:tls";

export type Correo = { para: string; asunto: string; texto: string };

// Cuerpo de un mensaje SMTP: CRLF y "dot-stuffing" (RFC 5321).
export function mensajeSmtp(de: string, { para, asunto, texto }: Correo): string {
  const cabecera = [
    `From: ${de}`,
    `To: ${para}`,
    `Subject: =?UTF-8?B?${Buffer.from(asunto).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
  ].join("\r\n");
  const cuerpo = (Buffer.from(texto).toString("base64").match(/.{1,76}/g) ?? []).join("\r\n");
  return `${cabecera}\r\n\r\n${cuerpo}`;
}

// Cliente SMTP mínimo contra Gmail (TLS directo, puerto 465, AUTH PLAIN). Ver ADR 0003.
async function enviarPorGmail(correo: Correo, usuario: string, clave: string): Promise<void> {
  const socket = connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
  socket.setTimeout(15_000, () => socket.destroy(new Error("Gmail SMTP: tiempo agotado")));
  let buffer = "";
  const esperar = (codigo: number) =>
    new Promise<void>((resolver, rechazar) => {
      const revisar = () => {
        const lineas = buffer.split("\r\n");
        const ultima = lineas.length > 1 ? lineas[lineas.length - 2] : "";
        if (!/^\d{3} /.test(ultima)) return;
        socket.off("data", revisar);
        socket.off("error", rechazar);
        const recibido = buffer;
        buffer = "";
        if (Number(ultima.slice(0, 3)) === codigo) resolver();
        else rechazar(new Error(`Gmail SMTP: ${recibido.trim()}`));
      };
      socket.on("data", (d) => {
        buffer += d.toString();
        revisar();
      });
      socket.once("error", rechazar);
      revisar();
    });
  const paso = async (linea: string, codigo: number) => {
    const espera = esperar(codigo);
    socket.write(`${linea}\r\n`);
    await espera;
  };
  try {
    await esperar(220);
    await paso("EHLO vitrina", 250);
    await paso(`AUTH PLAIN ${Buffer.from(`\0${usuario}\0${clave}`).toString("base64")}`, 235);
    await paso(`MAIL FROM:<${usuario}>`, 250);
    await paso(`RCPT TO:<${correo.para}>`, 250);
    await paso("DATA", 354);
    await paso(`${mensajeSmtp(usuario, correo).replace(/^\./gm, "..")}\r\n.`, 250);
    await paso("QUIT", 221);
  } finally {
    socket.destroy();
  }
}

/** Envía un correo con Gmail SMTP; con CORREO=simulado no sale nada (pruebas, ADR 0001). */
export async function enviarCorreo(correo: Correo): Promise<void> {
  if (process.env.CORREO === "simulado") return;
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) throw new Error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD");
  await enviarPorGmail(correo, GMAIL_USER, GMAIL_APP_PASSWORD.replace(/\s/g, ""));
}
