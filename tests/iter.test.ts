import assert from "node:assert/strict";
import { it } from "node:test";

import { PaginatorBuilder } from "../src/index.ts";

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
