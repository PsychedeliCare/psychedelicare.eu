# Visual Theme & Atmosphere
- **Tech Stack:** Tailwind CSS, Anime.js
- **Design Philosophy:** Clean, highly readable, and spacious layout featuring strong, vibrant cyan-to-pink gradient color blocks contrasting against white space.
- **Imagery & Illustrations:** - **NO EMOJIS.** - **Illustrations:** Use placeholder elements for line drawings. Include a detailed text prompt inside the placeholder (in very small, hardly readable text) that can be passed to an image generation model.
  - **Photos:** Team member photos must maintain standard sizes and orientations (strictly `1:1` square or `4:3` portrait).

# Color Palette & Roles
- **Brand Gradients:** - Standard gradient: `linear-gradient(90deg, #44B3EB 48%, #D729F2 87%)`.
  - Header/Text gradient: `linear-gradient(30deg, #61B8EE 10%, #BF1DD1 60%)`.
  - Footer gradient: `linear-gradient(232deg, #F41FD2 0%, #1DD6FA 81%)`.
- **Core Colors:**
  - Pink: `#EB44D2`
  - Purple: `#A91AC0`
  - Cyan: `#44B3EB`
  - Link Color: `#391EBE`
- **Surface Roles:**
  - **Default Background:** White.
  - **Hero Section:** Must use a diagonal cyan-to-pink gradient. This section should serve as a strong visual color block compared to all other blocks.
  - **Alternating Sections:** When multiple text-heavy blocks appear sequentially, break them up by applying a very light grey or a very light tint derived from the main cyan or pink colors.
  - **Footer:** Dark background featuring the specific footer gradient.

# Typography Rules
- **Primary Font Family:** `Jost` (from Google Fonts).
- **Body Text:** Black, `21px` (do not use the standard 16px, as it is too small to be readable with Jost). 
- **Line Height:** Must use comfortably large line heights in text blocks for optimal readability.
- **Hierarchy:**
  - **H1:** `70px`, Semi Bold. Text fill: `linear-gradient(30deg, #61B8EE 10%, #BF1DD1 60%)`.
  - **H2:** `55px`, Semi Bold. Text fill: `linear-gradient(30deg, #61B8EE 10%, #BF1DD1 60%)`.
  - **H3:** `45px`, Extra Bold. Text color: Black.

# Component Stylings
- **Buttons (Default):** - Background: Cyan-to-pink gradient.
  - Shape: Rounded corners with a small border radius.
  - Label: White, Bold, `26px` standard size.
- **Buttons (On Gradient Backgrounds):**
  - Background: White.
  - Label: Pink (`#EB44D2`), Bold, `26px` standard size.
- **Text Blocks (Long Content):**
  - For blocks with heavy text, truncate by creating an intro paragraph followed by a clickable "Read more" interaction.
- **Brand Assets:**
  - **Logo:** `https://psychedelicare.eu/wp-content/uploads/2023/08/psychedelicareeu-logo.svg`
  - **Home Page Footer Illustration:** The image at `https://psychedelicare.eu/wp-content/uploads/2025/05/doctor-HD-cut-1024x1016-1-e1747987254443.jpg` must be kept directly above the footer on the home page.

# Layout Principles
- **Spacing Scale:**
  - Maintain large white space above every Heading.
  - Maintain large white spaces between structural layout blocks.
  - Ensure a large upper margin is applied directly above the Footer.
- **Text Block Variations:** Alternate backgrounds (white to light grey/light tint) when stacking text blocks to maintain visual flow.

# Do's and Don''ts
- **Do:** Heavily utilize Tailwind utility classes to enforce the 21px base font and the large spacing rules.
- **Do:** Use Anime.js for smooth, subtle animations (e.g., expanding the "Read more" text blocks).
- **Don't:** Do not use emojis anywhere in the UI.
- **Don't:** Do not shrink body text below 21px. 

# Responsive Behavior & Localization
- **Localization Requirements:** The UI must be built to accommodate EU language localization. Strings translated to German, French, or other EU languages will vary significantly in length.
- **Fluid Layouts:** Ensure buttons, navigation elements, and "Read more" blocks do not break or misalign when string lengths expand or contract.
- **Images:** Team photos must use responsive CSS aspects (`aspect-square` or `aspect-[4/3]`) to prevent layout shifting across mobile and desktop breakpoints.