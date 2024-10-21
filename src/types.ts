export enum YesNoDepends {
    Yes,
    No,
    Depends,
}

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
