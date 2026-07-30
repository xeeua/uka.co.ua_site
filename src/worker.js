const CONTACT_EMAIL = "uka.org.ua@gmail.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const required = ["fullname", "position", "company", "city", "phone"];
  for (const field of required) {
    if (!data[field] || !String(data[field]).trim()) {
      return json({ ok: false, error: `missing_${field}` }, 400);
    }
  }

  const lines = [
    `ПІБ: ${data.fullname}`,
    `Посада: ${data.position}`,
    `Підприємство: ${data.company}`,
    `Місто: ${data.city}`,
    `Телефон: ${data.phone}`,
    `E-mail: ${data.email || "-"}`,
    "",
    data.message || "",
  ];

  const host = new URL(request.url).hostname;
  const fromAddr = `forma@${host}`;
  const subject = `Заявка з сайту УКА - ${data.fullname}`;
  const raw =
    `From: "Сайт УКА" <${fromAddr}>\r\n` +
    `To: <${CONTACT_EMAIL}>\r\n` +
    `Subject: ${encodeSubject(subject)}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset="utf-8"\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    b64(lines.join("\n"));

  try {
    const { EmailMessage } = await import("cloudflare:email");
    const message = new EmailMessage(fromAddr, CONTACT_EMAIL, raw);
    await env.SEND_EMAIL.send(message);
  } catch (err) {
    return json({ ok: false, error: "send_failed", detail: String(err) }, 500);
  }

  return json({ ok: true });
}

function encodeSubject(subject) {
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
}

function b64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
