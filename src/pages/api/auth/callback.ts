import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  // Supabase handles tokens in URL fragments (#). We just serve a page that lets the client-side process it.
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Auth</title></head>
<body>
<script>
  // Forward back to app root where client handles session
  window.location.replace('/');
</script>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
