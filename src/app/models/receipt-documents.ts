import { Account } from "./../accounting/sales/models/receipt-account.model";
export class ReceiptDocument {
    public id: number;
    public code: string;
    public fromAccount?: Account;
    public fromAccountId?: number;
    public toAccountId?: number;
    public personDebt?: number;
    public toAccount?: Account;
    public notes: string;
    public date: Date;
    public amount: number;
    public receiptDocumentTypeCode?: any;
    public dueAmount?:number
}

export interface ReceiptDocumentInterface {
    id: number;
    code: string;
    fromAccount?: Account;
    toAccount?: Account;
    personDebt?: number;
    notes: string;
    date: Date;
    fromAccountId?: number;
    toAccountId?: number;
    amount: number;
    receiptDocumentTypeCode?: any;
    dueAmount?:number
}
