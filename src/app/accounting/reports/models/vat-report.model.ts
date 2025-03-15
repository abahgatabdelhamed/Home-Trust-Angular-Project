export class VatReport {
    public id?: number;
    public index?: number;
    public report: string;
    public priceBeforeVat: number;
    public vat: number;
}

export class VatReportPurch {
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

export class VatReportReceipt {
    public id?: number;
    public index?: number;
    public store: string;
    public receiptNumber: number;
    public vatCategory: string;
    public name: string;
    public code: string;
    public date: Date;
    public priceBeforeVat: number;
    public priceAfterVat: number;
    public vat: number;
}
export class VatReportBills {
    public id?: number;
    public index?: number;
    public customerName: string;
    public receiptNumber: number;
    public salesNature: string;
    public encoding: string;
    public vatNumber: string;
    public salesPrice: number;
    public num: number;
    public date: Date;
    public vatCategory: string;
    public priceAfterVat: number;
    public vat: number;
}
