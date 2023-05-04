import { PageItem } from "./PageItem.js";

export * as PageItems from "./PageItem.js";
export * from "./Paginator.js";
export * from "./PaginatorBuilder.js";
export * as PaginatorBuildErrors from "./PaginatorBuildError.js";
export * from "./PaginatorIter.js";
export * from "./types.js";

export const pageItemsToString = (pageItems: PageItem[]): string => {
    const s = [];

    for (const pageItem of pageItems) {
        s.push(pageItem.toString());
    }

    return s.join(" ");
};
