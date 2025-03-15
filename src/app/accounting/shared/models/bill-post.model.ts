import { BillItemPost } from "./bill-item-post.model";
import {BillServicePost} from "./bill-service-post.model"

export class BillPost {
    public index?: number;
    public Id: number;
    public receiptCode?:string
    public UserCreaterName?:any;
    public ReceiptCode: string;
    public Code: string;
    public AccountTypeId: number;
    public AccountId: number;
    public branch?: {id:number; name:string};
    public BranchId: number;
    public branchName?: string;
    public costCenter?: {id:number; nameAr:string; nameEn: string};
    public costCenterId?:number;
    public costCenterName?:string;
    public Date: Date;
    public Notes?: string;
    public StaffId: number;
    public serialNo?: number;
    public FromAccountId?: number;
    public ToAccountId?: number;
    public TotalBeforeDiscount: number;
    public TotalAfterDiscount: number;
    public Discount: number;
    public BillItems: BillItemPost[];
    public BillServices: BillServicePost[];
    public PersonId : number;
    public PersonName:string;
    public isPending : boolean;
    public isDept : boolean;
    public BillTypeCode: string;
    public notes?: string;
    public ExchangeReason?: string;
    public isDelivered?:string;
    public totalPriceAfterVat?:number
    public paymentMethods?: {
        accountTypeId?: number,
        accountId?: number,
        amount?: number,
        name?:string
  
      }[
        
      ] 
      public totalVat?:number;
      public StandardVatTaxableAmount?:number;
      public NotSubjectToVatTaxableAmount?:number;
      public IsOldBillTemplate?:boolean
    constructor() {}
}
