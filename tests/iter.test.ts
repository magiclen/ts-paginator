import assert from "node:assert/strict";
import { it } from "node:test";

import { Paginator, PaginatorBuilder } from "../src/index.ts";

it("one page", () => {
    const iter = new PaginatorBuilder(1).buildPaginatorIter();

    assert.equal(iter.next().value?.currentPage, 1);
    assert.equal(iter.next().value, undefined);
});

it("two pages", () => {
    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    assert.equal(iter.next().value?.currentPage, 1);
    assert.equal(iter.next().value?.currentPage, 2);
    assert.equal(iter.next().value, undefined);
});

it("two pages rev", () => {
    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    assert.equal(iter.nextBack().value?.currentPage, 2);
    assert.equal(iter.nextBack().value?.currentPage, 1);
    assert.equal(iter.nextBack().value, undefined);
});

it("exact size and fused", () => {
    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    assert.equal(iter.count(), 2);
    assert.equal(iter.next().value?.currentPage, 1);
    assert.equal(iter.count(), 1);
    assert.equal(iter.nextBack().value?.currentPage, 2);
    assert.equal(iter.count(), 0);
    assert.equal(iter.next().value, undefined);
    assert.equal(iter.nextBack().value, undefined);
});

it("nth and nthBack", () => {
    const iter = new PaginatorBuilder(6).buildPaginatorIter();

    assert.equal(iter.nth(1).value?.currentPage, 2);
    assert.equal(iter.nthBack(1).value?.currentPage, 5);
    assert.deepEqual(
        Array.from(iter, (p) => p.currentPage),
        [3, 4],
    );
});

it("iter from current page", () => {
    const paginator = Paginator.builder(5).currentPage(3).buildPaginator();

    assert.deepEqual(
        Array.from(paginator.iter(), (p) => p.currentPage),
        [3, 4, 5],
    );
});

it("large indices do not overflow", () => {
    const MAX = Number.MAX_SAFE_INTEGER;

    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    assert.equal(iter.nth(MAX).value, undefined);
    assert.equal(iter.next().value, undefined);

    const largeIter = new PaginatorBuilder(MAX).buildPaginatorIter();

    assert.equal(largeIter.count(), MAX);
    assert.equal(largeIter.nextBack().value?.currentPage, MAX);

    const lastPage = new PaginatorBuilder(MAX).currentPage(MAX).buildPaginatorIter();

    assert.equal(lastPage.next().value?.currentPage, MAX);
    assert.equal(lastPage.next().value, undefined);
});
