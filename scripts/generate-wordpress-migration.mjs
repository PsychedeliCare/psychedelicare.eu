import fs from "node:fs/promises";
import path from "node:path";

import { XMLParser } from "fast-xml-parser";
import { load as loadHtml } from "cheerio";
import TurndownService from "turndown";
import YAML from "yaml";

const workspaceRoot = "/workspace";
const importXmlPath = path.join(
  workspaceRoot,
  "import",
  "psychedelicareeu.WordPress.2026-04-12.xml",
);
const contentRoot = path.join(workspaceRoot, "src", "content", "pages");
const dataRoot = path.join(workspaceRoot, "src", "data");

const localeMap = new Map([
  ["en", "en"],
  ["de", "de"],
  ["el", "el"],
  ["es", "es"],
  ["eu", "eu"],
  ["fr", "fr"],
  ["hr", "hr"],
  ["it", "it"],
  ["pl", "pl"],
  ["pt-pt", "pt"],
  ["sl", "sl"],
  ["ca", "ca"],
]);

const legacyPathAliases = {
  "de:/datenschutzbestimmungen": "/privacy-policy",
  "de:/gruende": "/reasons",
  "de:/psychedelicare-initiative": "/",
  "de:/medien": "/media",
  "de:/rechtslage-und-geschichte": "/legal-and-history",
  "de:/buecher-und-dokumentarfilme": "/books-and-documentaries",
  "de:/wissenschaftliche-studien": "/scientific-studies",
  "el:/%ce%bb%cf%8c%ce%b3%ce%bf%ce%b9": "/reasons",
  "el:/%cf%80%cf%81%cf%89%cf%84%ce%bf%ce%b2%ce%bf%cf%85%ce%bb%ce%af%ce%b1-psychedelicare":
    "/",
  "el:/%ce%bc%ce%ad%cf%83%ce%b1-%ce%b5%ce%bd%ce%b7%ce%bc%ce%ad%cf%81%cf%89%cf%83%ce%b7%cf%82":
    "/media",
  "el:/%ce%bd%ce%bf%ce%bc%ce%b9%ce%ba%ce%ac-%ce%ba%ce%b1%ce%b9-%ce%b9%cf%83%cf%84%ce%bf%cf%81%ce%af%ce%b1":
    "/legal-and-history",
  "el:/%ce%b2%ce%b9%ce%b2%ce%bb%ce%af%ce%b1-%ce%ba%ce%b1%ce%b9-%ce%bd%cf%84%ce%bf%ce%ba%ce%b9%ce%bc%ce%b1%ce%bd%cf%84%ce%ad%cf%81":
    "/books-and-documentaries",
  "el:/%ce%b5%cf%80%ce%b9%cf%83%cf%84%ce%b7%ce%bc%ce%bf%ce%bd%ce%b9%ce%ba%ce%ad%cf%82-%ce%bc%ce%b5%ce%bb%ce%ad%cf%84%ce%b5%cf%82":
    "/scientific-studies",
  "es:/politica-de-privacidad": "/privacy-policy",
  "es:/las-razones": "/reasons",
  "es:/iniciativa-psychedelicare": "/",
  "es:/medios-de-comunicacion": "/media",
  "es:/legal-e-historia": "/legal-and-history",
  "es:/libros-y-documentales": "/books-and-documentaries",
  "es:/estudios-cientificos": "/scientific-studies",
  "eu:/pribatutasun-politika": "/privacy-policy",
  "eu:/legezko": "/legal",
  "eu:/arrazoiak": "/reasons",
  "eu:/psychedelicare-ekimena": "/",
  "eu:/komunikabideak": "/media",
  "eu:/zuzenbidea-eta-historia": "/legal-and-history",
  "eu:/liburuak-eta-dokumentalak": "/books-and-documentaries",
  "eu:/zientzia-ikasketak": "/scientific-studies",
  "fr:/politique-de-confidentialite": "/privacy-policy",
  "fr:/juridique": "/legal",
  "fr:/raisons": "/reasons",
  "fr:/initiative-psychedelicare": "/",
  "fr:/les-medias": "/media",
  "fr:/juridique-et-historique": "/legal-and-history",
  "fr:/livres-et-documentaires": "/books-and-documentaries",
  "fr:/etudes-scientifiques": "/scientific-studies",
  "hr:/pravila-o-privatnosti": "/privacy-policy",
  "hr:/pravno": "/legal",
  "hr:/razlozi": "/reasons",
  "hr:/inicijativa-psychedelicare": "/",
  "hr:/mediji": "/media",
  "hr:/pravo-i-povijest": "/legal-and-history",
  "hr:/knjige-i-dokumentarci": "/books-and-documentaries",
  "hr:/znanstvene-studije": "/scientific-studies",
  "it:/motivazioni": "/reasons",
  "it:/iniziativa-psychedelicare": "/",
  "it:/storia-e-diritto": "/legal-and-history",
  "it:/libri-e-documentari": "/books-and-documentaries",
  "it:/studi-scientifici": "/scientific-studies",
  "pl:/polityka-prywatnosci": "/privacy-policy",
  "pl:/prawne": "/legal",
  "pl:/motywy": "/reasons",
  "pl:/inicjatywa-psychedelicare": "/",
  "pl:/prawo-i-historia": "/legal-and-history",
  "pl:/ksiazki-i-filmy-dokumentalne": "/books-and-documentaries",
  "pl:/badania-naukowe": "/scientific-studies",
  "pt:/politica-de-privacidade": "/privacy-policy",
  "pt:/motivos": "/reasons",
  "pt:/iniciativa-psychedelicare": "/",
  "pt:/meios-de-comunicacao-social": "/media",
  "pt:/juridico-e-historico": "/legal-and-history",
  "pt:/livros-e-documentarios": "/books-and-documentaries",
  "pt:/estudos-cientificos": "/scientific-studies",
  "sl:/politika-zasebnosti": "/privacy-policy",
  "sl:/pravni-naslov": "/legal",
  "sl:/razlogi": "/reasons",
  "sl:/pobuda-psychedelicare": "/",
  "sl:/mediji": "/media",
  "sl:/pravni-in-zgodovinski-vidiki": "/legal-and-history",
  "sl:/knjige-in-dokumentarni-filmi": "/books-and-documentaries",
  "sl:/znanstvene-studije": "/scientific-studies",
  "ca:/politica-de-privacitat": "/privacy-policy",
  "ca:/raons": "/reasons",
  "ca:/iniciativa-psychedelicare": "/",
  "ca:/mitjans-de-comunicacio": "/media",
  "ca:/dret-i-historia": "/legal-and-history",
  "ca:/llibres-i-documentals": "/books-and-documentaries",
  "ca:/estudis-cientifics": "/scientific-studies",
};

