import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { locales } from "./lib/i18n";

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    locale: z.enum(locales),
    slug: z.string(),
    oldSlug: z.string().optional(),
    legacyUrl: z.string().url().optional(),
    legacyUrls: z.array(z.string().url()).default([]),
    sourceType: z.enum(["page", "post"]).default("page"),
    pageType: z
      .enum([
        "home",
        "page",
        "section",
        "news-hub",
        "news-index",
        "news-post",
      ])
      .default("page"),
    section: z.string().optional(),
    category: z.string().optional(),
    categories: z.array(z.string()).default([]),
    publishedAt: z.string().optional(),
    sourceId: z.number().optional(),
    translationGroup: z.string().optional(),
    oldPaths: z.array(z.string()).default([]),
    oldLocalizedPaths: z.record(z.string(), z.string()).default({}),
    assetUrls: z.array(z.string()).default([]),
    teaser: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  pages,
};
