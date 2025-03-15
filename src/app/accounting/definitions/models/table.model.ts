import { ItemUnit } from "./item-unit.model";
import { ItemUnitBranch } from "./item-unit-branch";
export class Table {
    constructor() {}
    public id?: number;
    public nameAr: string;
    public nameEn: string;
    public status: number;
    public capacity: number;
   public branchId:number
}

export interface TableInterface {
     id: number;
     nameAr: string;
     nameEn: string;
     status: number;
     capacity: number;
     branchId:number
}
