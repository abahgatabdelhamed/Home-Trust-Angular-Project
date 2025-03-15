export class SaleBillSummary {
    public sCash: number;
    public sNetwork: number;
    public sBank: number;
    public sVat: number;
    public sDept: number;
    public stotal?: number;
    public stotalWithVat?: number;

    public rDept: number;
    public rCash: number;
    public rNetwork: number;
    public rBank: number;
    public rVat: number;
    public rtotal?: number;
    public rtotalWithVat?: number;
    public sWithoutVAt?:number
    public rsWithoutVAt?:number
    public sWithVAt?:number
    public rsWithVAt?:number
    public sTobaccoVat?:any
    public rTobaccoVat?:any
    public sDeliveryApps?:any
    public rDeliveryApps?:any
    public isThereDeliveryAppsValues?:boolean
}


export class RefundBillSummary {
    public rDebt: number;
    public rcash: number;
    public rnetwork: number;
    public rbank: number;
    public rvat: number;
    public rtotal?: number;
    public rtotalWithVat?: number;
}


export class SaleBillNet {
    public ncash: number;
    public nnetwork: number;
    public nbank: number;
    public nvat: number;
    public ndebt: number;
    public ntotal?: number;
    public ntotalWithVat?: number;
    public ntobaccovat?:number;
    
}
