import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaGRyYm5pbXdhYnp0emtsY2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMzY4MzEsImV4cCI6MjA3MDcxMjgzMX0.vQ6jkaVwCc2UoIWJMlpE1UyilngCF4N1TuOEi7i06pE", "PUBLIC_SUPABASE_URL": "https://qehdrbnimwabztzklcbc.supabase.co", "SITE": undefined, "SSR": true};
const env = Object.assign(__vite_import_meta_env__, { USER: process.env.USER, _: process.env._ });
function readGoogleClientFromJson() {
  try {
    const root = process.cwd();
    const files = fs.readdirSync(root).filter((f) => f.startsWith("client_secret_") && f.endsWith(".json"));
    if (files.length === 0) return null;
    const filePath = path.join(root, files[0]);
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    const cfg = json.installed || json.web || {};
    const clientId = cfg.client_id;
    const clientSecret = cfg.client_secret;
    const redirectUri = Array.isArray(cfg.redirect_uris) ? cfg.redirect_uris[0] : cfg.redirect_uri;
    if (clientId && clientSecret && redirectUri) {
      return { clientId, clientSecret, redirectUri, source: filePath };
    }
    return null;
  } catch {
    return null;
  }
}
function resolveGoogleConfig() {
  const fromEnv = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI
  };
  if (fromEnv.clientId && fromEnv.clientSecret && fromEnv.redirectUri) return fromEnv;
  const fromJson = readGoogleClientFromJson();
  if (fromJson) return fromJson;
  return { clientId: void 0, clientSecret: void 0, redirectUri: void 0 };
}
function createTransport() {
  const { clientId, clientSecret, redirectUri } = resolveGoogleConfig();
  const { GMAIL_USER, GMAIL_PASS, GOOGLE_REFRESH_TOKEN } = env;
  if (clientId && clientSecret && redirectUri && GOOGLE_REFRESH_TOKEN && GMAIL_USER) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId,
        clientSecret,
        refreshToken: GOOGLE_REFRESH_TOKEN
      }
    });
  }
  if (GMAIL_USER && GMAIL_PASS) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });
  }
  throw new Error("Email transport not configured. Provide GMAIL_USER and GOOGLE_REFRESH_TOKEN with a client_secret_*.json in project root, or set GMAIL_USER/GMAIL_PASS.");
}
const POST = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { reportText, userEmail } = body;
    if (!reportText || typeof reportText !== "string") {
      return new Response(JSON.stringify({ error: "reportText is required" }), { status: 400 });
    }
    const transporter = createTransport();
    const info = await transporter.sendMail({
      from: env.GMAIL_USER,
      to: env.GMAIL_USER,
      subject: "Issue Report -- ASU Marketplace",
      text: `Report from user ${userEmail || "Anonymous"}:

${reportText}`
    });
    return new Response(JSON.stringify({ ok: true, id: info.messageId }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
