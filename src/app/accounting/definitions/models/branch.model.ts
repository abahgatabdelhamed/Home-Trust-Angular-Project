import { ItemUnit } from "./item-unit.model";
import { ItemUnitBranch } from "./item-unit-branch";
export class Branch {
    constructor() {}
    public id: number;
    public branchIndex: number;
    public name: string;
    public nameEn: string;
    public phone: string;
    public notes?: string;
    public isDefault: boolean;
}

export interface BranchInterface {
    branchIndex?: number;
    id: number;
    name: string;
    phone: string;
    nameEn: string;
    notes?: string;
    isDefault: boolean;
    itemUnitBranches: ItemUnitBranch[];
    expensesBills: any[];
}