const canonicalPageMappings = {
  "/": {
    slug: "",
    pageType: "home",
    pageKey: "home",
    section: "home",
    oldSlug: "psychedelicare-initiative",
  },
  "/about-us": {
    slug: "who-we-are",
    pageType: "page",
    pageKey: "who-we-are",
    section: "who-we-are",
  },
  "/partners": {
    slug: "projects/partnerships-collaborations",
    pageType: "page",
    pageKey: "projects/partnerships-collaborations",
    section: "projects",
  },
  "/legal": {
    slug: "legal",
    pageType: "page",
    pageKey: "legal",
    section: "legal",
  },
  "/privacy-policy": {
    slug: "privacy-policy",
    pageType: "page",
    pageKey: "privacy-policy",
    section: "legal",
  },
  "/news": {
    slug: "news",
    pageType: "news-hub",
    pageKey: "news",
    section: "news",
  },
  "/reasons": {
    slug: "projects/eci",
    pageType: "page",
    pageKey: "projects/eci",
    section: "projects",
  },
  "/resources-and-faq": {
    slug: "resources",
    pageType: "page",
    pageKey: "resources",
    section: "resources",
  },
  "/faq-about-psychedelics": {
    slug: "resources/faq-about-psychedelics",
    pageType: "page",
    pageKey: "resources/faq-about-psychedelics",
    section: "resources",
  },
  "/media": {
    slug: "resources/media-press-kit",
    pageType: "page",
    pageKey: "resources/media-press-kit",
    section: "resources",
  },
  "/legal-and-history": {
    slug: "resources/psychedelic-substances-safety-legal-issues",
    pageType: "page",
    pageKey: "resources/psychedelic-substances-safety-legal-issues",
    section: "resources",
  },
  "/books-and-documentaries": {
    slug: "resources/educational-material",
    pageType: "page",
    pageKey: "resources/educational-material",
    section: "resources",
  },
  "/scientific-studies": {
    slug: "resources/scientific-studies",
    pageType: "page",
    pageKey: "resources/scientific-studies",
    section: "resources",
  },
  "/donate": {
    slug: "donate",
    pageType: "page",
    pageKey: "donate",
    section: "standalone",
  },
  "/join-the-psychedelicare-association": {
    slug: "join-the-psychedelicare-association",
    pageType: "page",
    pageKey: "join-the-psychedelicare-association",
    section: "standalone",
  },
  "/cookie-policy-eu": {
    slug: "cookie-policy-eu",
    pageType: "page",
    pageKey: "cookie-policy-eu",
    section: "standalone",
  },
};

const newsSections = {
  "campaign-news": {
    slug: "news",
    pageType: "news-post",
    section: "news",
  },
  events: {
    slug: "news/events",
    pageType: "news-post",
    section: "news/events",
  },
  comments: {
    slug: "news/reports",
    pageType: "news-post",
    section: "news/reports",
  },
};

const categoryAliases = {
  "kampagnen-nachrichten": "campaign-news",
  "noticies-de-la-campanya": "campaign-news",
  "noticias-de-la-campana": "campaign-news",
  "%ce%bd%ce%ad%ce%b1-%cf%84%ce%b7%cf%82-%ce%b5%ce%ba%cf%83%cf%84%cf%81%ce%b1%cf%84%ce%b5%ce%af%ce%b1%cf%82":
    "campaign-news",
  "notizie-sulla-campagna": "campaign-news",
  "nouvelles-de-la-campagne": "campaign-news",
  "vijesti-iz-kampanje": "campaign-news",
  "kanpainaren-berriak": "campaign-news",
  "novice-o-kampanji": "campaign-news",
  "noticias-da-campanha": "campaign-news",
  "wiadomosci-o-kampanii": "campaign-news",
  veranstaltungen: "events",
  evenements: "events",
  dogadaji: "events",
  esdeveniments: "events",
  dogodki: "events",
  wydarzenia: "events",
  eventi: "events",
  gertaerak: "events",
  eventos: "events",
  "%ce%b5%ce%ba%ce%b4%ce%b7%ce%bb%cf%8e%cf%83%ce%b5%ce%b9%cf%82": "events",
  comentarios: "comments",
  commenti: "comments",
  comentaris: "comments",
  komentarze: "comments",
  komentari: "comments",
  commentaires: "comments",
  kommentare: "comments",
  "%cf%83%cf%87%cf%8c%ce%bb%ce%b9%ce%b1": "comments",
  komentarji: "comments",
  iruzkinak: "comments",
};

