import {
    CurrentPageIncorrect,
    CurrentPageTooLarge,
    EndSizeIncorrect,
    MaxItemCountIncorrect,
    MaxItemCountTooSmall,
    StartSizeIncorrect,
    TotalPagesIncorrect,
} from "./errors.ts";
import type { PageItem } from "./items.ts";
import * as PageItems from "./items.ts";
import { YesNoDepends } from "./types.ts";

export class Paginator {
    /** An alias of `new PaginatorBuilder`. */
    static builder(totalPages: number): PaginatorBuilder {
        // oxlint-disable-next-line eslint/no-use-before-define
        return new PaginatorBuilder(totalPages);
    }

    /** You should not new `Paginator` on your own. */
    constructor(
        readonly totalPages: number,
        readonly currentPage: number,
        readonly maxItemCount: number,
        readonly startSize: number,
        readonly endSize: number,
        readonly hasPrev: YesNoDepends,
        readonly hasNext: YesNoDepends,
    ) {
        // do nothing
    }

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
            const page = this.currentPage - 1;

            if (page === 0) {
                v.push(PageItems.reservedPrev());
            } else {
                v.push(PageItems.prev(page));
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
            ignoreStart = this.currentPage > 2 + startSize;
            ignoreEnd = this.totalPages - this.currentPage > endSize;
        }

        if (ignoreStart) {
            itemsCounter -= startSize + 2; // startSize + 1 + 1

            if (ignoreEnd) {
                itemsCounter -= endSize + 1;

                for (let i = 1; i <= startSize; i++) {
                    v.push(PageItems.page(i));
                }

                const windowSize = itemsCounter >> 1;

                let hpS = this.currentPage - windowSize;
                const hpE = this.currentPage - 1;
                const tpS = this.currentPage + 1;
                let tpE = this.currentPage + (itemsCounter - windowSize);

                const endStart = this.totalPages - this.endSize + 1;

                if (startSize + 2 >= hpS) {
                    // no ignore_start item

                    const oldHpS = hpS;

                    hpS = startSize + 1;

                    // plus one because ignore_start is not needed
                    tpE += hpS + 1 - oldHpS;
                } else {
                    v.push(PageItems.ignore());

                    if (tpE + 2 > endStart) {
                        // tp_e is too high, shift the window left
                        const oldTpE = tpE;

                        tpE = endStart - 2;
                        hpS -= oldTpE - tpE;
                    }
                }

                for (let i = hpS; i <= hpE; i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.currentPage(this.currentPage));

                for (let i = tpS; i <= tpE; i++) {
                    v.push(PageItems.page(i));
                }

                if (tpE + 2 === endStart) {
                    v.push(PageItems.page(tpE + 1));
                } else {
                    v.push(PageItems.ignore());
                }

                for (let i = endStart; i <= this.totalPages; i++) {
                    v.push(PageItems.page(i));
                }
            } else {
                if (this.currentPage < this.totalPages) {
                    itemsCounter -= this.totalPages - this.currentPage;
                }

                for (let i = 1; i <= startSize; i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.ignore());

                for (let i = this.currentPage - itemsCounter; i < this.currentPage; i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.currentPage(this.currentPage));

                for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
                    v.push(PageItems.page(i));
                }
            }
        } else if (ignoreEnd) {
            itemsCounter -= endSize + 1;
            itemsCounter -= this.currentPage;

            for (let i = 1; i < this.currentPage; i++) {
                v.push(PageItems.page(i));
            }

            v.push(PageItems.currentPage(this.currentPage));

            {
                const s = this.currentPage + 1;
                const e = this.currentPage + itemsCounter;

                for (let i = s; i <= e; i++) {
                    v.push(PageItems.page(i));
                }
            }

            v.push(PageItems.ignore());

            for (let i = this.totalPages - this.endSize + 1; i <= this.totalPages; i++) {
                v.push(PageItems.page(i));
            }
        } else {
            for (let i = 1; i < this.currentPage; i++) {
                v.push(PageItems.page(i));
            }

            v.push(PageItems.currentPage(this.currentPage));

            for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
                v.push(PageItems.page(i));
            }
        }

        if (showNext) {
            const page = this.currentPage + 1;

            if (page > this.totalPages) {
                v.push(PageItems.reservedNext());
            } else {
                v.push(PageItems.next(page));
            }
        }

        return v;
    }
}

