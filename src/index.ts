import type { PageItem } from "./page-item.ts";
import { pageItemToString } from "./page-item.ts";

export type { PageItem } from "./page-item.ts";
export { pageItemToString } from "./page-item.ts";
export type { PaginatorOptions } from "./paginator.ts";
export { Paginator } from "./paginator.ts";
export type { PaginatorBuildErrorKind } from "./paginator-builder.ts";
export { PaginatorBuildError, PaginatorBuilder } from "./paginator-builder.ts";
export { PaginatorIter } from "./paginator-iter.ts";
export { YesNoDepends, stringToYesNoDepends } from "./yes-no-depends.ts";

/** Format `PageItem`s to a string. Usually for debug or logging. */
export const pageItemsToString = (pageItems: readonly PageItem[]): string =>
    pageItems.map((pageItem) => pageItemToString(pageItem)).join(" ");
