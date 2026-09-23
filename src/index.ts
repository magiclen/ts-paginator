import type { PageItem } from "./items.ts";

export * as PageItems from "./items.ts";
export * from "./paginator.ts";
export * as PaginatorBuildErrors from "./errors.ts";
export * from "./types.ts";

export const pageItemsToString = (pageItems: PageItem[]): string => {
    const s = [];

    for (const pageItem of pageItems) {
        s.push(pageItem.toString());
    }

    return s.join(" ");
};
