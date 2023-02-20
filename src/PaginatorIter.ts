import { YesNoDepends } from "./types";
import { Paginator } from "./Paginator";

export class PaginatorIter implements IterableIterator<Paginator> {
    /**
     * You should not new `PaginatorIter` on your own.
     */
    constructor(
        private readonly totalPages:number,
        private currentPage:number,
        private backPage: number,
        private readonly maxItemCount:number,
        private readonly startSize:number,
        private readonly endSize:number,
        private readonly hasPrev:YesNoDepends,
        private readonly hasNext:YesNoDepends,
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
