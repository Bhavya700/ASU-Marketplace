export { renderers } from '../../../renderers.mjs';

const GET = async ({ url }) => {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Auth</title></head>
<body>
<script>
  // Forward back to app root where client handles session
  window.location.replace('/');
<\/script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
