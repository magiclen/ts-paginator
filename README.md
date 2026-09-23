pagination-bar-generator
==========

[![CI](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml)

This library is used for generating pagination bars on webpages or other UIs.

## Usage

### Creating a Pagination Bar Which Has 5 Pages and Is on Page 1

```typescript
import { Paginator } from "pagination-bar-generator";

const paginator = new Paginator({ totalPages: 5, currentPage: 1 });

let html = "";

for (const pageItem of paginator.paginate()) {
    switch (pageItem.type) {
        case "prev":
            // The `prev` item is used when the `hasPrev` option is not set to `"no"`.
            html += `<li><a href="/page/${pageItem.pageNumber}">&laquo;</a></li>`;
            break;
        case "page":
            html += `<li><a href="/page/${pageItem.pageNumber}">${pageItem.pageNumber}</a></li>`;
            break;
        case "currentPage":
            html += `<li>${pageItem.pageNumber}</li>`;
            break;
        case "ignore":
            html += "<li>...</li>";
            break;
        case "next":
            // The `next` item is used when the `hasNext` option is not set to `"no"`.
            html += `<li><a href="/page/${pageItem.pageNumber}">&raquo;</a></li>`;
            break;
        case "reservedPrev":
        case "reservedNext":
            // The `reservedPrev` or `reservedNext` item is used only when the `hasPrev` option or the `hasNext` option is set to `"yes"`.
            break;
    }
}
```

`PageItem`s are plain objects, so they can be serialized to JSON directly.

### Options

| Option         | Default     | Description                                                                                                  |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `totalPages`   | (required)  | The number of pages.                                                                                         |
| `currentPage`  | `1`         | The number of the current page.                                                                              |
| `maxItemCount` | `9`         | The max number of `PageItem`s after generated.                                                               |
| `startSize`    | `1`         | The number of `PageItem`s (the `prev` item is excluded) on the start edge (before the first `ignore` item).  |
| `endSize`      | `1`         | The number of `PageItem`s (the `next` item is excluded) on the end edge (after the last `ignore` item).      |
| `hasPrev`      | `"depends"` | Whether to add the `prev` item. `"depends"` adds it only when the previous page exists and `totalPages` > 2. |
| `hasNext`      | `"depends"` | Whether to add the `next` item. `"depends"` adds it only when the next page exists and `totalPages` > 2.     |

`YesNoDepends.Yes`, `YesNoDepends.No`, and `YesNoDepends.Depends` can be used instead of `"yes"`, `"no"`, and `"depends"`.

The builder API is also available.

```typescript
import { Paginator, YesNoDepends } from "pagination-bar-generator";

const paginator = Paginator.builder(5).currentPage(1).hasNext(YesNoDepends.Yes).buildPaginator();
```

### Creating Pagination Bars Which Have 2 Pages for Different Current Pages

```typescript
import { Paginator } from "pagination-bar-generator";

const paginatorIter = Paginator.builder(2).buildPaginatorIter();

for (const paginator of paginatorIter) {
    // paginator.currentPage is 1, and then 2
    const pageItems = paginator.paginate();
}
```

`paginator.iter()` also creates an iterator from the current page through the last page.

### Errors

The constructors and the build methods throw a `PaginatorBuildError` when the options cannot be used to build a paginator. Its `kind` tells the reason.

```typescript
import { Paginator, PaginatorBuildError } from "pagination-bar-generator";

try {
    new Paginator({ totalPages: 0 });
} catch (error) {
    if (error instanceof PaginatorBuildError) {
        console.error(error.kind); // "totalPagesZero"
    } else {
        throw error;
    }
}
```

The kinds are `"currentPageZero"`, `"totalPagesZero"`, `"currentPageTooLarge"`, and `"maxItemCountTooSmall"`. For `"maxItemCountTooSmall"`, `error.minItemCount` is the smallest valid `maxItemCount`.

A number option which is not a non-negative safe integer throws a `RangeError`, and an option with a wrong type throws a `TypeError`.

## Pagination Rules

The `maxItemCount` option limits the count of items on the pagination bar. This library **ignores** page items far away from the current page item to stick to the count limit of items. The first/last n items can be additionally reserved.

Look at the following code for more details.

```typescript
import { Paginator, pageItemsToString } from "pagination-bar-generator";

const p = Paginator.builder(8).maxItemCount(9).startSize(1).endSize(1).buildPaginatorIter();

const bars = Array.from(p, (paginator) => pageItemsToString(paginator.paginate()));

// [
//     "1* 2 3 4 5 6 7 8 >",
//     "< 1 2* 3 4 5 ... 8 >",
//     "< 1 2 3* 4 5 ... 8 >",
//     "< 1 2 3 4* 5 ... 8 >",
//     "< 1 ... 4 5* 6 7 8 >",
//     "< 1 ... 4 5 6* 7 8 >",
//     "< 1 ... 4 5 6 7* 8 >",
//     "< 1 2 3 4 5 6 7 8*",
// ]
```

`maxItemCount` cannot be smaller than `min(startSize + endSize + 3, totalPages)` plus one for each of `hasPrev` and `hasNext` that is not `"no"` (only `"yes"` counts when `totalPages` is 1 or 2).

## Migrating from 0.4.x

- Node.js 24 or later is required.
- A `PageItem` is a plain object with a `type` field instead of a class instance. Use `pageItem.type === "page"` instead of `pageItem.isPage()`, and `pageItemToString(pageItem)` instead of `pageItem.toString()`. The `PageItems` namespace is removed.
- `YesNoDepends` values are the strings `"yes"`, `"no"`, and `"depends"` instead of numbers. `YesNoDepends.Yes` and the others still work.
- `Paginator` and `PaginatorIter` are created by `new Paginator(options)` and `new PaginatorIter(options)` instead of the positional constructors. The builder API is unchanged.
- The `PaginatorBuildErrors` namespace is removed. Use `PaginatorBuildError` and its `kind`. An invalid number or a wrong type throws a `RangeError` or a `TypeError` instead.
- `reservedPrev` is formatted as `(` and `reservedNext` is formatted as `)` by `pageItemsToString`.
- When `totalPages` is 1 or 2, `hasPrev` and `hasNext` set to `"yes"` also count toward the smallest valid `maxItemCount`.
- The browser bundle is no longer transpiled to ES5.

## Usage for Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/ts-paginator/master/demo.html)

## License

[MIT](LICENSE)
