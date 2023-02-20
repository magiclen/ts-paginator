pagination-bar-generator
==========

[![CI](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml)

This library is used for generating pagination bar.

## Usage

```typescript
import { Paginator, PageItems } from "pagination-bar-generator";

const paginator = Paginator.builder(5).currentPage(1).buildPaginator();

let html = "";

for (const pageItem of paginator.paginate()) {
    if (pageItem instanceof PageItems.Prev) {
        html += `<li><a href="/page/${pageItem.pageNumber}">&laquo;</a></li>`;
    } else if (pageItem instanceof PageItems.Page) {
        html += `<li><a href="/page/${pageItem.pageNumber}">${pageItem.pageNumber}</a></li>`;
    } else if (pageItem instanceof PageItems.CurrentPage) {
        html += `<li>${pageItem.pageNumber}</li>`;
    } else if (pageItem instanceof PageItems.Ignore) {
        html += `<li>...</li>`;
    } else if (pageItem instanceof PageItems.Next) {
        html += `<li><a href="/page/${pageItem.pageNumber}">&raquo;</a></li>`;
    } else {
        // `PageItem.ReservedPrev` or `PageItem.ReservedNext` variant is used only when the `hasPrev` option or the `hasNext` option is set to `YesNoDepends.Yes`.
    }
}
```

## Usage For Browsers

[Source](demo.html)

[Demo Page](https://htmlpreview.github.io/?https://github.com/magiclen/ts-paginator/blob/master/demo.html)

## License

[MIT](LICENSE)