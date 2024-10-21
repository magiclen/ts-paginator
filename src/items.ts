export abstract class PageItem {
    abstract toString(): string;

    isPage(): this is Page {
        return false;
    }

    isCurrentPage(): this is CurrentPage {
        return false;
    }

    isIgnore(): this is Ignore {
        return false;
    }

    isPrev(): this is Prev {
        return false;
    }

    isNext(): this is Next {
        return false;
    }

    isReservedPrev(): this is ReservedPrev {
        return false;
    }

    isReservedNext(): this is ReservedNext {
        return false;
    }
}

export abstract class PageItemWithNumber extends PageItem {
    constructor(readonly pageNumber: number) {
        super();
    }
}

export class Page extends PageItemWithNumber {
    toString(): string {
        return this.pageNumber.toString();
    }

    isPage(): this is Page {
        return true;
    }
}

export class CurrentPage extends PageItemWithNumber {
    toString(): string {
        return `${this.pageNumber}*`;
    }

    isCurrentPage(): this is CurrentPage {
        return true;
    }
}

export class Ignore extends PageItem {
    toString(): string {
        return "...";
    }

    isIgnore(): this is Ignore {
        return true;
    }
}

export class Prev extends PageItemWithNumber {
    toString(): string {
        return "<";
    }

    isPrev(): this is Prev {
        return true;
    }
}

export class Next extends PageItemWithNumber {
    toString(): string {
        return ">";
    }

    isNext(): this is Next {
        return true;
    }
}

export class ReservedPrev extends PageItem {
    toString(): string {
        return ")";
    }

    isReservedPrev(): this is ReservedPrev {
        return true;
    }
}

export class ReservedNext extends PageItem {
    toString(): string {
        return "(";
    }

    isReservedNext(): this is ReservedNext {
        return true;
    }
}

export const page = (pageNumber: number): Page => new Page(pageNumber);

export const currentPage = (pageNumber: number): CurrentPage => new CurrentPage(pageNumber);

const _ignore = new Ignore();
const _reservedPrev = new ReservedPrev();
const _reservedNext = new ReservedNext();

export const ignore = (): Ignore => _ignore;

export const prev = (pageNumber: number): Prev => new Prev(pageNumber);

export const next = (pageNumber: number): Next => new Next(pageNumber);

export const reservedPrev = (): ReservedPrev => _reservedPrev;

export const reservedNext = (): ReservedNext => _reservedNext;