const badContentRules = [
  /https?:\/\/casinotest2/gi,
  /https?:\/\/znaki\.fm\/ch-de\/casinos/gi,
  /<p>\s*test\s*<a[^>]+casinotest2[^>]*>.*?<\/a>\s*test\s*<\/p>/gis,
  /<h2>Top Online-Casinos[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /<h2>Os melhores casinos online[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /<h2>Los mejores casinos en línea[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /<h2>Top spletne igralnice[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /<h2>Sareko kasino nagusiak[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /<h2>Κορυφαία online καζίνο[\s\S]*?(?=<\/div>|<h[1-6]|$)/gis,
  /testtest2 test/gi,
];

const junkPostIds = new Set(["17671"]);
const junkPostTitles = new Set(["144922761763262485"]);
const junkPostPaths = new Set(["/2025/11/144922761763262485-8"]);
const socialLinks = {
  Instagram: "https://www.instagram.com/psychedelicare.eu/",
  LinkedIn: "https://www.linkedin.com/company/psychedelicare",
  Facebook: "https://www.facebook.com/Psychedelicare.EU",
  X: "https://x.com/psychedelicareu?s=11",
  YouTube: "https://www.youtube.com/@PsychedeliCare",
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: false,
  trimValues: false,
  processEntities: true,
});

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

turndown.addRule("details", {
  filter: ["details", "summary"],
  replacement(content, node) {
    if (node.nodeName === "SUMMARY") {
      return `**${content.trim()}**\n\n`;
    }

    return `${content.trim()}\n\n`;
  },
});

turndown.addRule("iframe", {
  filter: ["iframe"],
  replacement(_content, node) {
    const src = node.getAttribute("src");
    return src ? `[Embedded content](${src})\n\n` : "";
  },
});

function normalizeLocale(locale) {
  return localeMap.get(locale ?? "en") ?? "en";
}

function parseLegacyPath(link) {
  const url = new URL(link);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { locale: "en", localeSegment: "", path: "/" };
  }

  const [first, ...rest] = parts;
  if (localeMap.has(first)) {
    return {
      locale: normalizeLocale(first),
      localeSegment: first,
      path: `/${rest.join("/")}` || "/",
    };
  }

  return {
    locale: "en",
    localeSegment: "",
    path: `/${parts.join("/")}` || "/",
  };
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getCanonicalLegacyPath(locale, legacyPath) {
  return legacyPathAliases[`${locale}:${legacyPath}`] ?? legacyPath;
}

function flattenText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join("");
  if (typeof value === "object") {
    return Object.values(value).map(flattenText).join("");
  }
  return String(value);
}

function sanitizeHtml(html, context = {}) {
  let sanitized = html.replace(/\u00a0/g, " ");

  for (const rule of badContentRules) {
    sanitized = sanitized.replace(rule, "");
  }

  sanitized = sanitized.replace(/\?fbclid=[^"'&)\s>]+/gi, "");
  sanitized = sanitized.replace(/\s+data-cke-saved-href="[^"]*"/gi, "");
  sanitized = sanitized.replace(/\[smartslider3[^\]]*\]/gi, "");
  sanitized = sanitized.replace(/\[twingle[^\]]*\]/gi, "");
  sanitized = sanitized.replace(/\[civicrm[^\]]*\]/gi, "");
  sanitized = sanitized.replace(/\[cmplz-document[^\]]*\]/gi, "");
  sanitized = sanitized.replace(/\[\/*vc_[^\]]*\]/gi, "");

  if (context.slug === "" || context.oldSlug?.includes("psychedelicare-initiative")) {
    sanitized = sanitized.replace(
      /<p>\s*test\s*<\/p>/gi,
      "",
    );
  }

  return sanitized.trim();
}

function extractAssetUrls(html) {
  const matches = html.match(
    /https?:\/\/[^"'>\s]+\/(?:wp-content\/uploads|wp-content\/themes|wp-content\/plugins)\/[^"'>\s]+/gi,
  );
  return Array.from(new Set(matches ?? [])).sort();
}

function stripContainerNoise($) {
  $("script, style, noscript").remove();
  $("span[style='display:none']").remove();
  $("div.elementor-widget-shortcode").remove();
  $("p").each((_index, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    if (!text && $(element).find("img, a, strong, em, iframe").length === 0) {
      $(element).remove();
    }
  });
}

function transformLegacyInternalLink(href, redirectsByLegacyPath) {
  if (!href) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return href;
  }

  let url;
  try {
    url = new URL(href, "https://psychedelicare.eu");
  } catch {
    return href;
  }

  if (url.hostname !== "psychedelicare.eu") {
    return href.replace(/\?fbclid=[^"'&)\s>]+/gi, "");
  }

  const { locale, path: legacyPath } = parseLegacyPath(url.toString());
  const redirectTarget = redirectsByLegacyPath.get(`${locale}:${legacyPath}`);

  if (redirectTarget) {
    const hash = url.hash || "";
    return `${redirectTarget}${hash}`;
  }

  return href.replace(/\?fbclid=[^"'&)\s>]+/gi, "");
}

function convertHtmlToMdx(html, context, redirectsByLegacyPath) {
  const $ = loadHtml(`<main>${html}</main>`, {
    decodeEntities: false,
  });

  stripContainerNoise($);

  $("a").each((_index, element) => {
    const href = $(element).attr("href");
    if (!href) return;

    const nextHref = transformLegacyInternalLink(href, redirectsByLegacyPath);
    $(element).attr("href", nextHref);

    const linkText = $(element).text().replace(/\s+/g, " ").trim();
    if (!linkText) {
      if (nextHref.includes("instagram.com")) $(element).text("Instagram");
      else if (nextHref.includes("linkedin.com")) $(element).text("LinkedIn");
      else if (nextHref.includes("facebook.com")) $(element).text("Facebook");
      else if (nextHref.includes("youtube.com")) $(element).text("YouTube");
      else if (nextHref.includes("x.com") || nextHref.includes("twitter.com")) {
        $(element).text("X");
      } else {
        $(element).remove();
      }
    }

    if ($(element).text().trim() === "Psychedelicare.eu") {
      $(element).text("PsychedeliCare");
    }
  });

  $("img").each((_index, element) => {
    const src = $(element).attr("src");
    if (!src) return;

    const alt = $(element).attr("alt") || "Referenced WordPress asset";
    $(element).replaceWith(`<p><em>Referenced image asset:</em> <a href="${src}">${alt}</a></p>`);
  });

  $("iframe").each((_index, element) => {
    const src = $(element).attr("src");
    $(element).replaceWith(src ? `<p><a href="${src}">Embedded content</a></p>` : "");
  });

  const main = $("main").html()?.trim() ?? "";
  let md = turndown.turndown(main);

  md = md.replace(/\n{3,}/g, "\n\n").trim();
  md = md.replace(/testtest2 test/gi, "");

  if (context.slug === "") {
    md = md.replace(
      /First Name\s+Last Name\s+Email[\s\S]*?Get Your Activist Pack/gi,
      "Subscribe to our updates or join the team to stay involved with the campaign.\n\nGet Your Activist Pack",
    );
  }

  if (!md) {
    if (context.pageType === "news-hub") {
      return "## News\n\nBrowse campaign updates, events, and stories from across Europe.\n";
    }

    return `## ${context.title}\n`;
  }

  return `${md}\n`;
}

function quoteYamlString(value) {
  return JSON.stringify(String(value));
}

function codeBlock(language, content) {
  return `\`\`\`${language}\n${content.trim()}\n\`\`\`\n`;
}

function normalizeWhitespace(text) {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function makeExcerpt(text, maxLength = 240) {
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}…`;
}

function toHtml($elements) {
  return $elements
    .map((_index, element) => loadHtml(element).html() ?? "")
    .get()
    .join("\n");
}

function sanitizeInlineHtml(html) {
  return sanitizeHtml(html)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function rewriteLinksInHtml(html, redirectsByLegacyPath) {
  const $ = loadHtml(`<div>${html}</div>`, {
    decodeEntities: false,
  });

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    $(element).attr("href", transformLegacyInternalLink(href, redirectsByLegacyPath));
  });

  return $("div").html() ?? html;
}

function escapeAttribute(value) {
  return String(value).replace(/"/g, "&quot;");
}

function extractFaqFromResources(entry, redirectsByLegacyPath) {
  const $ = loadHtml(`<main>${entry.html}</main>`, {
    decodeEntities: false,
  });
  const items = [];
  let currentQuestion = null;
  let answerNodes = [];

  $("main")
    .children()
    .each((_index, element) => {
      const node = $(element);
      if (node.is("h4")) {
        if (currentQuestion && answerNodes.length > 0) {
          const answerHtml = rewriteLinksInHtml(
            sanitizeInlineHtml(toHtml($(answerNodes))),
            redirectsByLegacyPath,
          );
          items.push({
            question: currentQuestion,
            answer: answerHtml,
          });
        }
        currentQuestion = normalizeWhitespace(node.text());
        answerNodes = [];
      } else if (currentQuestion) {
        answerNodes.push(element);
      }
    });

  if (currentQuestion && answerNodes.length > 0) {
    const answerHtml = rewriteLinksInHtml(
      sanitizeInlineHtml(toHtml($(answerNodes))),
      redirectsByLegacyPath,
    );
    items.push({
      question: currentQuestion,
      answer: answerHtml,
    });
  }

  return items.filter((item) => item.question && item.answer);
}

function buildFaqPageBody(entry, redirectsByLegacyPath) {
  const items = extractFaqFromResources(entry, redirectsByLegacyPath);

  if (items.length === 0) {
    return convertHtmlToMdx(sanitizeHtml(entry.html, entry), entry, redirectsByLegacyPath);
  }

  const serializedItems = items
    .map(
      (item) => `  {\n    question: ${quoteYamlString(item.question)},\n    answer: ${quoteYamlString(item.answer)},\n  },`,
    )
    .join("\n");

  return `import Accordion from "${makeRelativeComponentImport(entry.slug, "Accordion")}";\n\n## Frequently asked questions\n\n<Accordion items={[\n${serializedItems}\n]} />\n`;
}

function parseWhoWeArePeople(entry) {
  const $ = loadHtml(`<main>${entry.html}</main>`, {
    decodeEntities: false,
  });

  const groups = [];
  let currentGroup = null;
  let currentPerson = null;
  let lastImage = null;

  function pushCurrentPerson() {
    if (!currentPerson) return;
    currentPerson.bio = normalizeWhitespace(currentPerson.bio || "");
    currentGroup?.people.push(currentPerson);
    currentPerson = null;
  }

  function pushCurrentGroup() {
    if (!currentGroup) return;
    pushCurrentPerson();
    groups.push(currentGroup);
    currentGroup = null;
  }

  $("main")
    .children()
    .each((_index, element) => {
      const node = $(element);

      if (node.is("h2")) {
        const heading = normalizeWhitespace(node.text());
        if (["European Team", "National Team Coordinators"].includes(heading)) {
          if (currentGroup) {
            pushCurrentGroup();
          }
          currentGroup = {
            title: heading,
            people: [],
          };
          currentPerson = null;
          lastImage = null;
        } else if (currentGroup) {
          pushCurrentGroup();
        }
        return;
      }

      if (!currentGroup) return;

      const imageCandidate = node.is("img") ? node : node.find("img").first();
      if (imageCandidate.length > 0) {
        lastImage = imageCandidate.attr("src") || lastImage;
        return;
      }

      if (node.is("p") && node.find("a").length === 1 && node.text().includes("Referenced image asset")) {
        lastImage = node.find("a").attr("href") || undefined;
        return;
      }

      if (node.is("h4")) {
        pushCurrentPerson();
        const rawName = normalizeWhitespace(node.text().replace(/\*/g, ""));
        const locationMatch = rawName.match(/\(([^)]+)\)$/);
        currentPerson = {
          name: rawName.replace(/\s*\([^)]+\)\s*$/, "").trim(),
          location: locationMatch?.[1],
          role: undefined,
          email: undefined,
          website: undefined,
          image: lastImage,
          bio: "",
        };
        lastImage = null;
        return;
      }

      if (!currentPerson) return;

      if (node.is("h5")) {
        currentPerson.role = normalizeWhitespace(node.text().replace(/\*/g, ""));
        return;
      }

      if (node.is("p")) {
        const links = node.find("a");
        if (!currentPerson.email) {
          const mailto = links
            .map((_linkIndex, link) => $(link).attr("href"))
            .get()
            .find((href) => href?.startsWith("mailto:"));
          if (mailto) {
            currentPerson.email = mailto.replace(/^mailto:\s*/i, "").split("?")[0].trim();
          }
        }

        if (!currentPerson.website) {
          const site = links
            .map((_linkIndex, link) => $(link).attr("href"))
            .get()
            .find((href) => href && !href.startsWith("mailto:"));
          if (site) {
            currentPerson.website = site;
          }
        }

        const text = normalizeWhitespace(node.text().replace(/\[.*?\]/g, ""));
        if (text) {
          currentPerson.bio = currentPerson.bio
            ? `${currentPerson.bio} ${text}`
            : text;
        }
      }
    });

  if (currentGroup) {
    pushCurrentGroup();
  }

  return groups.filter((group) => group.people.length > 0);
}

