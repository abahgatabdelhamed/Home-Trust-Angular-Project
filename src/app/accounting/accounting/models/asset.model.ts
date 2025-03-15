export class Asset {
    public nameAr: string;
    public nameEn: string;
    public value:number;
    public depreciationPerc: number;
    public depreciationInterval: number;
    public depreciationAccountId: number;
    public increaseAccountId: number;
    public depreciationStartDate: string;
    public currentValue?:number;
    public depreciationLastUpdateDate?:string
   
}