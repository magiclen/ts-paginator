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
