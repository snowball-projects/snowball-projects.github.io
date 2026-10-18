import assert from "node:assert/strict";
import test from "node:test";
import config from "../astro.config.mjs";

const renderer = await config.markdown.processor.createRenderer({});

async function render(markdown) {
  return (await renderer.render(markdown)).code;
}

test("renders inline and display math through the production Markdown plugins", async () => {
  const html = await render("Inline $x^2$\n\n$$\n\\frac{1}{2}\n$$");
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /<math/);
  assert.doesNotMatch(html, /katex-error/);
});

test("math cannot enable untrusted links, images or raw HTML", async () => {
  const html = await render(String.raw`$\href{javascript:alert(1)}{click}$

$\includegraphics{https://example.com/track.png}$

$\htmlClass{injected}{x}$`);
  assert.doesNotMatch(html, /<(?:a|img|script)\b/);
  assert.doesNotMatch(html, /class="injected"/);
  assert.match(html, /class="katex"/);
});

test("malformed math produces readable fallback without executable markup", async () => {
  const html = await render(String.raw`$\frac{<script>alert(1)</script>$`);
  assert.match(html, /katex-error/);
  assert.doesNotMatch(html, /<script\b/);
  assert.match(html, /(?:&lt;|&#x3C;)script(?:&gt;|>)/);
});