function buildWhoWeAreBody(entry, redirectsByLegacyPath) {
  const groups = parseWhoWeArePeople(entry);

  if (groups.length === 0) {
    return convertHtmlToMdx(sanitizeHtml(entry.html, entry), entry, redirectsByLegacyPath);
  }

  const intro = "PsychedeliCare brings together researchers, clinicians, artists, policy experts, and grassroots organizers working across Europe to improve access to safe, ethical psychedelic care.";
  let body = `import PeopleGrid from "${makeRelativeComponentImport(entry.slug, "PeopleGrid")}";\n`;
  body += `import Callout from "${makeRelativeComponentImport(entry.slug, "Callout")}";\n\n`;
  body += `## Who we are\n\n${intro}\n\n`;
  body += `<Callout title="Join the movement" body="Would you like to support a national team or help build one where you live?" href="mailto:info@psychedelicare.eu" label="Contact the team" />\n\n`;

  for (const group of groups) {
    const serializedPeople = group.people
      .map((person) => {
        const fields = [
          `name: ${quoteYamlString(person.name)}`,
          person.role ? `role: ${quoteYamlString(person.role)}` : null,
          person.location ? `location: ${quoteYamlString(person.location)}` : null,
          person.email ? `email: ${quoteYamlString(person.email)}` : null,
          person.website ? `website: ${quoteYamlString(person.website)}` : null,
          person.image ? `image: ${quoteYamlString(person.image)}` : null,
          person.bio ? `bio: ${quoteYamlString(makeExcerpt(person.bio, 520))}` : null,
        ].filter(Boolean);

        return `  {\n    ${fields.join(",\n    ")}\n  },`;
      })
      .join("\n");

    body += `<PeopleGrid title=${quoteYamlString(group.title)} people={[\n${serializedPeople}\n]} />\n\n`;
  }

  return body;
}

