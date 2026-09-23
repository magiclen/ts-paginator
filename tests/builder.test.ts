import assert from "node:assert/strict";
import { it } from "node:test";

import { PaginatorBuildError, PaginatorBuilder, YesNoDepends } from "../src/index.ts";

it("basic", () => {
    assert.doesNotThrow(() => PaginatorBuilder.builder(1).buildPaginator());
    assert.doesNotThrow(() => PaginatorBuilder.builder(1).buildPaginatorIter());
    assert.throws(() => PaginatorBuilder.builder(0).currentPage(1).buildPaginator(), {
        name: "PaginatorBuildError",
        kind: "totalPagesZero",
    });
    assert.throws(() => PaginatorBuilder.builder(1).currentPage(0).buildPaginatorIter(), {
        name: "PaginatorBuildError",
        kind: "currentPageZero",
    });
    assert.throws(() => PaginatorBuilder.builder(1).currentPage(2).buildPaginatorIter(), {
        name: "PaginatorBuildError",
        kind: "currentPageTooLarge",
    });
});

it("forced controls on small page counts", () => {
    const onePage = PaginatorBuilder.builder(1).hasPrev(YesNoDepends.Yes).hasNext(YesNoDepends.Yes);

    assert.throws(() => onePage.maxItemCount(2).buildPaginator(), {
        kind: "maxItemCountTooSmall",
        minItemCount: 3,
    });
    assert.doesNotThrow(() => onePage.maxItemCount(3).buildPaginator());

    const twoPages = PaginatorBuilder.builder(2)
        .hasPrev(YesNoDepends.Yes)
        .hasNext(YesNoDepends.Yes);

    assert.throws(() => twoPages.maxItemCount(3).buildPaginator(), {
        kind: "maxItemCountTooSmall",
        minItemCount: 4,
    });
    assert.doesNotThrow(() => twoPages.maxItemCount(4).buildPaginatorIter());
});

it("maxItemCount 1", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(1)
        .endSize(1)
        .hasPrev(YesNoDepends.Depends)
        .hasNext(YesNoDepends.Depends);

    assert.throws(
        () => builder.totalPages(1).maxItemCount(0).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(1).maxItemCount(1).buildPaginator());
    assert.throws(
        () => builder.totalPages(2).maxItemCount(1).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(2).maxItemCount(2).buildPaginator());
    assert.throws(
        () => builder.totalPages(3).maxItemCount(2).buildPaginator(),
        PaginatorBuildError,
    );
    assert.throws(
        () => builder.totalPages(3).maxItemCount(3).buildPaginator(),
        PaginatorBuildError,
    );
    assert.throws(
        () => builder.totalPages(3).maxItemCount(4).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(3).maxItemCount(5).buildPaginator());
    assert.throws(
        () => builder.totalPages(4).maxItemCount(5).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(4).maxItemCount(6).buildPaginator());
    assert.throws(
        () => builder.totalPages(5).maxItemCount(6).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(5).maxItemCount(7).buildPaginator());
    assert.doesNotThrow(() => builder.totalPages(6).maxItemCount(7).buildPaginator());
    assert.doesNotThrow(() => builder.totalPages(7).maxItemCount(7).buildPaginator());
    assert.throws(
        () => builder.totalPages(7).maxItemCount(6).buildPaginator(),
        PaginatorBuildError,
    );
});

it("maxItemCount 2", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(0)
        .endSize(0)
        .hasPrev(YesNoDepends.No)
        .hasNext(YesNoDepends.No);

    assert.throws(
        () => builder.totalPages(1).maxItemCount(0).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(1).maxItemCount(1).buildPaginator());
    assert.throws(
        () => builder.totalPages(2).maxItemCount(1).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(2).maxItemCount(2).buildPaginator());
    assert.throws(
        () => builder.totalPages(3).maxItemCount(2).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(3).maxItemCount(3).buildPaginator());
    assert.doesNotThrow(() => builder.totalPages(4).maxItemCount(3).buildPaginator());
    assert.throws(
        () => builder.totalPages(4).maxItemCount(2).buildPaginator(),
        PaginatorBuildError,
    );
});

it("maxItemCount 3", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(2)
        .endSize(2)
        .hasPrev(YesNoDepends.No)
        .hasNext(YesNoDepends.No);

    assert.throws(
        () => builder.totalPages(1).maxItemCount(0).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(1).maxItemCount(1).buildPaginator());
    assert.throws(
        () => builder.totalPages(2).maxItemCount(1).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(2).maxItemCount(2).buildPaginator());
    assert.throws(
        () => builder.totalPages(3).maxItemCount(2).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(3).maxItemCount(3).buildPaginator());
    assert.throws(
        () => builder.totalPages(4).maxItemCount(3).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(4).maxItemCount(4).buildPaginator());
    assert.throws(
        () => builder.totalPages(5).maxItemCount(4).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(5).maxItemCount(5).buildPaginator());
    assert.throws(
        () => builder.totalPages(6).maxItemCount(5).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(6).maxItemCount(6).buildPaginator());
    assert.throws(
        () => builder.totalPages(7).maxItemCount(6).buildPaginator(),
        PaginatorBuildError,
    );
    assert.doesNotThrow(() => builder.totalPages(7).maxItemCount(7).buildPaginator());
    assert.doesNotThrow(() => builder.totalPages(8).maxItemCount(7).buildPaginator());
    assert.throws(
        () => builder.totalPages(8).maxItemCount(6).buildPaginator(),
        PaginatorBuildError,
    );
});

it("oversized layout settings do not overflow", () => {
    assert.throws(
        () =>
            PaginatorBuilder.builder(Number.MAX_SAFE_INTEGER)
                .startSize(Number.MAX_SAFE_INTEGER)
                .endSize(Number.MAX_SAFE_INTEGER)
                .buildPaginator(),
        { kind: "maxItemCountTooSmall", minItemCount: Number.MAX_SAFE_INTEGER },
    );
});
