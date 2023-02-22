export abstract class PageItem {
    abstract toString(): string;
}

export abstract class PageItemWithNumber extends PageItem {
    constructor(public readonly pageNumber: number) {
        super();
    }
}

export class Page extends PageItemWithNumber {
    toString(): string {
        return this.pageNumber.toString();
    }
}

export class CurrentPage extends PageItemWithNumber {
    toString(): string {
        return `${this.pageNumber}*`;
    }
}

export class Ignore extends PageItem {
    toString(): string {
        return "...";
    }
}

export class Prev extends PageItemWithNumber {
    toString(): string {
        return "<";
    }
}

export class Next extends PageItemWithNumber {
    toString(): string {
        return ">";
    }
}

export class ReservedPrev extends PageItem {
    toString(): string {
        return ")";
    }
}

export class ReservedNext extends PageItem {
    toString(): string {
        return "(";
    }
}

export const page = (pageNumber: number): Page => {
    return new Page(pageNumber);
};

export const currentPage = (pageNumber: number): CurrentPage => {
    return new CurrentPage(pageNumber);
};

const _ignore = new Ignore();
const _reservedPrev = new ReservedPrev();
const _reservedNext = new ReservedNext();

export const ignore = (): Ignore => {
    return _ignore;
};

export const prev = (pageNumber: number): Prev => {
    return new Prev(pageNumber);
};

export const next = (pageNumber: number): Next => {
    return new Next(pageNumber);
};


export const reservedPrev = (): ReservedPrev => {
    return _reservedPrev;
};


export const reservedNext = (): ReservedNext => {
    return _reservedNext;
};

export const isPage = (pageItem: PageItem): pageItem is Page => {
    return pageItem instanceof Page;
};

export const isCurrentPage = (pageItem: PageItem): pageItem is CurrentPage => {
    return pageItem instanceof CurrentPage;
};

export const isIgnore = (pageItem: PageItem): pageItem is Ignore => {
    return pageItem instanceof Ignore;
};

export const isPrev = (pageItem: PageItem): pageItem is Prev => {
    return pageItem instanceof Prev;
};

export const isNext = (pageItem: PageItem): pageItem is Next => {
    return pageItem instanceof Next;
};

export const isReservedPrev = (pageItem: PageItem): pageItem is ReservedPrev => {
    return pageItem instanceof ReservedPrev;
};

export const isReservedNext = (pageItem: PageItem): pageItem is ReservedNext => {
    return pageItem instanceof ReservedNext;
};
