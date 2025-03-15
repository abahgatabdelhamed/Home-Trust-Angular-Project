export class Account{
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public isDefault?: boolean,
        public accountTypeID?: number,
        public accountCategoryID?: number,
        public personID?: number,
        public initialBalance?: number
    ){}
}