export class AbstractReport {
    public bills: AbstractBill[]
public total: number
public totalAfterVat: number
public type: string
public vat: number
}


export class AbstractBill {
public   accountName: string
public accountNumber: string
public date: Date
public personCode: string
public personName: string
public priceAfterVat: number
public priceBeforeVat: number
public receiptCode: string
public tag: string
public vat: number
public vatNumber: string
public vatType: string
}
