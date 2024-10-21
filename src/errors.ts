export abstract class PaginatorBuildError extends Error {
}

export class CurrentPageIncorrect extends PaginatorBuildError {
    constructor() {
        super("CurrentPageIncorrect");
    }
}

export class TotalPagesIncorrect extends PaginatorBuildError {
    constructor() {
        super("TotalPagesIncorrect");
    }
}

export class MaxItemCountIncorrect extends PaginatorBuildError {
    constructor() {
        super("MaxItemCountIncorrect");
    }
}

export class StartSizeIncorrect extends PaginatorBuildError {
    constructor() {
        super("StartSizeIncorrect");
    }
}

export class EndSizeIncorrect extends PaginatorBuildError {
    constructor() {
        super("EndSizeIncorrect");
    }
}

export class CurrentPageTooLarge extends PaginatorBuildError {
    constructor(readonly currentPage: number, readonly totalPages: number) {
        super(
            `CurrentPageTooLarge: currentPage = ${currentPage}, totalPages = ${totalPages}`,
        );
    }
}

export class MaxItemCountTooSmall extends PaginatorBuildError {
    constructor(readonly minItemCount: number) {
        super(`MaxItemCountTooSmall: minItemCount = ${minItemCount}`);
    }
}
