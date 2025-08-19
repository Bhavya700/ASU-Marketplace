import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'node:fs';
import path from 'node:path';

const env = import.meta.env;

function readGoogleClientFromJson() {
  try {
    const root = process.cwd();
    const files = fs.readdirSync(root).filter((f) => f.startsWith('client_secret_') && f.endsWith('.json'));
    if (files.length === 0) return null;
    const filePath = path.join(root, files[0]);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    const cfg = json.installed || json.web || {};
    const clientId: string | undefined = cfg.client_id;
    const clientSecret: string | undefined = cfg.client_secret;
    const redirectUri: string | undefined = Array.isArray(cfg.redirect_uris) ? cfg.redirect_uris[0] : cfg.redirect_uri;
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
    redirectUri: env.GOOGLE_REDIRECT_URI,
  } as { clientId?: string; clientSecret?: string; redirectUri?: string };

  if (fromEnv.clientId && fromEnv.clientSecret && fromEnv.redirectUri) return fromEnv;

  const fromJson = readGoogleClientFromJson();
  if (fromJson) return fromJson;

  return { clientId: undefined, clientSecret: undefined, redirectUri: undefined };
}

function createTransport() {
  const { clientId, clientSecret, redirectUri } = resolveGoogleConfig();
  const { GMAIL_USER, GMAIL_PASS, GOOGLE_REFRESH_TOKEN } = env;

  if (clientId && clientSecret && redirectUri && GOOGLE_REFRESH_TOKEN && GMAIL_USER) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId,
        clientSecret,
        refreshToken: GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  if (GMAIL_USER && GMAIL_PASS) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
  }

  throw new Error('Email transport not configured. Provide GMAIL_USER and GOOGLE_REFRESH_TOKEN with a client_secret_*.json in project root, or set GMAIL_USER/GMAIL_PASS.');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { reportText, userEmail } = body as { reportText?: string; userEmail?: string };

    if (!reportText || typeof reportText !== 'string') {
      return new Response(JSON.stringify({ error: 'reportText is required' }), { status: 400 });
    }

    const transporter = createTransport();

    const info = await transporter.sendMail({
      from: env.GMAIL_USER,
      to: env.GMAIL_USER,
      subject: 'Issue Report -- ASU Marketplace',
      text: `Report from user ${userEmail || 'Anonymous'}:\n\n${reportText}`,
    });

    return new Response(JSON.stringify({ ok: true, id: info.messageId }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 });
  }
};
