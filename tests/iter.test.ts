import { PaginatorBuilder } from "../src/lib";

it("one page", () => {
    const iter = new PaginatorBuilder(1).buildPaginatorIter();

    expect(iter.next().value?.currentPage).toBe(1);
    expect(iter.next().value).toBeUndefined();
});

it("two pages", () => {
    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    expect(iter.next().value?.currentPage).toBe(1);
    expect(iter.next().value?.currentPage).toBe(2);
    expect(iter.next().value).toBeUndefined();
});

it("two pages rev", () => {
    const iter = new PaginatorBuilder(2).buildPaginatorIter();

    expect(iter.nextBack().value?.currentPage).toBe(2);
    expect(iter.nextBack().value?.currentPage).toBe(1);
    expect(iter.nextBack().value).toBeUndefined();
});
