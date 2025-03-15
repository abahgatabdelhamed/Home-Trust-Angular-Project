export class BillItemPost{
    public Id : number;
    public ItemUnitId : number;
    public Price : number;
    public ActualVat : number;
    public actualVatTwo : number;
    public discount : number;
    public serialNo?: number;
    public Quantity: number;
    public Notes?: string;
    public totalPrice?: number;
    public RefundBillItemId?: number;
    public itemUnitBranchId?:number;

    constructor(){
    }
}
