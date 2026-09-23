import type { PageItem } from "./page-item.ts";
import { PaginatorBuilder, resolvePaginatorOptions } from "./paginator-builder.ts";
import { PaginatorIter } from "./paginator-iter.ts";
import { YesNoDepends } from "./yes-no-depends.ts";

/** Options to create a `Paginator` or a `PaginatorIter`. */
export interface PaginatorOptions {
    /** The number of pages. */
    totalPages: number;

    /** The number of the current page. The default value is `1`. */
    currentPage?: number;

    /**
     * The max number of `PageItem`s after generated. The default value is `9`.
     *
     * Building fails if this is smaller than `min(startSize + endSize + 3, totalPages)` plus one
     * for each of `hasPrev` and `hasNext` that is not `"no"` (only `"yes"` counts when `totalPages`
     * is 1 or 2).
     */
    maxItemCount?: number;

    /**
     * The number of `PageItem`s (the `prev` item is excluded) on the start edge (before the first
     * `ignore` item). The default value is `1`.
     */
    startSize?: number;

    /**
     * The number of `PageItem`s (the `next` item is excluded) on the end edge (after the last
     * `ignore` item). The default value is `1`.
     */
    endSize?: number;

    /** Whether to add the `prev` item. The default value is `"depends"`. */
    hasPrev?: YesNoDepends;

    /** Whether to add the `next` item. The default value is `"depends"`. */
    hasNext?: YesNoDepends;
}