function parsePartners(entry) {
  const $ = loadHtml(`<main>${entry.html}</main>`, {
    decodeEntities: false,
  });
  const partners = [];
  const seen = new Set();

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");
    const text = normalizeWhitespace($(element).text());
    if (!href || !text || href.startsWith("mailto:")) return;
    if (href.includes("psychedelicare.eu")) return;
    const key = `${text}|${href}`;
    if (seen.has(key)) return;
    seen.add(key);
    partners.push({
      name: text,
      url: href,
    });
  });

  return partners;
}

function buildPartnersBody(entry, redirectsByLegacyPath) {
  const partners = parsePartners(entry);

  if (partners.length === 0) {
    return convertHtmlToMdx(sanitizeHtml(entry.html, entry), entry, redirectsByLegacyPath);
  }

  const serializedPartners = partners
    .map(
      (partner) => `  {\n    name: ${quoteYamlString(partner.name)},\n    url: ${quoteYamlString(partner.url)},\n  },`,
    )
    .join("\n");

  return `import PartnerGrid from "${makeRelativeComponentImport(entry.slug, "PartnerGrid")}";\n\n## Partnerships & collaborations\n\nPsychedeliCare collaborates with associations and organisations inside and outside the European Union that share its goals and mission.\n\n<PartnerGrid partners={[\n${serializedPartners}\n]} />\n`;
}

function buildHomeBody(entry, redirectsByLegacyPath) {
  const hero = `# Let’s care together

74,016 citizens from 27 countries launched a movement for mental health in Europe. Our volunteers continue breaking taboos, opening vital conversations, and pushing for safe, ethical access to psychedelic-assisted therapies.

[Explore the initiative](/projects/eci) · [Support the campaign](/donate)
`;

  const whyItMatters = `## Why this matters

Across the European Union, millions of people live with depression, anxiety, PTSD, burnout, insomnia, and addictions while current treatment options often fall short. Psychedelic-assisted therapies are showing promise in research, and Europe should not fall behind.
`;

  const requests = `## The three requests

- **Creation of European standards** for safe and responsible psychedelic-assisted therapies.
- **Increase of EU funding for research** so evidence can keep growing.
- **A unified international stance** on the legal classification of psychedelics.

[Read more about the ECI demands](https://citizens-initiative.europa.eu/initiatives/details/2024/000011_en)
`;

  const involvement = `## Get involved

Want to stay in touch or support your local team? Reach out and we will connect you with the right people and resources.

[Join the association](/join-the-psychedelicare-association) · [Read about the team](/who-we-are) · [Get the activist pack](https://drive.google.com/drive/folders/1jouo8ccXUdB8OSpAsXyQYQU75hJ8VS-e?usp=drive_link)
`;

  const socialCards = Object.entries(socialLinks)
    .map(
      ([label, href]) =>
        `  { title: ${quoteYamlString(label)}, href: ${quoteYamlString(href)} },`,
    )
    .join("\n");

  return `import CardGrid from "${makeRelativeComponentImport(entry.slug, "CardGrid")}";\nimport Callout from "${makeRelativeComponentImport(entry.slug, "Callout")}";\n\n${hero}\n\n${whyItMatters}\n\n${requests}\n\n## Who we are\n\nPsychedeliCare brings together scientists, medical doctors, therapists, researchers, artists, policy experts, and grassroots organisers from across Europe.\n\n[Meet the movement](/who-we-are)\n\n<Callout title="Support the initiative" body="Help us reach more people, organise events, and keep this pan-European campaign moving." href="/donate" label="Donate" tone="accent" />\n\n${involvement}\n\n## Follow us\n\n<CardGrid cards={[\n${socialCards}\n]} />\n`;
}

function buildNewsHubBody(entry, redirectsByLegacyPath) {
  const sections = [
    {
      title: "Events",
      description: "Talks, gatherings, screenings, and community events.",
      href: "/news/events",
    },
    {
      title: "National news",
      description: "Updates from local teams and national campaign efforts.",
      href: "/news/national-news",
    },
    {
      title: "Reports",
      description: "Commentary, reporting, and public documentation.",
      href: "/news/reports",
    },
    {
      title: "Social media publications",
      description: "A place for future campaign highlights and multimedia updates.",
      href: "/news/social-media-publications",
    },
    {
      title: "Newsletter archive",
      description: "Past newsletters and campaign mailings.",
      href: "/news/newsletter-archive",
    },
  ];

  const serializedCards = sections
    .map(
      (section) =>
        `  { title: ${quoteYamlString(section.title)}, description: ${quoteYamlString(section.description)}, href: ${quoteYamlString(section.href)} },`,
    )
    .join("\n");

  return `import CardGrid from "${makeRelativeComponentImport(entry.slug, "CardGrid")}";\n\n## News hub\n\nFollow campaign announcements, public events, and updates from PsychedeliCare teams across Europe.\n\n<CardGrid cards={[\n${serializedCards}\n]} />\n`;
}

function makeRelativeComponentImport(slug, componentName) {
  const depth = slug ? slug.split("/").length : 1;
  const prefix = "../".repeat(depth + 2);
  return `${prefix}components/${componentName}.astro`;
}

function buildBody(entry, redirectsByLegacyPath) {
  if (entry.generatedBody) {
    return `${entry.generatedBody.trim()}\n`;
  }

  if (entry.slug === "") {
    return buildHomeBody(entry, redirectsByLegacyPath);
  }

  if (entry.slug === "who-we-are") {
    return buildWhoWeAreBody(entry, redirectsByLegacyPath);
  }

  if (entry.slug === "projects/partnerships-collaborations") {
    return buildPartnersBody(entry, redirectsByLegacyPath);
  }

  if (entry.slug === "resources/faq-about-psychedelics") {
    return buildFaqPageBody(entry, redirectsByLegacyPath);
  }

  if (entry.slug === "news" && entry.sourceType === "page") {
    return buildNewsHubBody(entry, redirectsByLegacyPath);
  }

  return convertHtmlToMdx(sanitizeHtml(entry.html ?? "", entry), entry, redirectsByLegacyPath);
}

