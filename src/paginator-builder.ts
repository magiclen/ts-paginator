import { PaginatorIter } from "./paginator-iter.ts";
import type { PaginatorOptions } from "./paginator.ts";
import { Paginator } from "./paginator.ts";
import { YesNoDepends } from "./yes-no-depends.ts";

/** The reason why a `PaginatorBuildError` is thrown. */
export type PaginatorBuildErrorKind =
    | "currentPageZero"
    | "totalPagesZero"
    | "currentPageTooLarge"
    | "maxItemCountTooSmall";

/** The error thrown when paginator settings are invalid. */
export class PaginatorBuildError extends Error {
    override readonly name = "PaginatorBuildError";

    /** Why the settings are invalid. */
    readonly kind: PaginatorBuildErrorKind;

    /**
     * The smallest valid `maxItemCount`, or `Number.MAX_SAFE_INTEGER` if no value is large enough.
     * It is only set when `kind` is `"maxItemCountTooSmall"`.
     */
    readonly minItemCount: number | undefined;

    constructor(kind: PaginatorBuildErrorKind, message: string, minItemCount?: number) {
        super(message);

        this.kind = kind;
        this.minItemCount = minItemCount;
    }
}

/** Paginator options with every default value filled in. */
export type PaginatorSettings = Required<PaginatorOptions>;

/**
 * Check a number which is used as a page number, a count, or an index.
 *
 * @throws {TypeError} If the value is not a number.
 * @throws {RangeError} If the value is not a non-negative safe integer.
 */
export const validateInteger = (name: string, value: unknown): number => {
    // JavaScript callers can pass any type.
    if (typeof value !== "number") {
        throw new TypeError(`\`${name}\` must be a number, but its type is ${typeof value}.`);
    }

    if (!Number.isSafeInteger(value) || value < 0) {
        throw new RangeError(
            `\`${name}\` must be a non-negative safe integer, but it is ${value}.`,
        );
    }

    return value;
};

/**
 * Check a `YesNoDepends` value.
 *
 * @throws {TypeError} If the value is not a string.
 * @throws {RangeError} If the value is not `"yes"`, `"no"`, or `"depends"`.
 */
const validateYesNoDepends = (name: string, value: unknown): YesNoDepends => {
    // JavaScript callers can pass any type.
    if (typeof value !== "string") {
        throw new TypeError(`\`${name}\` must be a string, but its type is ${typeof value}.`);
    }

    switch (value) {
        case YesNoDepends.Yes:
        case YesNoDepends.No:
        case YesNoDepends.Depends:
            return value;
        default:
            throw new RangeError(
                `\`${name}\` must be "yes", "no", or "depends", but it is ${JSON.stringify(value)}.`,
            );
    }
};

/**
 * Return the smallest valid `maxItemCount`. A result larger than `Number.MAX_SAFE_INTEGER` means
 * that no value is large enough.
 */
const computeMinItemCount = (
    settings: Omit<PaginatorSettings, "currentPage" | "maxItemCount">,
): number => {
    switch (settings.totalPages) {
        case 0:
            return 0;
        case 1:
        case 2:
            return (
                settings.totalPages +
                (settings.hasPrev === YesNoDepends.Yes ? 1 : 0) +
                (settings.hasNext === YesNoDepends.Yes ? 1 : 0)
            );
        default: {
            const startSize = Math.min(settings.startSize, settings.totalPages);
            const endSize = Math.min(settings.endSize, settings.totalPages);

            // `Math.min` keeps the result exact because `totalPages` is a safe integer.
            let minItemCount = Math.min(startSize + endSize + 3, settings.totalPages);

            if (settings.hasPrev !== YesNoDepends.No) {
                minItemCount += 1;
            }

            if (settings.hasNext !== YesNoDepends.No) {
                minItemCount += 1;
            }

            return minItemCount;
        }
    }
};

/**
 * Fill in the default values of the options and check them.
 *
 * @throws {PaginatorBuildError} If the options cannot be used to build a paginator.
 * @throws {TypeError} If an option has a wrong type.
 * @throws {RangeError} If a number option is not a non-negative safe integer, or `hasPrev` or
 *   `hasNext` is not a `YesNoDepends` value.
 */
