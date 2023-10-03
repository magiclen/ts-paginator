export abstract class PageItem {
    abstract toString(): string;

    public isPage(): this is Page {
        return false;
    }

    public isCurrentPage(): this is CurrentPage {
        return false;
    }

    public isIgnore(): this is Ignore {
        return false;
    }

    public isPrev(): this is Prev {
        return false;
    }

    public isNext(): this is Next {
        return false;
    }

    public isReservedPrev(): this is ReservedPrev {
        return false;
    }

    public isReservedNext(): this is ReservedNext {
        return false;
    }
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

    public isPage(): this is Page {
        return true;
    }
}

export class CurrentPage extends PageItemWithNumber {
    toString(): string {
        return `${this.pageNumber}*`;
    }
    
    public isCurrentPage(): this is CurrentPage {
        return true;
    }
}

export class Ignore extends PageItem {
    toString(): string {
        return "...";
    }

    public isIgnore(): this is Ignore {
        return true;
    }
}

export class Prev extends PageItemWithNumber {
    toString(): string {
        return "<";
    }

    public isPrev(): this is Prev {
        return true;
    }
}

export class Next extends PageItemWithNumber {
    toString(): string {
        return ">";
    }

    public isNext(): this is Next {
        return true;
    }
}

export class ReservedPrev extends PageItem {
    toString(): string {
        return ")";
    }

    public isReservedPrev(): this is ReservedPrev {
        return true;
    }
}

export class ReservedNext extends PageItem {
    toString(): string {
        return "(";
    }

    public isReservedNext(): this is ReservedNext {
        return true;
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
