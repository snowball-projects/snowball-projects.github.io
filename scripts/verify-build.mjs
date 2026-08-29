import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, posix, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const siteOrigin = "https://snowball-projects.github.io";
const outputDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const sourceNoticePath = new URL(
  "../public/THIRD-PARTY-NOTICES.txt",
  import.meta.url,
);
const outputNoticePath = new URL(
  "../dist/THIRD-PARTY-NOTICES.txt",
  import.meta.url,
);
const katexLicensePath = new URL(
  "../node_modules/katex/LICENSE",
  import.meta.url,
);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}

function outputRelativePath(file) {
  return relative(outputDirectory, file).split(sep).join(posix.sep);
}

function publicPathForFile(file) {
  const path = outputRelativePath(file);

  if (path === "index.html") {
    return "/";
  }

  if (path.endsWith("/index.html")) {
    return `/${path.slice(0, -"index.html".length)}`;
  }

  return `/${path}`;
}

function getAttribute(tag, name) {
  const pattern = new RegExp(
    `\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = tag.match(pattern);
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined;
}

function textContent(markup) {
  return markup
    .replace(/<!--.*?-->/gs, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&[a-z0-9#]+;/gi, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function accessibleName(openingTag, contents = "") {
  const ariaLabel = getAttribute(openingTag, "aria-label")?.trim();

  if (ariaLabel) {
    return ariaLabel;
  }

  const imageAlts = [...contents.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => getAttribute(match[0], "alt")?.trim() ?? "")
    .join(" ");

  return `${textContent(contents)} ${imageAlts}`.trim();
}

function resolveOutputTarget(rawValue, sourcePublicPath) {
  const decodedValue = rawValue.replaceAll("&amp;", "&").trim();

  if (!decodedValue || /^(?:javascript|vbscript):/i.test(decodedValue)) {
    return { error: `unsafe or empty URL "${rawValue}"` };
  }

  if (/^data:/i.test(decodedValue)) {
    return sourcePublicPath.endsWith(".css")
      ? {}
      : { error: `unsafe data URL "${rawValue}"` };
  }

  if (/^(?:mailto|tel):/i.test(decodedValue)) {
    return {};
  }

  let url;

  try {
    url = new URL(decodedValue, `${siteOrigin}${sourcePublicPath}`);
  } catch {
    return { error: `invalid URL "${rawValue}"` };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { error: `unsupported URL scheme in "${rawValue}"` };
  }

  if (
    url.hostname === new URL(siteOrigin).hostname &&
    url.protocol !== "https:"
  ) {
    return { error: `insecure site URL "${rawValue}"` };
  }

  if (url.origin !== siteOrigin) {
    return {};
  }

  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return { error: `invalid encoded URL "${rawValue}"` };
  }

  const relativeTarget = pathname.replace(/^\/+/, "");
  const candidates = pathname.endsWith("/")
    ? [posix.join(relativeTarget, "index.html")]
    : [
        relativeTarget || "index.html",
        posix.join(relativeTarget, "index.html"),
        `${relativeTarget}.html`,
      ];

  return { candidates, hash: url.hash };
}

function checkReference(rawValue, sourcePublicPath, sourceLabel, outputFiles) {
  const resolution = resolveOutputTarget(rawValue, sourcePublicPath);

  if (resolution.error) {
    errors.push(`${sourceLabel}: ${resolution.error}`);
    return;
  }

  if (!resolution.candidates) {
    return;
  }

  const target = resolution.candidates.find((candidate) =>
    outputFiles.has(candidate),
  );

  if (!target) {
    errors.push(`${sourceLabel}: missing internal target "${rawValue}"`);
    return;
  }

  if (resolution.hash && target.endsWith(".html")) {
    const targetHtml = outputFiles.get(target);
    const fragment = decodeURIComponent(resolution.hash.slice(1));
    const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fragmentPattern = new RegExp(
      `\\s(?:id|name)=["']${escapedFragment}["']`,
      "i",
    );

    if (!fragmentPattern.test(targetHtml)) {
      errors.push(`${sourceLabel}: missing fragment target "${rawValue}"`);
    }
  }
}

