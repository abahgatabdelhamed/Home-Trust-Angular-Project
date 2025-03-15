import { BillItemPost } from "./bill-item-post.model";
import {BillServicePost} from "./bill-service-post.model"

export class BillPost {
    public Id: number;
    public ReceiptCode: string;
    public Code: string;
    public AccountTypeId: number;
    public AccountId: number;
    public BranchId: number;
    public Date: Date;
    public Notes?: string;
    public StaffId: number;
    public TotalBeforeDiscount: number;
    public TotalAfterDiscount: number;
    public Discount: number;
    public BillItems: BillItemPost[];
    public BillServices: BillServicePost[];
    public PersonId : number;
    public isPending : boolean;
    public isDept : boolean;
    public BillTypeCode: string;
    public notes?: string;
    public totalPriceAfterVat?:number

    constructor() {}
}
