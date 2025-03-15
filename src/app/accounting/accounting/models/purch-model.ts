export class PurchVatReport {
    public type: string;
    public bills: PurchBill[ ];
    public total: number;
    public vat: number;
    public totalAfterVat: number
}


export class PurchBill {
    public id?: number;
    public index?: number;
    public vatNumber: number;
    public receiptCode: string;
    public vatCategory: string;
    public salesNature: string;
    public code: string;
    public supplierName: string;
    public date: Date;
    public accountNumber: number;
    public account?: string;
    public priceBeforeVat: number;
    public priceAfterVat: number;
    public vat: number;
}
