export class SaleVatReport {
type: string;
bills: SaleBill[];
total: number;
vat: number;
totalAfterVat: number
}

export class SaleBill {
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
