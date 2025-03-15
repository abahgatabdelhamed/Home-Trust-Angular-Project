export class Accounting {
    public id?: number;
    public index: number;
    public name: string;
    public code: string;
    public personId: number;
    public personName: string;
    public accountCategoryName: string;
    public accountCategoryId: number;
    public InitialBalance: number;
    public initialBalance?: number;
    public accountTypeName: string;
    public defaultDisplay: string;
    public accountTypeId: number;
    public isDefault: boolean;
}

export interface AccountingInterface {
    id?: number;
    index: number;
    name: string;
    code: string;
    personId: number;
    personName: string;
    accountTypeName: string;
    accountTypeId: number;
    defaultDisplay: string;

    accountCategoryName: string;
    accountCategoryId: number;
    InitialBalance: number;
    isDefault: boolean;
}