function makeFrontmatter(data) {
  return YAML.stringify(data).trim();
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeSlugPath(slug) {
  return slug
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}

function getCanonicalNewsSlug(item) {
  const preferredCategory = item.categories.find((category) =>
    ["campaign-news", "events", "comments"].includes(category),
  );
  const sectionConfig = newsSections[preferredCategory] ?? newsSections["campaign-news"];
  return {
    baseSlug: sectionConfig.slug,
    section: sectionConfig.section,
    pageType: sectionConfig.pageType,
    slug: `${sectionConfig.slug}/${item.oldSlug || slugify(item.title)}`,
  };
}

function getLegacySlugFromPath(legacyPath) {
  if (legacyPath === "/") return "psychedelicare-initiative";
  return legacyPath.split("/").filter(Boolean).at(-1) ?? "";
}

function toTwoLetterLegacyPath(pathname, locale) {
  if (locale === "en") {
    return pathname || "/";
  }

  const normalizedPath = pathname === "/" ? "" : pathname;
  return `/${locale}${normalizedPath}`;
}

function buildRedirectMap(entries) {
  const redirectsByLegacyPath = new Map();
  const redirectMap = {};

  for (const entry of entries) {
    const destination =
      entry.locale === "en"
        ? entry.slug
          ? `/${entry.slug}`
          : "/"
        : `/${entry.locale}${entry.slug ? `/${entry.slug}` : ""}`;

    const legacyPaths = new Set();
    if (entry.legacyPath) {
      legacyPaths.add(entry.legacyPath);
    }

    if (entry.legacyPath === "/" && entry.oldSlug) {
      legacyPaths.add(`/${entry.oldSlug}`);
    }

    for (const previousPath of entry.additionalLegacyPaths) {
      if (previousPath) {
        legacyPaths.add(previousPath);
      }
    }

    for (const legacyPath of legacyPaths) {
      const source =
        legacyPath === entry.legacyPath && entry.legacyLocalizedPath
          ? entry.legacyLocalizedPath
          : toTwoLetterLegacyPath(legacyPath, entry.locale);
      redirectsByLegacyPath.set(`${entry.locale}:${legacyPath}`, destination);
      if (source !== destination) {
        redirectMap[source] = destination;
      }
    }
  }

  return { redirectsByLegacyPath, redirectMap };
}

function collectCategories(item) {
  const categories = ensureArray(item.category)
    .filter((category) => category?.domain === "category")
    .map((category) => category.nicename)
    .filter(Boolean)
    .map((category) => categoryAliases[category] ?? category)
    .filter((category) =>
      ["campaign-news", "events", "comments"].includes(category),
    );

  return Array.from(new Set(categories));
}

function getExternalLinkSignature(html) {
  const $ = loadHtml(`<main>${html}</main>`, {
    decodeEntities: false,
  });

  const links = $("a[href]")
    .map((_index, element) => $(element).attr("href"))
    .get()
    .filter(Boolean)
    .map((href) => href.replace(/\?fbclid=[^"'&)\s>]+/gi, ""))
    .filter((href) => /^https?:\/\//i.test(href))
    .filter((href) => !href.includes("psychedelicare.eu"))
    .slice(0, 5);

  return links.join("|");
}

function getFilesystemSlug(value, fallback = "entry") {
  const decoded = safeDecodeURIComponent(value);
  const slug = slugify(decoded);
  return slug || fallback;
}

function buildPageEntries(items) {
  const pages = [];

  for (const item of items) {
    const rawType = item["wp:post_type"];
    const rawStatus = item["wp:status"];
    if (rawStatus !== "publish") continue;
    if (!["page", "post"].includes(rawType)) continue;

    const legacy = parseLegacyPath(item.link);
    const locale = legacy.locale;
    const canonicalLegacyPath = getCanonicalLegacyPath(locale, legacy.path);
    const title = item.title?.trim() || "Untitled";
    const oldSlug = item["wp:post_name"]?.trim() || getLegacySlugFromPath(legacy.path);
    const sourceId = Number(item["wp:post_id"]);
    const publishedAt = item["wp:post_date"]?.trim()?.slice(0, 10);
    const categories = collectCategories(item);

    if (
      junkPostIds.has(String(sourceId)) ||
      junkPostTitles.has(title) ||
      junkPostPaths.has(legacy.path)
    ) {
      continue;
    }

    if (legacy.path === "/civicrm" || legacy.path === "/zibicrm") {
      continue;
    }

    let mapping = canonicalPageMappings[canonicalLegacyPath];
    let slug = mapping?.slug;
    let pageType = mapping?.pageType ?? "page";
    let section = mapping?.section;
    const pageKey = mapping?.pageKey ?? canonicalLegacyPath.replace(/^\//, "");

    if (!mapping && rawType === "page") {
      continue;
    }

    if (rawType === "post") {
      const newsSlug = getCanonicalNewsSlug({
        oldSlug,
        title,
        categories,
      });
      slug = newsSlug.slug;
      pageType = newsSlug.pageType;
      section = newsSlug.section;
    }

    const legacyUrl = item.link;
    const legacyPath = legacy.path;
    const legacyLocalizedPath = legacy.localeSegment
      ? `/${legacy.localeSegment}${legacy.path === "/" ? "" : legacy.path}`
      : legacy.path;

    pages.push({
      sourceType: rawType,
      sourceId,
      locale,
      title,
      oldSlug,
      legacyPath,
      legacyUrl,
      slug,
      pageType,
      section,
      pageKey: rawType === "post" ? slug : pageKey,
      publishedAt,
      categories,
      category: categories[0],
      html: flattenText(item["content:encoded"] ?? ""),
      translationGroup:
        rawType === "post"
          ? `post:${oldSlug}`
          : `page:${mapping?.pageKey ?? oldSlug}`,
      additionalLegacyPaths: [],
      legacyLocalizedPath,
    });
  }

  return pages;
}

function enrichPageEntries(entries) {
  const groupedByTranslation = new Map();

  for (const entry of entries) {
    if (!groupedByTranslation.has(entry.translationGroup)) {
      groupedByTranslation.set(entry.translationGroup, []);
    }
    groupedByTranslation.get(entry.translationGroup).push(entry);
  }

  for (const group of groupedByTranslation.values()) {
    const oldLocalizedPaths = Object.fromEntries(
      group.map((entry) => [entry.locale, entry.legacyPath]),
    );
    const legacyUrls = group.map((entry) => entry.legacyUrl);

    for (const entry of group) {
      entry.oldLocalizedPaths = oldLocalizedPaths;
      entry.legacyUrls = legacyUrls;
    }
  }

  const faqClones = entries
    .filter(
      (entry) =>
        entry.pageKey === "resources" &&
        entry.sourceType === "page" &&
        entry.legacyPath.endsWith("resources-and-faq"),
    )
    .map((entry) => ({
      ...entry,
      slug: "resources/faq-about-psychedelics",
      pageKey: "resources/faq-about-psychedelics",
      section: "resources",
      translationGroup: "page:resources/faq-about-psychedelics",
      legacyPath: "",
      legacyUrl: "",
      legacyLocalizedPath: "",
      additionalLegacyPaths: [],
    }));

  entries.push(...faqClones);

  const staticEntries = [
    {
      slug: "news/events",
      pageKey: "news/events",
      localeTitles: {
        en: "Events",
        de: "Veranstaltungen",
        el: "Εκδηλώσεις",
        es: "Eventos",
        eu: "Gertaerak",
        fr: "Événements",
        hr: "Događaji",
        it: "Eventi",
        pl: "Wydarzenia",
        pt: "Eventos",
        sl: "Dogodki",
        ca: "Esdeveniments",
      },
      body:
        "## Events\n\nA curated archive of events, gatherings, conferences, and public talks related to PsychedeliCare.",
    },
    {
      slug: "news/national-news",
      pageKey: "news/national-news",
      localeTitles: {
        en: "National News",
        de: "Nationale Nachrichten",
        el: "Εθνικά νέα",
        es: "Noticias nacionales",
        eu: "Herrialdeetako berriak",
        fr: "Actualités nationales",
        hr: "Nacionalne vijesti",
        it: "Notizie nazionali",
        pl: "Aktualności krajowe",
        pt: "Notícias nacionais",
        sl: "Nacionalne novice",
        ca: "Notícies nacionals",
      },
      body:
        "## National News\n\nUpdates from PsychedeliCare teams, local campaign efforts, and country-specific developments.",
    },
    {
      slug: "news/reports",
      pageKey: "news/reports",
      localeTitles: {
        en: "Reports",
        de: "Berichte",
        el: "Αναφορές",
        es: "Informes",
        eu: "Txostenak",
        fr: "Rapports",
        hr: "Izvještaji",
        it: "Rapporti",
        pl: "Raporty",
        pt: "Relatórios",
        sl: "Poročila",
        ca: "Informes",
      },
      body:
        "## Reports\n\nCommentary, reflections, and public-facing reporting from the campaign and wider psychedelic policy landscape.",
    },
    {
      slug: "news/social-media-publications",
      pageKey: "news/social-media-publications",
      localeTitles: {
        en: "Social Media Publications",
        de: "Social-Media-Veröffentlichungen",
        el: "Δημοσιεύσεις στα κοινωνικά δίκτυα",
        es: "Publicaciones en redes sociales",
        eu: "Sare sozialetako argitalpenak",
        fr: "Publications sur les réseaux sociaux",
        hr: "Objave na društvenim mrežama",
        it: "Pubblicazioni sui social media",
        pl: "Publikacje w mediach społecznościowych",
        pt: "Publicações nas redes sociais",
        sl: "Objave na družbenih omrežjih",
        ca: "Publicacions a les xarxes socials",
      },
      body:
        "## Social Media Publications\n\nA clean archive page for future social-media highlights, campaign visuals, and multimedia updates.",
    },
    {
      slug: "news/newsletter-archive",
      pageKey: "news/newsletter-archive",
      localeTitles: {
        en: "Newsletter Archive",
        de: "Newsletter-Archiv",
        el: "Αρχείο ενημερωτικών δελτίων",
        es: "Archivo del boletín",
        eu: "Buletin artxiboa",
        fr: "Archives de la newsletter",
        hr: "Arhiva newslettera",
        it: "Archivio newsletter",
        pl: "Archiwum newslettera",
        pt: "Arquivo da newsletter",
        sl: "Arhiv novic",
        ca: "Arxiu del butlletí",
      },
      body:
        "## Newsletter Archive\n\nA destination for archived newsletters and campaign mailings as they are collected in the new site.",
    },
    {
      slug: "projects",
      pageKey: "projects",
      localeTitles: {
        en: "Projects",
        de: "Projekte",
        el: "Έργα",
        es: "Proyectos",
        eu: "Proiektuak",
        fr: "Projets",
        hr: "Projekti",
        it: "Progetti",
        pl: "Projekty",
        pt: "Projetos",
        sl: "Projekti",
        ca: "Projectes",
      },
      body:
        "## Projects\n\nExplore PsychedeliCare’s campaign initiatives, collaborations, and long-term work across Europe.",
    },
    {
      slug: "projects/patients-community",
      pageKey: "projects/patients-community",
      localeTitles: {
        en: "Patients Community",
        de: "Patientengemeinschaft",
        el: "Κοινότητα ασθενών",
        es: "Comunidad de pacientes",
        eu: "Pazienteen komunitatea",
        fr: "Communauté des patient·es",
        hr: "Zajednica pacijenata",
        it: "Comunità dei pazienti",
        pl: "Społeczność pacjentów",
        pt: "Comunidade de pacientes",
        sl: "Skupnost pacientov",
        ca: "Comunitat de pacients",
      },
      body:
        "## Patients Community\n\nThis section is reserved for community-led resources, participation opportunities, and patient-centred advocacy work.",
    },
    {
      slug: "projects/impact-report",
      pageKey: "projects/impact-report",
      localeTitles: {
        en: "Impact Report",
        de: "Wirkungsbericht",
        el: "Αναφορά αντίκτυπου",
        es: "Informe de impacto",
        eu: "Eragin txostena",
        fr: "Rapport d’impact",
        hr: "Izvještaj o utjecaju",
        it: "Rapporto di impatto",
        pl: "Raport wpływu",
        pt: "Relatório de impacto",
        sl: "Poročilo o vplivu",
        ca: "Informe d’impacte",
      },
      body:
        "## Impact Report\n\nA future home for downloadable impact reporting and transparent documentation of the initiative’s work.",
    },
    {
      slug: "projects/testimonials-interviews",
      pageKey: "projects/testimonials-interviews",
      localeTitles: {
        en: "Testimonials / Interviews",
        de: "Testimonials / Interviews",
        el: "Μαρτυρίες / Συνεντεύξεις",
        es: "Testimonios / Entrevistas",
        eu: "Testigantzak / Elkarrizketak",
        fr: "Témoignages / Entretiens",
        hr: "Svjedočanstva / Intervjui",
        it: "Testimonianze / Interviste",
        pl: "Świadectwa / Wywiady",
        pt: "Testemunhos / Entrevistas",
        sl: "Pričevanja / Intervjuji",
        ca: "Testimonis / Entrevistes",
      },
      body:
        "## Testimonials / Interviews\n\nA curated home for interviews, lived-experience testimony, and campaign voices from across Europe.",
    },
    {
      slug: "resources/faq-about-psychedelics",
      pageKey: "resources/faq-about-psychedelics",
      localeTitles: {
        en: "FAQ About Psychedelics",
        de: "FAQ zu Psychedelika",
        el: "Συχνές ερωτήσεις για τα ψυχεδελικά",
        es: "FAQ sobre psicodélicos",
        eu: "Psikodelikoei buruzko ohiko galderak",
        fr: "FAQ sur les psychédéliques",
        hr: "Česta pitanja o psihodelicima",
        it: "FAQ sugli psichedelici",
        pl: "FAQ o psychodelikach",
        pt: "FAQ sobre psicadélicos",
        sl: "Pogosta vprašanja o psihedelikih",
        ca: "Preguntes freqüents sobre psicodèlics",
      },
      body:
        "## FAQ About Psychedelics\n\nFrequently asked questions about psychedelics and psychedelic-assisted therapies.",
    },
    {
      slug: "resources/organisations-communities-initiatives",
      pageKey: "resources/organisations-communities-initiatives",
      localeTitles: {
        en: "Organisations, Communities & Initiatives",
        de: "Organisationen, Gemeinschaften & Initiativen",
        el: "Οργανισμοί, κοινότητες και πρωτοβουλίες",
        es: "Organizaciones, comunidades e iniciativas",
        eu: "Erakundeak, komunitateak eta ekimenak",
        fr: "Organisations, communautés & initiatives",
        hr: "Organizacije, zajednice i inicijative",
        it: "Organizzazioni, comunità e iniziative",
        pl: "Organizacje, społeczności i inicjatywy",
        pt: "Organizações, comunidades e iniciativas",
        sl: "Organizacije, skupnosti in pobude",
        ca: "Organitzacions, comunitats i iniciatives",
      },
      body:
        "## Organisations, Communities & Initiatives\n\nA curated overview of research centres, community organisations, and public-interest initiatives connected to psychedelic knowledge, education, and care.",
    },
    {
      slug: "resources/activist-packs",
      pageKey: "resources/activist-packs",
      localeTitles: {
        en: "Activist Packs",
        de: "Aktivistenpakete",
        el: "Πακέτα ακτιβιστών",
        es: "Packs activistas",
        eu: "Aktibista paketeak",
        fr: "Kits militants",
        hr: "Aktivistički paketi",
        it: "Pacchetti per attivisti",
        pl: "Pakiety aktywistyczne",
        pt: "Pacotes para ativistas",
        sl: "Aktivistični paketi",
        ca: "Packs activistes",
      },
      body:
        "## Activist Packs\n\nCampaign packs, downloadable outreach materials, and practical tools for local organizing will be collected here.\n\n[Get the current activist pack](https://drive.google.com/drive/folders/1jouo8ccXUdB8OSpAsXyQYQU75hJ8VS-e?usp=drive_link)",
    },
  ];

  const seen = new Set(entries.map((entry) => `${entry.locale}:${entry.slug}`));

  for (const config of staticEntries) {
    for (const locale of localeMap.values()) {
      if (seen.has(`${locale}:${config.slug}`)) continue;

      entries.push({
        sourceType: "page",
        sourceId: undefined,
        locale,
        title: config.localeTitles[locale] ?? config.localeTitles.en,
        oldSlug: config.slug.split("/").at(-1) ?? "",
        legacyPath: "",
        legacyUrl: "",
        slug: config.slug,
        pageType: "section",
        section: config.slug.split("/").slice(0, -1).join("/"),
        pageKey: config.pageKey,
        publishedAt: undefined,
        categories: [],
        category: undefined,
        html: "",
        generatedBody: config.body,
        translationGroup: `generated:${config.pageKey}`,
        additionalLegacyPaths: [],
        legacyLocalizedPath: "",
        oldLocalizedPaths: {},
        legacyUrls: [],
      });
      seen.add(`${locale}:${config.slug}`);
    }
  }

  return entries;
}

async function emptyDirectory(targetDirectory) {
  await fs.rm(targetDirectory, { recursive: true, force: true });
  await fs.mkdir(targetDirectory, { recursive: true });
}

async function main() {
  const xml = await fs.readFile(importXmlPath, "utf8");
  const parsed = parser.parse(xml);
  const rawItems = ensureArray(parsed.rss.channel.item);
  let entries = buildPageEntries(rawItems);
  entries = enrichPageEntries(entries);

  const { redirectsByLegacyPath, redirectMap } = buildRedirectMap(entries);

  await emptyDirectory(contentRoot);
  await fs.mkdir(dataRoot, { recursive: true });

  const assetManifest = {};

  for (const entry of entries) {
    const fileSlug = decodeSlugPath(entry.slug);
    const pageDirectory = path.join(
      contentRoot,
      ...(fileSlug ? fileSlug.split("/") : ["home"]),
    );
    await fs.mkdir(pageDirectory, { recursive: true });

    const localeFile = path.join(pageDirectory, `${entry.locale}.mdx`);
    const sanitizedHtml = sanitizeHtml(entry.html ?? "", entry);
    const assetUrls = extractAssetUrls(sanitizedHtml);

    for (const assetUrl of assetUrls) {
      if (!assetManifest[assetUrl]) {
        assetManifest[assetUrl] = [];
      }

      assetManifest[assetUrl].push({
        locale: entry.locale,
        slug: entry.slug,
        title: entry.title,
      });
    }

    const body = buildBody(entry, redirectsByLegacyPath);

    const frontmatter = {
      title: entry.title,
      description: undefined,
      locale: entry.locale,
      slug: entry.slug,
      oldSlug: entry.oldSlug || undefined,
      legacyUrl: entry.legacyUrl || undefined,
      legacyUrls: entry.legacyUrls ?? [],
      sourceType: entry.sourceType,
      pageType: entry.pageType,
      section: entry.section || undefined,
      category: entry.category,
      categories: entry.categories,
      publishedAt: entry.publishedAt,
      sourceId: entry.sourceId,
      translationGroup: entry.translationGroup,
      oldPaths: Array.from(
        new Set(
          [entry.legacyPath, ...entry.additionalLegacyPaths].filter(Boolean),
        ),
      ),
      oldLocalizedPaths: entry.oldLocalizedPaths ?? {},
      assetUrls,
      teaser:
        body
          .replace(/^import\s.+$/gm, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/^#+\s+/gm, "")
          .replace(/\[[^\]]+\]\([^)]+\)/g, "")
          .replace(/[*_`>#-]/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 180) || undefined,
      draft: false,
    };

    const fileContents = `---\n${makeFrontmatter(frontmatter)}\n---\n\n${body}`;
    await fs.writeFile(localeFile, fileContents, "utf8");
  }

  const redirectsFile = path.join(dataRoot, "redirect-map.json");
  const assetManifestFile = path.join(dataRoot, "asset-manifest.json");

  await fs.writeFile(redirectsFile, `${JSON.stringify(redirectMap, null, 2)}\n`);
  await fs.writeFile(
    assetManifestFile,
    `${JSON.stringify(assetManifest, null, 2)}\n`,
  );

  console.log(
    `Generated ${entries.length} localized content files, ${Object.keys(redirectMap).length} redirects, and ${Object.keys(assetManifest).length} referenced assets.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
