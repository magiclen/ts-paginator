import { PageItem } from "./PageItem";

export * as PageItems from "./PageItem";
export * from "./Paginator";
export * from "./PaginatorBuilder";
export * as PaginatorBuildErrors from "./PaginatorBuildError";
export * from "./PaginatorIter";
export * from "./types";

export const pageItemsToString = (pageItems: PageItem[]): string => {
    const s = [];

    for (const pageItem of pageItems) {
        s.push(pageItem.toString());
    }

    return s.join(" ");
};