export const resolvePaginatorOptions = (options: PaginatorOptions): PaginatorSettings => {
    const settings: PaginatorSettings = {
        totalPages: validateInteger("totalPages", options.totalPages),
        currentPage: validateInteger("currentPage", options.currentPage ?? 1),
        maxItemCount: validateInteger("maxItemCount", options.maxItemCount ?? 9),
        startSize: validateInteger("startSize", options.startSize ?? 1),
        endSize: validateInteger("endSize", options.endSize ?? 1),
        hasPrev: validateYesNoDepends("hasPrev", options.hasPrev ?? YesNoDepends.Depends),
        hasNext: validateYesNoDepends("hasNext", options.hasNext ?? YesNoDepends.Depends),
    };

    if (settings.currentPage === 0) {
        throw new PaginatorBuildError("currentPageZero", "currentPage should not be zero");
    }

    if (settings.totalPages === 0) {
        throw new PaginatorBuildError("totalPagesZero", "totalPages should not be zero");
    }

    if (settings.currentPage > settings.totalPages) {
        throw new PaginatorBuildError(
            "currentPageTooLarge",
            `${settings.currentPage} > ${settings.totalPages} (currentPage > totalPages)`,
        );
    }

    const minItemCount = computeMinItemCount(settings);

    if (settings.maxItemCount < minItemCount) {
        // `Number.MAX_SAFE_INTEGER` means that no value is large enough, like `usize::MAX` in the Rust version.
        const reportedMinItemCount = Math.min(minItemCount, Number.MAX_SAFE_INTEGER);

        throw new PaginatorBuildError(
            "maxItemCountTooSmall",
            `maxItemCount cannot be smaller than ${reportedMinItemCount}`,
            reportedMinItemCount,
        );
    }

    return settings;
};

/** A class to create `Paginator` or `PaginatorIter`. */
export class PaginatorBuilder {
    /** An alias of `new PaginatorBuilder(totalPages)`. */
    static builder(totalPages: number): PaginatorBuilder {
        return new PaginatorBuilder(totalPages);
    }

    #totalPages: number;

    #currentPage = 1;

    #maxItemCount = 9;

    #startSize = 1;

    #endSize = 1;

    #hasPrev: YesNoDepends = YesNoDepends.Depends;

    #hasNext: YesNoDepends = YesNoDepends.Depends;

    /**
     * Create a new `PaginatorBuilder` with the default options: `currentPage` is 1, `maxItemCount`
     * is 9, `startSize` and `endSize` are 1, and `hasPrev` and `hasNext` are `"depends"`.
     */
    constructor(totalPages: number) {
        this.#totalPages = totalPages;
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

    /**
     * Set the max number of `PageItem`s after generated.
     *
     * Building fails if this is smaller than `min(startSize + endSize + 3, totalPages)` plus one
     * for each of `hasPrev` and `hasNext` that is not `"no"` (only `"yes"` counts when `totalPages`
     * is 1 or 2).
     */
    maxItemCount(n: number): this {
        this.#maxItemCount = n;

        return this;
    }

    getStartSize(): number {
        return this.#startSize;
    }

    /**
     * Set the number of `PageItem`s (the `prev` item is excluded) on the start edge (before the
     * first `ignore` item).
     */
    startSize(n: number): this {
        this.#startSize = n;

        return this;
    }

    getEndSize(): number {
        return this.#endSize;
    }

    /**
     * Set the number of `PageItem`s (the `next` item is excluded) on the end edge (after the last
     * `ignore` item).
     */
    endSize(n: number): this {
        this.#endSize = n;

        return this;
    }

    getHasPrev(): YesNoDepends {
        return this.#hasPrev;
    }

    /** Set whether to add the `prev` item. */
    hasPrev(opt: YesNoDepends): this {
        this.#hasPrev = opt;

        return this;
    }

    getHasNext(): YesNoDepends {
        return this.#hasNext;
    }

    /** Set whether to add the `next` item. */
    hasNext(opt: YesNoDepends): this {
        this.#hasNext = opt;

        return this;
    }

    /**
     * Compute the smallest valid `maxItemCount`, or `Number.MAX_SAFE_INTEGER` if no value is large
     * enough.
     */
    computeMinItemCount(): number {
        return Math.min(computeMinItemCount(this.#toOptions()), Number.MAX_SAFE_INTEGER);
    }

    #toOptions(): PaginatorSettings {
        return {
            totalPages: this.#totalPages,
            currentPage: this.#currentPage,
            maxItemCount: this.#maxItemCount,
            startSize: this.#startSize,
            endSize: this.#endSize,
            hasPrev: this.#hasPrev,
            hasNext: this.#hasNext,
        };
    }

    /**
     * Build a paginator with the configured current page.
     *
     * @throws {PaginatorBuildError} If the options cannot be used to build a paginator.
     * @throws {TypeError} If an option has a wrong type.
     * @throws {RangeError} If a number option is not a non-negative safe integer, or `hasPrev` or
     *   `hasNext` is not a `YesNoDepends` value.
     */
    buildPaginator(): Paginator {
        return new Paginator(this.#toOptions());
    }

    /**
     * Build an iterator that yields paginators from the configured current page through the last
     * page.
     *
     * @throws {PaginatorBuildError} If the options cannot be used to build a paginator.
     * @throws {TypeError} If an option has a wrong type.
     * @throws {RangeError} If a number option is not a non-negative safe integer, or `hasPrev` or
     *   `hasNext` is not a `YesNoDepends` value.
     */
    buildPaginatorIter(): PaginatorIter {
        return new PaginatorIter(this.#toOptions());
    }
}
