export class Expenses{
    constructor(
    public index?:number,
    public  id ?:number,
    public receiptCode ?:string,
    public date ?: Date,
    public notes ?: string,
    public personId ?: number,
        public person?: any,
        public account?: any,
        public personName?:any,
        public accountType?: any,
    public branch?: any,
    public accountId ?: number,
    public accountTypeId ?: number,
    public branchId ?: number,
    public amount ?: number,
    public vat ?: number,
    public staffId?: number,
    public staffName?: string,
        public vatTypeId?: number,
    public finalAmount?: number,
    public costCenterId?: number,
    public costCenter? :{id : number, nameAr: string, nameEn: string},
    public expensessTreeId?: number,
    public expensessTree?: {id : number, nameAr: string, nameEn: string},
    public branchName?:string,
    public costCenterName?:string,
    public expensessTreeName?:string
    ){

    }

}


