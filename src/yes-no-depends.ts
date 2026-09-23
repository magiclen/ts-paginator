/** A setting that can be enabled, disabled, or decided from the page state. */
export const YesNoDepends = {
    /**
     * Always enable the item, using the `reservedPrev` or `reservedNext` item when there is no
     * target page.
     */
    Yes: "yes",
    /** Always disable the item. */
    No: "no",
    /** Enable the item only when the target page exists and `totalPages` is greater than 2. */
    Depends: "depends",
} as const;

/** A setting that can be enabled, disabled, or decided from the page state. */
export type YesNoDepends = (typeof YesNoDepends)[keyof typeof YesNoDepends];

/**
 * Convert a string to `YesNoDepends`, ignoring case. A string other than `yes` and `no` becomes
 * `depends`.
 */
export const stringToYesNoDepends = (s: string): YesNoDepends => {
    switch (s.toLowerCase()) {
        case "yes":
            return YesNoDepends.Yes;
        case "no":
            return YesNoDepends.No;
        default:
            return YesNoDepends.Depends;
    }
};
