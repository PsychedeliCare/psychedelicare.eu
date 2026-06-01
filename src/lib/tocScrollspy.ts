type TocSection = {
  link: HTMLAnchorElement;
  heading: HTMLElement;
  listItem: HTMLLIElement;
};

const ACTIVE_OFFSET = 96;

function getSections(tocRoot: HTMLElement): TocSection[] {
  const content = tocRoot
    .closest(".page-layout__body")
    ?.querySelector(".page-layout__content");

  if (!content) return [];

  return [...tocRoot.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return null;

      const heading = content.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
      const listItem = link.closest("li");
      if (!heading || !listItem) return null;

      return { link, heading, listItem };
    })
    .filter((section): section is TocSection => section !== null);
}

export function initTocScrollspy(tocRoot: HTMLElement) {
  const sections = getSections(tocRoot);
  if (sections.length === 0) return;

  let activeId = "";
  let frame = 0;

  const setActive = (id: string) => {
    if (id === activeId) return;
    activeId = id;

    for (const { link, heading, listItem } of sections) {
      const isActive = heading.id === id;
      link.classList.toggle("is-active", isActive);
      listItem.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  const update = () => {
    let active = sections[0];

    for (const section of sections) {
      if (section.heading.getBoundingClientRect().top <= ACTIVE_OFFSET) {
        active = section;
      } else {
        break;
      }
    }

    setActive(active.heading.id);
  };

  const scheduleUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  const onHashChange = () => {
    const hashId = window.location.hash.slice(1);
    if (hashId && sections.some(({ heading }) => heading.id === hashId)) {
      setActive(hashId);
    }
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("hashchange", onHashChange);

  for (const { link } of sections) {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) setActive(id);
    });
  }

  onHashChange();
  update();
}
