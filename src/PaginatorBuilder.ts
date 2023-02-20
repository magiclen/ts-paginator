import { YesNoDepends } from "./types";
import * as PaginatorBuildErrors from "./PaginatorBuildError";
import { Paginator } from "./Paginator";
import { PaginatorIter } from "./PaginatorIter";

export class PaginatorBuilder {
    private _totalPages: number;

    private _currentPage: number;

    private _maxItemCount: number;

    private _startSize: number;

    private _endSize: number;

    private _hasPrev: YesNoDepends;

    private _hasNext: YesNoDepends;

    /**
     * An alias of `new PaginatorBuilder`.
     */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }

    constructor(totalPages: number) {
        this._totalPages = totalPages;
        this._currentPage = 1;
        this._maxItemCount = 9;
        this._startSize = 1;
        this._endSize = 1;
        this._hasPrev = YesNoDepends.Depends;
        this._hasNext = YesNoDepends.Depends;
    }

    getTotalPages(): number {
        return this._totalPages;
    }

    /**
     * Set the number of pages.
     */
    totalPages(n: number): PaginatorBuilder {
        this._totalPages = n;

        return this;
    }

    getCurrentPage(): number {
        return this._currentPage;
    }

    /**
     * Set the number of the current page.
     */
    currentPage(n: number): PaginatorBuilder {
        this._currentPage = n;

        return this;
    }

    getMaxItemCount(): number {
        return this._maxItemCount;
    }

    /**
     * Set the max number of `PageItem`s after generated.
     */
    maxItemCount(n: number): PaginatorBuilder {
        this._maxItemCount = n;

        return this;
    }

    getStartSize(): number {
        return this._startSize;
    }

    /**
     * Set the number of `PageItem`s (the `PageItem::Prev` item is excluded) on the start edge (before the first `PageItem::Ignore` item).
     */
    startSize(n: number): PaginatorBuilder {
        this._startSize = n;

        return this;
    }

    getEndSize(): number {
        return this._endSize;
    }

    /**
     * Set the number of `PageItem`s (the `PageItem::Next` item is excluded) on the end edge (after the last `PageItem::Ignore` item).
     */
    endSize(n: number): PaginatorBuilder {
        this._endSize = n;

        return this;
    }

    getHasPrev(): YesNoDepends {
        return this._hasPrev;
    }

    /**
     * Set whether to add the `PageItem::Prev` item.
     */
    hasPrev(opt: YesNoDepends): PaginatorBuilder {
        this._hasPrev = opt;

        return this;
    }

    getHasNext(): YesNoDepends {
        return this._hasNext;
    }

    /**
     * Set whether to add the `PageItem::Next` item.
     */
    hasNext(opt: YesNoDepends): PaginatorBuilder {
        this._hasNext = opt;

        return this;
    }

    computeMinItemCount(): number {
        switch (this._totalPages) {
            case 0:
            case 1:
            case 2:
                return this._totalPages;
            default:
            {
                const startSize = Math.min(this._startSize, this._totalPages);
                const endSize = Math.min(this._endSize, this._totalPages);
                const size = startSize + endSize;

                let minItemCount = Math.min(size + 3, this._totalPages);
                
                if (this._hasPrev !== YesNoDepends.No) {
                    minItemCount += 1;
                }

                if (this._hasNext !== YesNoDepends.No) {
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
    private buildCheckCommon() {
        if (!Number.isSafeInteger(this._currentPage) || this._currentPage <= 0) {
            throw new PaginatorBuildErrors.CurrentPageIncorrect();
        }

        if (!Number.isSafeInteger(this._totalPages) || this._totalPages <= 0) {
            throw new PaginatorBuildErrors.TotalPagesIncorrect();
        }

        if (!Number.isSafeInteger(this._maxItemCount)) {
            throw new PaginatorBuildErrors.MaxItemCountIncorrect();
        }

        if (!Number.isSafeInteger(this._startSize) || this._startSize < 0) {
            throw new PaginatorBuildErrors.StartSizeIncorrect();
        }

        if (!Number.isSafeInteger(this._endSize) || this._endSize < 0) {
            throw new PaginatorBuildErrors.EndSizeIncorrect();
        }

        if (this._currentPage > this._totalPages) {
            throw new PaginatorBuildErrors.CurrentPageTooLarge(this._currentPage, this._totalPages);
        }

        const minItemCount = this.computeMinItemCount();

        if (this._maxItemCount < minItemCount) {
            throw new PaginatorBuildErrors.MaxItemCountTooSmall(minItemCount);
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
            this._totalPages,
            this._currentPage,
            this._maxItemCount,
            this._startSize,
            this._endSize,
            this._hasPrev,
            this._hasNext,
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

        return new PaginatorIter(
            this._totalPages,
            this._currentPage,
            this._totalPages,
            this._maxItemCount,
            this._startSize,
            this._endSize,
            this._hasPrev,
            this._hasNext,
        );
    }
}
