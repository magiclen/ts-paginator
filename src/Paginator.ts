import { YesNoDepends } from "./types";
import * as PageItems from "./PageItem";
import { PaginatorBuilder } from "./PaginatorBuilder";

export class Paginator {
    /**
     * An alias of `new PaginatorBuilder`.
     */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }
        
    /**
     * You should not new `Paginator` on your own.
     */
    constructor(
        public readonly totalPages:number,
        public readonly currentPage:number,
        public readonly maxItemCount:number,
        public readonly startSize:number,
        public readonly endSize:number,
        public readonly hasPrev:YesNoDepends,
        public readonly hasNext:YesNoDepends,
    ) {
        // do nothing
    }

    paginate(): PageItems.PageItem[] {
        const v: PageItems.PageItem[] = [];
        let itemsCounter = this.maxItemCount;

        // eslint-disable-next-line no-extra-parens
        const showPrev = this.hasPrev === YesNoDepends.Yes || (this.hasPrev === YesNoDepends.Depends && this.currentPage > 1 && this.totalPages > 2);
        
        // eslint-disable-next-line no-extra-parens
        const showNext = this.hasNext === YesNoDepends.Yes || (this.hasNext === YesNoDepends.Depends && this.currentPage < this.totalPages && this.totalPages > 2);
        
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

                for (let i = 1;i <= startSize;i++) {
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

                for (let i = hpS;i <= hpE;i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.currentPage(this.currentPage));

                for (let i = tpS;i <= tpE;i++) {
                    v.push(PageItems.page(i));
                }

                if (tpE + 2 === endStart) {
                    v.push(PageItems.page(tpE + 1));
                } else {
                    v.push(PageItems.ignore());
                }

                for (let i = endStart;i <= this.totalPages;i++) {
                    v.push(PageItems.page(i));
                }
            } else {
                if (this.currentPage < this.totalPages) {
                    itemsCounter -= this.totalPages - this.currentPage;
                }

                for (let i = 1;i <= startSize;i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.ignore());

                for (let i = this.currentPage - itemsCounter;i < this.currentPage;i++) {
                    v.push(PageItems.page(i));
                }

                v.push(PageItems.currentPage(this.currentPage));

                for (let i = this.currentPage + 1;i <= this.totalPages;i++) {
                    v.push(PageItems.page(i));
                }
            }
        } else if (ignoreEnd) {
            itemsCounter -= endSize + 1;
            itemsCounter -= this.currentPage;

            for (let i = 1;i < this.currentPage;i++) {
                v.push(PageItems.page(i));
            }

            v.push(PageItems.currentPage(this.currentPage));
        
            {
                const s = this.currentPage + 1;
                const e = this.currentPage + itemsCounter;

                for (let i = s;i <= e;i++) {
                    v.push(PageItems.page(i));
                }
            }

            v.push(PageItems.ignore());

            for (let i = this.totalPages - this.endSize + 1;i <= this.totalPages;i++) {
                v.push(PageItems.page(i));
            }
        } else {
            for (let i = 1;i < this.currentPage;i++) {
                v.push(PageItems.page(i));
            }

            v.push(PageItems.currentPage(this.currentPage));

            for (let i = this.currentPage + 1;i <= this.totalPages;i++) {
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
