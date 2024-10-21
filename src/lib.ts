import type { PageItem } from "./items.js";

export * as PageItems from "./items.js";
export * from "./paginator.js";
export * as PaginatorBuildErrors from "./errors.js";
export * from "./types.js";

export const pageItemsToString = (pageItems: PageItem[]): string => {
    const s = [];

    for (const pageItem of pageItems) {
        s.push(pageItem.toString());
    }

    return s.join(" ");
};
