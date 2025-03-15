export class ItemUnitBranch {
    constructor() {}
    public itemUnitId: number;
    public itemName?: string;
    public itemUnitName?: string;
    public branchId: number;
    public initialQuantity: number;
    public expireDate: Date;
    public itemId?: number;
    public id?:number;
    public costCenterId?:number;
}

export interface ItemUnitBranchInterface {
    itemName?: string,
    itemUnitName?: string,
    itemUnitId: number;
    branchId: number;
    initialQuantity: number;
    itemId?: number;
    expireDate: string;
    costCenterId?:number;
}
