export class PBill {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(public id?: number,
        public receiptCode?: string,
        public accountId?: number,
        public accountName?: string,
        public accountTypeId?: number,
        public accountTypeName?: string,
        public branchId?: number,
        public branchName? : string,
        public billDate?: Date,
        public totalBeforeDiscount?: number,
        public discount?: number,
        public totalAfterDiscount?: number,
        public notes?: string,
        public billItems? : any[]) {

            if(discount)
            {
                this.discount = discount
            }
            else{
                this.discount = 0;
            }
            totalBeforeDiscount?this.totalBeforeDiscount = totalBeforeDiscount : 0;
            totalAfterDiscount?this.totalAfterDiscount = totalAfterDiscount : 0;
    }



   
}
