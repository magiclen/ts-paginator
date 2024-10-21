import {
    PaginatorBuildErrors,
    PaginatorBuilder,
    YesNoDepends,
} from "../src/lib.js";

it("basic", () => {
    expect(() => PaginatorBuilder.builder(1).buildPaginator()).toBeDefined();
    expect(() => PaginatorBuilder.builder(1).buildPaginatorIter())
        .toBeDefined();
    expect(() => PaginatorBuilder.builder(0).currentPage(1).buildPaginator())
        .toThrow(PaginatorBuildErrors.TotalPagesIncorrect);
    expect(() => PaginatorBuilder.builder(1).currentPage(0).buildPaginatorIter()).toThrow(PaginatorBuildErrors.CurrentPageIncorrect);
    expect(() => PaginatorBuilder.builder(1).currentPage(2).buildPaginatorIter()).toThrow(PaginatorBuildErrors.CurrentPageTooLarge);
});

it("maxItemCount 1", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(1)
        .endSize(1)
        .hasPrev(YesNoDepends.Depends)
        .hasNext(YesNoDepends.Depends);

    expect(() => builder.totalPages(1).maxItemCount(0).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(1).maxItemCount(1).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(1).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(2).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(2).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(3).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(4).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(5).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(5).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(6).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(5).maxItemCount(6).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(5).maxItemCount(7).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(6).maxItemCount(7).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(7).maxItemCount(7).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(7).maxItemCount(6).buildPaginator())
        .toThrow(Error);
});

it("maxItemCount 2", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(0)
        .endSize(0)
        .hasPrev(YesNoDepends.No)
        .hasNext(YesNoDepends.No);

    expect(() => builder.totalPages(1).maxItemCount(0).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(1).maxItemCount(1).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(1).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(2).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(2).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(3).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(3).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(2).buildPaginator())
        .toThrow(Error);
});

it("maxItemCount 3", () => {
    const builder = new PaginatorBuilder(1)
        .startSize(2)
        .endSize(2)
        .hasPrev(YesNoDepends.No)
        .hasNext(YesNoDepends.No);

    expect(() => builder.totalPages(1).maxItemCount(0).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(1).maxItemCount(1).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(1).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(2).maxItemCount(2).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(2).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(3).maxItemCount(3).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(3).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(4).maxItemCount(4).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(5).maxItemCount(4).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(5).maxItemCount(5).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(6).maxItemCount(5).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(6).maxItemCount(6).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(7).maxItemCount(6).buildPaginator())
        .toThrow(Error);
    expect(() => builder.totalPages(7).maxItemCount(7).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(8).maxItemCount(7).buildPaginator()).not
        .toThrow(Error);
    expect(() => builder.totalPages(8).maxItemCount(6).buildPaginator())
        .toThrow(Error);
});
