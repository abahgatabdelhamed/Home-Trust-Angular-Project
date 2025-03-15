import { Branch } from "./../accounting/definitions/models/branch.model";
export class ExchangeVar {
    public id: number;
    public quantity: number;
    public code: string;
    public fromBranch?: Branch;
    public fromBranchId?: number;
    public fromCostCenter?:any
    public branch?:any
    public branchId?:number
    public item?:any
    public itemId?:number
    public itemUnitId?:number
    public itemUnit?:any
    public costCenterId?:number
    public toBranchId?: number;
    public personDebt?: number;
    public toBranch?: Branch;
    public notes: string;
    public date: Date;
}

export interface ExchangeVarInterface {
    itemUnitId?:any
    id: number;
     branch?:any
    quantity: number;
    code: string;
    fromBranch?: Branch;
    toBranch?: Branch;
    personDebt?: number;
    notes: string;
    date: Date;
    fromBranchId?: number;
    toBranchId?: number;
    itemUnits?: any[];
    costCenterId?:number
    itemId?:number
    branchId?:number
    fromCostCenter?:any
    item?:any
    itemUnit?:any
}
