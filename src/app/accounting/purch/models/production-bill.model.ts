export class ProductionBill{
    public index?: number;
    public id?: number;
    public receiptCode?:string;
    public notes?:string;
    public date?:Date;
    public branchId?:number;
    public branch?:{id: number, name: string};
    public branchName?:string;
    public costCenterId?:number;
    public costCenter?: {id:number, nameAr:string, nameEn:string};
    public costCenterName?:string;
    public itemsUnits?: ProductionBillItem[];
    public item?: {id:number, nameAr:string, nameEn:string};
    public itemName?:string;
    public itemUnitsQuantity?: {itemUnitName: string, quantity: number};
    public itemUnitName?:string;
    public quantity?:number;
    
    constructor(){}

}

export class ProductionBillItem{
    public itemUnitBranchId: number = null;
    public itemName: string = '';
    public itemUnitName: string = '';
    public quantity: number = null;

    constructor(){}
}