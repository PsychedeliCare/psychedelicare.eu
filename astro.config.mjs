// @ts-check
import * as fs from "node:fs";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import opengraphImages, { presets } from "astro-opengraph-images";

import { isLinkedPageUrl, isLinkedPathname } from "./scripts/linked-pages.mjs";

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
            weight: 400,
            style: "normal",
            data: fs.readFileSync(
              "node_modules/@fontsource/jost/files/jost-latin-400-normal.woff",
            ),
          },
          {
            name: "Jost",
            weight: 700,
            style: "normal",
            data: fs.readFileSync(
              "node_modules/@fontsource/jost/files/jost-latin-700-normal.woff",
            ),
          },
        ],
      },
      render: presets.blackAndWhite,
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