/** Pagination settings for one current page. */
export class Paginator {
    /** An alias of `new PaginatorBuilder(totalPages)`. */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }

    /** The total number of pages. */
    readonly totalPages: number;

    /** The current page number. */
    readonly currentPage: number;

    /** The maximum number of generated items. */
    readonly maxItemCount: number;

    /** The number of pages reserved at the start edge. */
    readonly startSize: number;

    /** The number of pages reserved at the end edge. */
    readonly endSize: number;

    /** The setting for the `prev` item. */
    readonly hasPrev: YesNoDepends;

    /** The setting for the `next` item. */
    readonly hasNext: YesNoDepends;

    /**
     * Create a paginator. Options that are not set use their default values.
     *
     * @throws {PaginatorBuildError} If the options cannot be used to build a paginator.
     * @throws {TypeError} If an option has a wrong type.
     * @throws {RangeError} If a number option is not a non-negative safe integer, or `hasPrev` or
     *   `hasNext` is not a `YesNoDepends` value.
     */
    constructor(options: PaginatorOptions) {
        const settings = resolvePaginatorOptions(options);

        this.totalPages = settings.totalPages;
        this.currentPage = settings.currentPage;
        this.maxItemCount = settings.maxItemCount;
        this.startSize = settings.startSize;
        this.endSize = settings.endSize;
        this.hasPrev = settings.hasPrev;
        this.hasNext = settings.hasNext;
    }

    /** Create `PageItem`s for the pagination bar, with at most `maxItemCount` items. */
    paginate(): PageItem[] {
        const v: PageItem[] = [];
        let itemsCounter = this.maxItemCount;

        const showPrev =
            this.hasPrev === YesNoDepends.Yes ||
            (this.hasPrev === YesNoDepends.Depends && this.currentPage > 1 && this.totalPages > 2);
        const showNext =
            this.hasNext === YesNoDepends.Yes ||
            (this.hasNext === YesNoDepends.Depends &&
                this.currentPage < this.totalPages &&
                this.totalPages > 2);

        if (showPrev) {
            const prevPage = this.currentPage - 1;

            if (prevPage === 0) {
                v.push({ type: "reservedPrev" });
            } else {
                v.push({ type: "prev", pageNumber: prevPage });
            }

            itemsCounter -= 1;
        }

        if (showNext) {
            itemsCounter -= 1;
        }

        const startSize = Math.min(this.startSize, this.totalPages);
        const endSize = Math.min(this.endSize, this.totalPages);

        let ignoreStart = false;
        let ignoreEnd = false;

        if (this.totalPages > itemsCounter) {
            ignoreStart = this.currentPage > startSize && this.currentPage - startSize > 2;
            ignoreEnd = this.totalPages - this.currentPage > endSize;
        }

        if (ignoreStart) {
            itemsCounter -= startSize + 2; // startSize + 1 + 1

            if (ignoreEnd) {
                itemsCounter -= endSize + 1;

                for (let i = 1; i <= startSize; i++) {
                    v.push({ type: "page", pageNumber: i });
                }

                const windowSize = Math.floor(itemsCounter / 2);

                // Keep the missing left distance so the window can shift to the right by the same amount.
                const hpSUnderflow = Math.max(windowSize - this.currentPage, 0);
                let hpS = Math.max(this.currentPage - windowSize, 0);
                const hpE = this.currentPage - 1;
                const tpS = this.currentPage + 1;
                const rightWindowSize = itemsCounter - windowSize;
                // `Number.MAX_SAFE_INTEGER` plays the role of `usize::MAX` in the Rust version, so numbers beyond it are never computed.
                const maxRightWindowSize = Number.MAX_SAFE_INTEGER - this.currentPage;
                // Keep the overflow distance so the window can shift to the left by the same amount.
                const tpEOverflow = Math.max(rightWindowSize - maxRightWindowSize, 0);
                let tpE = this.currentPage + Math.min(rightWindowSize, maxRightWindowSize);

                const endBoundary = this.totalPages - endSize;

                if (hpSUnderflow > 0 || startSize + 2 >= hpS) {
                    // Reuse the ignore marker slot when the left gap is too small to hide.
                    const oldHpS = hpS;

                    hpS = startSize + 1;

                    tpE += hpS + 1 - oldHpS + hpSUnderflow;
                } else {
                    v.push({ type: "ignore" });

                    if (tpE >= endBoundary) {
                        // Shift the visible window left when it reaches the reserved end section.
                        const oldTpE = tpE;

                        tpE = endBoundary - 1;
                        hpS -= oldTpE - tpE + tpEOverflow;
                    }
                }

                for (let i = hpS; i <= hpE; i++) {
                    v.push({ type: "page", pageNumber: i });
                }

                v.push({ type: "currentPage", pageNumber: this.currentPage });

                for (let i = tpS; i <= tpE; i++) {
                    v.push({ type: "page", pageNumber: i });
                }

                if (tpE === endBoundary - 1) {
                    v.push({ type: "page", pageNumber: endBoundary });
                } else {
                    v.push({ type: "ignore" });
                }

                for (let i = endBoundary + 1; i <= this.totalPages; i++) {
                    v.push({ type: "page", pageNumber: i });
                }
            } else {
                if (this.currentPage < this.totalPages) {
                    itemsCounter -= this.totalPages - this.currentPage;
                }

                for (let i = 1; i <= startSize; i++) {
                    v.push({ type: "page", pageNumber: i });
                }

                v.push({ type: "ignore" });

                for (let i = this.currentPage - itemsCounter; i < this.currentPage; i++) {
                    v.push({ type: "page", pageNumber: i });
                }

                v.push({ type: "currentPage", pageNumber: this.currentPage });

                for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
                    v.push({ type: "page", pageNumber: i });
                }
            }
        } else if (ignoreEnd) {
            itemsCounter -= endSize + 1;

            itemsCounter -= this.currentPage;

            for (let i = 1; i < this.currentPage; i++) {
                v.push({ type: "page", pageNumber: i });
            }

            v.push({ type: "currentPage", pageNumber: this.currentPage });

            const windowEnd = this.currentPage + itemsCounter;

            for (let i = this.currentPage + 1; i <= windowEnd; i++) {
                v.push({ type: "page", pageNumber: i });
            }

            v.push({ type: "ignore" });

            for (let i = this.totalPages - endSize + 1; i <= this.totalPages; i++) {
                v.push({ type: "page", pageNumber: i });
            }
        } else {
            for (let i = 1; i < this.currentPage; i++) {
                v.push({ type: "page", pageNumber: i });
            }

            v.push({ type: "currentPage", pageNumber: this.currentPage });

            for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
                v.push({ type: "page", pageNumber: i });
            }
        }

        if (showNext) {
            if (this.currentPage < this.totalPages) {
                v.push({ type: "next", pageNumber: this.currentPage + 1 });
            } else {
                v.push({ type: "reservedNext" });
            }
        }

        return v;
    }

    /** Iterate from the current page through the last page. */
    iter(): PaginatorIter {
        return new PaginatorIter(this);
    }
}
