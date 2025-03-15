export class SBill {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(
        public id?: number,
        public receiptCode?: string,
        public userCreaterName?:any,
        public code?: string,
        public accountId?: number,
        public accountName?: string,
        public accountTypeId?: number,
        public accountTypeName?: string,
        public serialNo?: number,
        public notes?: string,
        public exchangeReason?: string,
        public branchId?: number,
        public costCenterId?:number,
        public branchName?: string,
        public date?: Date,
        public totalBeforeDiscount?: number,
        public discount?: number,
        public totalAfterDiscount?: number,
        public personId?: number,
        public personName?: string,
        public staffId?:number,
        public fromAccountId?:number,
        public toAccountId?:number,
        public staffName?: string,
        public personVatNumber?: string,
        public personMobile?:string,
        public billAddress?: string,
        public personCode?: string,
        public billItems?: any[],
        public billServices?: any[],
        public isDept?: boolean,
        public accountType?: string,
        public membershipId?: number,
        public paymentMethods?: {
            accountTypeId?: number,
            accountId?: number,
            amount?: number,
            name?:string
      
          }[],
        public StandardVatTaxableAmount?:number,
        public NotSubjectToVatTaxableAmount?:number,
        public isOldBillTemplate?:boolean,
        public totalVat?:number
    ) {
        if (discount) {
            this.discount = discount;
        } else {
            this.discount = 0;
        }
        totalBeforeDiscount
            ? (this.totalBeforeDiscount = totalBeforeDiscount)
            : 0;
        totalAfterDiscount ? (this.totalAfterDiscount = totalAfterDiscount) : 0;



    }
}
