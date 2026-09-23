import type { PaginatorSettings } from "./paginator-builder.ts";
import { PaginatorBuilder, resolvePaginatorOptions, validateInteger } from "./paginator-builder.ts";
import type { PaginatorOptions } from "./paginator.ts";
import { Paginator } from "./paginator.ts";

const done = (): IteratorReturnResult<undefined> => ({ done: true, value: undefined });

/** An iterator over paginators for consecutive current pages. */
export class PaginatorIter implements IterableIterator<Paginator> {
    /** An alias of `new PaginatorBuilder(totalPages)`. */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }

    readonly #settings: PaginatorSettings;

    #currentPage: number;

    #backPage: number;

    /**
     * Create an iterator from `options.currentPage` through the last page. Options that are not set
     * use their default values.
     *
     * @throws {PaginatorBuildError} If the options cannot be used to build a paginator.
     * @throws {TypeError} If an option has a wrong type.
     * @throws {RangeError} If a number option is not a non-negative safe integer, or `hasPrev` or
     *   `hasNext` is not a `YesNoDepends` value.
     */
    constructor(options: PaginatorOptions) {
        this.#settings = resolvePaginatorOptions(options);
        this.#currentPage = this.#settings.currentPage;
        this.#backPage = this.#settings.totalPages;
    }

    #toPaginator(currentPage: number): Paginator {
        return new Paginator({ ...this.#settings, currentPage });
    }

    #exhaust(): void {
        // Put the back cursor before the front cursor to mark the iterator as exhausted.
        this.#backPage = this.#currentPage - 1;
    }

    /** Return the paginator for the next page from the front. */
    next(): IteratorResult<Paginator, undefined> {
        if (this.#currentPage > this.#backPage) {
            return done();
        }

        const paginator = this.#toPaginator(this.#currentPage);

        if (this.#currentPage === this.#backPage) {
            this.#exhaust();
        } else {
            this.#currentPage += 1;
        }

        return { done: false, value: paginator };
    }

    /** Return the paginator for the next page from the back. */
    nextBack(): IteratorResult<Paginator, undefined> {
        if (this.#currentPage > this.#backPage) {
            return done();
        }

        const paginator = this.#toPaginator(this.#backPage);

        this.#backPage -= 1;

        return { done: false, value: paginator };
    }

    /**
     * Skip `n` pages from the front and return the paginator for the page after them.
     *
     * @throws {TypeError} If `n` is not a number.
     * @throws {RangeError} If `n` is not a non-negative safe integer.
     */
    nth(n: number): IteratorResult<Paginator, undefined> {
        if (validateInteger("n", n) < this.count()) {
            this.#currentPage += n;

            return this.next();
        }

        this.#exhaust();

        return done();
    }

    /**
     * Skip `n` pages from the back and return the paginator for the page before them.
     *
     * @throws {TypeError} If `n` is not a number.
     * @throws {RangeError} If `n` is not a non-negative safe integer.
     */
    nthBack(n: number): IteratorResult<Paginator, undefined> {
        if (validateInteger("n", n) < this.count()) {
            this.#backPage -= n;

            return this.nextBack();
        }

        this.#exhaust();

        return done();
    }

    /** Return the number of the remaining pages. */
    count(): number {
        if (this.#currentPage <= this.#backPage) {
            return this.#backPage - this.#currentPage + 1;
        }

        return 0;
    }

    [Symbol.iterator](): IterableIterator<Paginator> {
        return this;
    }
}
