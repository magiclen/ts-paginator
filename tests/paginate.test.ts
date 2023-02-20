import { pageItemsToString, Paginator, PaginatorIter } from "../src/lib";

const iterCheck = (p: PaginatorIter, expects: string[]) => {
    for (const e of expects) {
        const paginator = p.next().value;

        expect(paginator).not.toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(pageItemsToString(paginator!.paginate())).toBe(e);
    }

    expect(p.next().value).toBeUndefined();
};

it("one page", () => {
    const p = Paginator.builder(1)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginator();

    expect(pageItemsToString(p.paginate())).toBe("1*");
});

it("two pages", () => {
    const p = Paginator.builder(2)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2",
        "1 2*",
    ];

    iterCheck(p, expects);
});

it("three pages", () => {
    const p = Paginator.builder(3)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 >",
        "< 1 2* 3 >",
        "< 1 2 3*",
    ];

    iterCheck(p, expects);
});

it("four pages", () => {
    const p = Paginator.builder(4)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 >",
        "< 1 2* 3 4 >",
        "< 1 2 3* 4 >",
        "< 1 2 3 4*",
    ];

    iterCheck(p, expects);
});

it("five pages", () => {
    const p = Paginator.builder(5)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 >",
        "< 1 2* 3 4 5 >",
        "< 1 2 3* 4 5 >",
        "< 1 2 3 4* 5 >",
        "< 1 2 3 4 5*",
    ];

    iterCheck(p, expects);
});

it("six pages", () => {
    const p = Paginator.builder(6)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 >",
        "< 1 2* 3 4 5 6 >",
        "< 1 2 3* 4 5 6 >",
        "< 1 2 3 4* 5 6 >",
        "< 1 2 3 4 5* 6 >",
        "< 1 2 3 4 5 6*",
    ];

    iterCheck(p, expects);
});

it("seven pages", () => {
    const p = Paginator.builder(7)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 7 >",
        "< 1 2* 3 4 5 6 7 >",
        "< 1 2 3* 4 5 6 7 >",
        "< 1 2 3 4* 5 6 7 >",
        "< 1 2 3 4 5* 6 7 >",
        "< 1 2 3 4 5 6* 7 >",
        "< 1 2 3 4 5 6 7*",
    ];

    iterCheck(p, expects);
});

it("eight pages", () => {
    const p = Paginator.builder(8)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 7 8 >",
        "< 1 2* 3 4 5 ... 8 >",
        "< 1 2 3* 4 5 ... 8 >",
        "< 1 2 3 4* 5 ... 8 >",
        "< 1 ... 4 5* 6 7 8 >",
        "< 1 ... 4 5 6* 7 8 >",
        "< 1 ... 4 5 6 7* 8 >",
        "< 1 2 3 4 5 6 7 8*",
    ];

    iterCheck(p, expects);
});

it("nine pages", () => {
    const p = Paginator.builder(9)
        .maxItemCount(9)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 ... 9 >",
        "< 1 2* 3 4 5 ... 9 >",
        "< 1 2 3* 4 5 ... 9 >",
        "< 1 2 3 4* 5 ... 9 >",
        "< 1 ... 4 5* 6 ... 9 >",
        "< 1 ... 5 6* 7 8 9 >",
        "< 1 ... 5 6 7* 8 9 >",
        "< 1 ... 5 6 7 8* 9 >",
        "< 1 ... 4 5 6 7 8 9*",
    ];

    iterCheck(p, expects);
});

it("twenty pages, maxItemCount = 17", () => {
    const p = Paginator.builder(20)
        .maxItemCount(17)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 7 8 9 10 11 12 13 14 ... 20 >",
        "< 1 2* 3 4 5 6 7 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3* 4 5 6 7 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3 4* 5 6 7 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3 4 5* 6 7 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3 4 5 6* 7 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3 4 5 6 7* 8 9 10 11 12 13 ... 20 >",
        "< 1 2 3 4 5 6 7 8* 9 10 11 12 13 ... 20 >",
        "< 1 ... 4 5 6 7 8 9* 10 11 12 13 14 ... 20 >",
        "< 1 ... 5 6 7 8 9 10* 11 12 13 14 15 ... 20 >",
        "< 1 ... 6 7 8 9 10 11* 12 13 14 15 16 ... 20 >",
        "< 1 ... 7 8 9 10 11 12* 13 14 15 16 17 ... 20 >",
        "< 1 ... 8 9 10 11 12 13* 14 15 16 17 18 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14* 15 16 17 18 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14 15* 16 17 18 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14 15 16* 17 18 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14 15 16 17* 18 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14 15 16 17 18* 19 20 >",
        "< 1 ... 8 9 10 11 12 13 14 15 16 17 18 19* 20 >",
        "< 1 ... 7 8 9 10 11 12 13 14 15 16 17 18 19 20*",
    ];

    iterCheck(p, expects);
});

it("twenty pages, maxItemCount = 19", () => {
    const p = Paginator.builder(20)
        .maxItemCount(19)
        .startSize(1)
        .endSize(1)
        .buildPaginatorIter();

    const expects = [
        "1* 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 ... 20 >",
        "< 1 2* 3 4 5 6 7 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3* 4 5 6 7 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4* 5 6 7 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4 5* 6 7 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4 5 6* 7 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4 5 6 7* 8 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4 5 6 7 8* 9 10 11 12 13 14 15 ... 20 >",
        "< 1 2 3 4 5 6 7 8 9* 10 11 12 13 14 15 ... 20 >",
        "< 1 ... 4 5 6 7 8 9 10* 11 12 13 14 15 16 ... 20 >",
        "< 1 ... 5 6 7 8 9 10 11* 12 13 14 15 16 17 ... 20 >",
        "< 1 ... 6 7 8 9 10 11 12* 13 14 15 16 17 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13* 14 15 16 17 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14* 15 16 17 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14 15* 16 17 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14 15 16* 17 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14 15 16 17* 18 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14 15 16 17 18* 19 20 >",
        "< 1 ... 6 7 8 9 10 11 12 13 14 15 16 17 18 19* 20 >",
        "< 1 ... 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20*",
    ];

    iterCheck(p, expects);
});
