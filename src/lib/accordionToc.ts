type AccordionTocItem = {
  id: string;
  label: string;
};

export function augmentTocWithAccordions(tocRoot: HTMLElement) {
  const content = tocRoot
    .closest(".page-layout__body")
    ?.querySelector(".page-layout__content");

  if (!content) return;

  const list = tocRoot.querySelector("ul");
  if (!list) return;

  for (const accordion of content.querySelectorAll<HTMLElement>("[data-accordion-toc]")) {
    const sectionSlug = accordion.dataset.accordionToc;
    let items: AccordionTocItem[] = [];

    try {
      items = JSON.parse(accordion.dataset.tocItems ?? "[]") as AccordionTocItem[];
    } catch {
      continue;
    }

    if (items.length === 0) continue;

    let insertAfter: Element | null = null;

    if (sectionSlug) {
      insertAfter =
        list.querySelector(`a[href="#${CSS.escape(sectionSlug)}"]`)?.closest("li") ?? null;
    }

    for (const item of items) {
      const listItem = document.createElement("li");
      listItem.className = "depth-3";

      const link = document.createElement("a");
      link.href = `#${item.id}`;
      link.textContent = item.label;

      listItem.appendChild(link);

      if (insertAfter) {
        insertAfter.after(listItem);
        insertAfter = listItem;
      } else {
        list.appendChild(listItem);
      }
    }
  }
}
