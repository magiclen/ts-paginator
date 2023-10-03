pagination-bar-generator
==========

[![CI](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-paginator/actions/workflows/ci.yml)

This library is used for generating pagination bar.

## Usage

```typescript
import { Paginator } from "pagination-bar-generator";

const paginator = Paginator.builder(5).currentPage(1).buildPaginator();

let html = "";

for (const pageItem of paginator.paginate()) {
    if (pageItem.isPrev()) {
        html += `<li><a href="/page/${pageItem.pageNumber}">&laquo;</a></li>`;
    } else if (pageItem.isPage()) {
        html += `<li><a href="/page/${pageItem.pageNumber}">${pageItem.pageNumber}</a></li>`;
    } else if (pageItem.isCurrentPage()) {
        html += `<li>${pageItem.pageNumber}</li>`;
    } else if (pageItem.isIgnore()) {
        html += `<li>...</li>`;
    } else if (pageItem.isNext()) {
        html += `<li><a href="/page/${pageItem.pageNumber}">&raquo;</a></li>`;
    } else {
        // `PageItem.ReservedPrev` or `PageItem.ReservedNext` variant is used only when the `hasPrev` option or the `hasNext` option is set to `YesNoDepends.Yes`.
    }
}
```

## Usage For Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/ts-paginator/master/demo.html)

## License

[MIT](LICENSE)