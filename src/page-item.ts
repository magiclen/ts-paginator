/** An item displayed in a pagination bar. */
export type PageItem =
    /** A link to a regular page. */
    | { readonly type: "page"; readonly pageNumber: number }
    /** The current page without a regular link. */
    | { readonly type: "currentPage"; readonly pageNumber: number }
    /** A marker for a hidden range of pages. */
    | { readonly type: "ignore" }
    /** A link to the previous page. */
    | { readonly type: "prev"; readonly pageNumber: number }
    /** A link to the next page. */
    | { readonly type: "next"; readonly pageNumber: number }
    /** A reserved previous-page position without a valid target. */
    | { readonly type: "reservedPrev" }
    /** A reserved next-page position without a valid target. */
    | { readonly type: "reservedNext" };

/** Format a `PageItem` to a string. Usually for debug or logging. */
export const pageItemToString = (pageItem: PageItem): string => {
    switch (pageItem.type) {
        case "page":
            return pageItem.pageNumber.toString();
        case "currentPage":
            return `${pageItem.pageNumber}*`;
        case "ignore":
            return "...";
        case "prev":
            return "<";
        case "next":
            return ">";
        case "reservedPrev":
            return "(";
        default:
            // `reservedNext`
            return ")";
    }
};
