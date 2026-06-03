import * as fs from "node:fs";
import path from "node:path";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const logoPath = path.join(process.cwd(), "public/assets/psychedelicareeu-logo.svg");
const logoSrc = `data:image/svg+xml;base64,${fs.readFileSync(logoPath).toString("base64")}`;

const titleGradient = "linear-gradient(30deg, #61B8EE 10%, #BF1DD1 60%)";

/** @param {import("astro-opengraph-images").RenderFunctionInput} input */
export function psychedelicare({ title }) {
  return _jsxs("div", {
    style: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: "64px 72px",
      fontFamily: "Jost",
    },
    children: [
      _jsx("img", {
        src: logoSrc,
        width: 360,
        height: 117,
        style: {
          objectFit: "contain",
          objectPosition: "left center",
        },
      }),
      _jsx("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 32,
        },
        children: _jsx("div", {
          style: {
            fontSize: 68,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: -1,
            backgroundImage: titleGradient,
            backgroundClip: "text",
            color: "transparent",
          },
          children: title,
        }),
      }),
    ],
  });
}
