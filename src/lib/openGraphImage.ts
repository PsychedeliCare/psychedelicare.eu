type GetImagePathInput = {
  url: URL;
  site: URL | string | undefined;
};

declare const __OPENGRAPH_IMAGES_ENABLED__: boolean;

const defaultOpenGraphImagePath = "/assets/psychedelicare_eu_logo_white.png";

export function getImagePath({ url, site }: GetImagePathInput) {
  if (site === undefined) {
    throw new Error(
      "`site` must be set in your Astro configuration: https://docs.astro.build/en/reference/configuration-reference/#site",
    );
  }

  if (!__OPENGRAPH_IMAGES_ENABLED__) {
    return new URL(defaultOpenGraphImagePath, site).toString();
  }

  let target = url.pathname;
  target = target.endsWith("/") ? `${target}index.png` : `${target}.png`;

  if (target === "/404/index.png") {
    return `${site.toString()}404.png`;
  }

  if (target === "/500/index.png") {
    return `${site.toString()}500.png`;
  }

  return site.toString() + target.slice(1);
}