function checkHtml(file, html, outputFiles) {
  const label = outputRelativePath(file);
  const publicPath = publicPathForFile(file);
  const isRedirect = /<meta\b[^>]*http-equiv=["']refresh["']/i.test(html);

  if (!isRedirect) {
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0];

    if (!htmlTag || !getAttribute(htmlTag, "lang")?.trim()) {
      errors.push(`${label}: <html> must declare a nonempty lang attribute`);
    }

    const mainCount = (html.match(/<main\b/gi) ?? []).length;

    if (mainCount !== 1) {
      errors.push(`${label}: expected exactly one <main>, found ${mainCount}`);
    }

    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gis)];
    const h1Count = headings.filter((heading) => heading[1] === "1").length;

    if (h1Count !== 1) {
      errors.push(`${label}: expected exactly one <h1>, found ${h1Count}`);
    }

    if (headings.length > 0 && headings[0][1] !== "1") {
      errors.push(`${label}: the first heading must be <h1>`);
    }

    let previousHeadingLevel;

    for (const heading of headings) {
      const level = Number(heading[1]);

      if (!textContent(heading[2])) {
        errors.push(`${label}: <h${level}> must have a nonempty name`);
      }

      if (previousHeadingLevel && level > previousHeadingLevel + 1) {
        errors.push(
          `${label}: heading level skips from h${previousHeadingLevel} to h${level}`,
        );
      }

      previousHeadingLevel = level;
    }
  }

  for (const link of html.matchAll(/(<a\b[^>]*>)(.*?)<\/a>/gis)) {
    const href = getAttribute(link[1], "href");

    if (!href) {
      errors.push(`${label}: link is missing a nonempty href`);
    }

    if (!accessibleName(link[1], link[2])) {
      errors.push(`${label}: link is missing a nonempty accessible name`);
    }
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (getAttribute(image[0], "alt") === undefined) {
      errors.push(`${label}: image is missing an alt attribute`);
    }
  }

  for (const button of html.matchAll(/(<button\b[^>]*>)(.*?)<\/button>/gis)) {
    if (!accessibleName(button[1], button[2])) {
      errors.push(`${label}: button is missing a nonempty accessible name`);
    }
  }

  const labelIds = new Set();

  for (const labelMatch of html.matchAll(/(<label\b[^>]*>)(.*?)<\/label>/gis)) {
    if (!accessibleName(labelMatch[1], labelMatch[2])) {
      errors.push(`${label}: form label is missing a nonempty name`);
    }

    const forId = getAttribute(labelMatch[1], "for");

    if (forId) {
      labelIds.add(forId);
    }
  }

  for (const control of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = control[0];
    const type = getAttribute(tag, "type")?.toLowerCase();

    if (type === "hidden") {
      continue;
    }

    const id = getAttribute(tag, "id");
    const hasName =
      Boolean(getAttribute(tag, "aria-label")?.trim()) ||
      Boolean(getAttribute(tag, "aria-labelledby")?.trim()) ||
      Boolean(id && labelIds.has(id)) ||
      (["button", "submit", "reset"].includes(type ?? "") &&
        Boolean(getAttribute(tag, "value")?.trim())) ||
      (type === "image" && Boolean(getAttribute(tag, "alt")?.trim()));

    if (!hasName) {
      errors.push(`${label}: ${control[1]} is missing an accessible label`);
    }
  }

  for (const attribute of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)) {
    checkReference(attribute[1], publicPath, label, outputFiles);
  }

  for (const srcset of html.matchAll(/\ssrcset=["']([^"']+)["']/gi)) {
    for (const candidate of srcset[1].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      checkReference(url, publicPath, label, outputFiles);
    }
  }
}

function checkCss(file, css, outputFiles) {
  const label = outputRelativePath(file);
  const publicPath = publicPathForFile(file);

  for (const match of css.matchAll(
    /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\s*\)/gi,
  )) {
    checkReference(
      match[1] ?? match[2] ?? match[3],
      publicPath,
      label,
      outputFiles,
    );
  }
}

const [sourceNotice, outputNotice, katexLicense, outputPaths] =
  await Promise.all([
    readFile(sourceNoticePath, "utf8"),
    readFile(outputNoticePath, "utf8"),
    readFile(katexLicensePath, "utf8"),
    walk(outputDirectory),
  ]);

assert.equal(
  sourceNotice,
  `KaTeX\n\n${katexLicense}`,
  "The public KaTeX notice must match the license from the installed package.",
);

assert.equal(
  outputNotice,
  sourceNotice,
  "The deployed third-party notices must match the canonical public file.",
);

const outputFiles = new Map(
  await Promise.all(
    outputPaths.map(async (file) => [
      outputRelativePath(file),
      await readFile(file, "utf8").catch(() => ""),
    ]),
  ),
);

const updatedArticle = outputFiles.get("writing/choosing-a-center/index.html");

assert.ok(
  updatedArticle,
  "The corrected choosing-a-center article must be present in the build.",
);
assert.match(
  updatedArticle,
  /class="article-meta__updated">\s*Updated\s*<time datetime="2026-08-29T00:00:00\.000Z">\s*August 29, 2026\s*<\/time>/,
  "The corrected choosing-a-center article must render its visible updated date.",
);

for (const file of outputPaths) {
  const contents = outputFiles.get(outputRelativePath(file));

  if (file.endsWith(".html")) {
    checkHtml(file, contents, outputFiles);
  } else if (file.endsWith(".css")) {
    checkCss(file, contents, outputFiles);
  }
}

const manifest = JSON.parse(
  await readFile(join(outputDirectory, "site.webmanifest"), "utf8"),
);

for (const icon of manifest.icons ?? []) {
  checkReference(
    icon.src,
    "/site.webmanifest",
    "site.webmanifest",
    outputFiles,
  );
}

assert.deepEqual(
  errors,
  [],
  `Static site verification failed:\n${errors.join("\n")}`,
);