export class PaginatorBuilder {
    #totalPages: number;

    #currentPage: number;

    #maxItemCount: number;

    #startSize: number;

    #endSize: number;

    #hasPrev: YesNoDepends;

    #hasNext: YesNoDepends;

    /** An alias of `new PaginatorBuilder`. */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }

    constructor(totalPages: number) {
        this.#totalPages = totalPages;
        this.#currentPage = 1;
        this.#maxItemCount = 9;
        this.#startSize = 1;
        this.#endSize = 1;
        this.#hasPrev = YesNoDepends.Depends;
        this.#hasNext = YesNoDepends.Depends;
    }

    getTotalPages(): number {
        return this.#totalPages;
    }

    /** Set the number of pages. */
    totalPages(n: number): this {
        this.#totalPages = n;

        return this;
    }

    getCurrentPage(): number {
        return this.#currentPage;
    }

    /** Set the number of the current page. */
    currentPage(n: number): this {
        this.#currentPage = n;

        return this;
    }

    getMaxItemCount(): number {
        return this.#maxItemCount;
    }

    /** Set the max number of `PageItem`s after generated. */
    maxItemCount(n: number): this {
        this.#maxItemCount = n;

        return this;
    }

    getStartSize(): number {
        return this.#startSize;
    }

    /**
     * Set the number of `PageItem`s (the `PageItem::Prev` item is excluded) on the start edge
     * (before the first `PageItem::Ignore` item).
     */
    startSize(n: number): this {
        this.#startSize = n;

        return this;
    }

    getEndSize(): number {
        return this.#endSize;
    }

    /**
     * Set the number of `PageItem`s (the `PageItem::Next` item is excluded) on the end edge (after
     * the last `PageItem::Ignore` item).
     */
    endSize(n: number): this {
        this.#endSize = n;

        return this;
    }

    getHasPrev(): YesNoDepends {
        return this.#hasPrev;
    }

    /** Set whether to add the `PageItem::Prev` item. */
    hasPrev(opt: YesNoDepends): this {
        this.#hasPrev = opt;

        return this;
    }

    getHasNext(): YesNoDepends {
        return this.#hasNext;
    }

    /** Set whether to add the `PageItem::Next` item. */
    hasNext(opt: YesNoDepends): this {
        this.#hasNext = opt;

        return this;
    }

    computeMinItemCount(): number {
        switch (this.#totalPages) {
            case 0:
            case 1:
            case 2:
                return this.#totalPages;
            default: {
                const startSize = Math.min(this.#startSize, this.#totalPages);
                const endSize = Math.min(this.#endSize, this.#totalPages);
                const size = startSize + endSize;

                let minItemCount = Math.min(size + 3, this.#totalPages);

                if (this.#hasPrev !== YesNoDepends.No) {
                    minItemCount += 1;
                }

                if (this.#hasNext !== YesNoDepends.No) {
                    minItemCount += 1;
                }

                return minItemCount;
            }
        }
    }

    /**
     * @throws {PaginatorBuildErrors.CurrentPageIncorrect}
     * @throws {PaginatorBuildErrors.TotalPagesIncorrect}
     * @throws {PaginatorBuildErrors.MaxItemCountIncorrect}
     * @throws {PaginatorBuildErrors.StartSizeIncorrect}
     * @throws {PaginatorBuildErrors.EndSizeIncorrect}
     * @throws {PaginatorBuildErrors.CurrentPageTooLarge}
     * @throws {PaginatorBuildErrors.MaxItemCountTooSmall}
     */
    private buildCheckCommon(): void {
        if (!Number.isSafeInteger(this.#currentPage) || this.#currentPage <= 0) {
            throw new CurrentPageIncorrect();
        }

        if (!Number.isSafeInteger(this.#totalPages) || this.#totalPages <= 0) {
            throw new TotalPagesIncorrect();
        }

        if (!Number.isSafeInteger(this.#maxItemCount)) {
            throw new MaxItemCountIncorrect();
        }

        if (!Number.isSafeInteger(this.#startSize) || this.#startSize < 0) {
            throw new StartSizeIncorrect();
        }

        if (!Number.isSafeInteger(this.#endSize) || this.#endSize < 0) {
            throw new EndSizeIncorrect();
        }

        if (this.#currentPage > this.#totalPages) {
            throw new CurrentPageTooLarge(this.#currentPage, this.#totalPages);
        }

        const minItemCount = this.computeMinItemCount();

        if (this.#maxItemCount < minItemCount) {
            throw new MaxItemCountTooSmall(minItemCount);
        }
    }

    /**
     * @throws {PaginatorBuildErrors.CurrentPageIncorrect}
     * @throws {PaginatorBuildErrors.TotalPagesIncorrect}
     * @throws {PaginatorBuildErrors.MaxItemCountIncorrect}
     * @throws {PaginatorBuildErrors.StartSizeIncorrect}
     * @throws {PaginatorBuildErrors.EndSizeIncorrect}
     * @throws {PaginatorBuildErrors.CurrentPageTooLarge}
     * @throws {PaginatorBuildErrors.MaxItemCountTooSmall}
     */
    buildPaginator(): Paginator {
        this.buildCheckCommon();

        return new Paginator(
            this.#totalPages,
            this.#currentPage,
            this.#maxItemCount,
            this.#startSize,
            this.#endSize,
            this.#hasPrev,
            this.#hasNext,
        );
    }

    /**
     * @throws {PaginatorBuildErrors.CurrentPageIncorrect}
     * @throws {PaginatorBuildErrors.TotalPagesIncorrect}
     * @throws {PaginatorBuildErrors.MaxItemCountIncorrect}
     * @throws {PaginatorBuildErrors.CurrentPageTooLarge}
     * @throws {PaginatorBuildErrors.MaxItemCountTooSmall}
     */
    buildPaginatorIter(): PaginatorIter {
        this.buildCheckCommon();

        // oxlint-disable-next-line eslint/no-use-before-define
        return new PaginatorIter(
            this.#totalPages,
            this.#currentPage,
            this.#totalPages,
            this.#maxItemCount,
            this.#startSize,
            this.#endSize,
            this.#hasPrev,
            this.#hasNext,
        );
    }
}

export class PaginatorIter implements IterableIterator<Paginator> {
    /** You should not new `PaginatorIter` on your own. */
    constructor(
        private readonly totalPages: number,
        private currentPage: number,
        private backPage: number,
        private readonly maxItemCount: number,
        private readonly startSize: number,
        private readonly endSize: number,
        private readonly hasPrev: YesNoDepends,
        private readonly hasNext: YesNoDepends,
    ) {
        // do nothing
    }

    private toPageConfig(currentPage: number): Paginator {
        return new Paginator(
            this.totalPages,
            currentPage,
            this.maxItemCount,
            this.startSize,
            this.endSize,
            this.hasPrev,
            this.hasNext,
        );
    }

    next(): IteratorResult<Paginator, undefined> {
        if (this.currentPage <= this.backPage) {
            const pageConfig = this.toPageConfig(this.currentPage);

            this.currentPage += 1;

            return {
                done: false,
                value: pageConfig,
            };
        } else {
            return {
                done: true,
                value: undefined,
            };
        }
    }

    nextBack(): IteratorResult<Paginator, undefined> {
        if (this.currentPage <= this.backPage) {
            const pageConfig = this.toPageConfig(this.backPage);

            this.backPage -= 1;

            return {
                done: false,
                value: pageConfig,
            };
        } else {
            return {
                done: true,
                value: undefined,
            };
        }
    }

    count(): number {
        if (this.currentPage <= this.backPage) {
            return this.backPage + 1 - this.currentPage;
        } else {
            return 0;
        }
    }

    [Symbol.iterator](): IterableIterator<Paginator> {
        return this;
    }
}
