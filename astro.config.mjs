// @ts-check
import * as fs from "node:fs";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import opengraphImages from "astro-opengraph-images";

import { isLinkedPageUrl, isLinkedPathname } from "./scripts/linked-pages.mjs";
import { psychedelicare } from "./scripts/opengraph-psychedelicare.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://psychedelicare.eu",
  adapter: cloudflare(),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => isLinkedPageUrl(page),
    }),
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Jost",
            weight: 900,
            style: "normal",
            data: fs.readFileSync(
              "node_modules/@fontsource/jost/files/jost-latin-900-normal.woff",
            ),
          },
        ],
      },
      render: psychedelicare,
      filter: ({ pathname }) => isLinkedPathname(pathname),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["astro-opengraph-images", "@resvg/resvg-js"],
    },
  },
});
