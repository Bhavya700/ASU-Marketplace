/* empty css                                 */
import { c as createComponent, a as createAstro, b as addAttribute, d as renderHead, e as renderSlot, r as renderTemplate, f as renderComponent } from '../chunks/astro/server_DnXNO-3h.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "The ultimate campus marketplace for Arizona State University students." } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/asu-logo.png"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/bhavyapatel/Documents/CS/GTMarketPlace-main/ASU-Marketplace/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "ASU Marketplace - Campus Marketplace for Arizona State University" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/bhavyapatel/Documents/CS/GTMarketPlace-main/ASU-Marketplace/src/components/App", "client:component-export": "default" })} ` })}`;
}, "/Users/bhavyapatel/Documents/CS/GTMarketPlace-main/ASU-Marketplace/src/pages/index.astro", void 0);

const $$file = "/Users/bhavyapatel/Documents/CS/GTMarketPlace-main/ASU-Marketplace/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
