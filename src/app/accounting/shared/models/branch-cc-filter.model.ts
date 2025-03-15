
export interface FilterData{
    selectedBillType: string;
    selectedBranch:number,
    selectedCC:number,
    selectedExpensesId: number
    serachModel ?:  {
      from: Date;
      to: Date;
  }
  fromTime?:any;
  toTime?:any
  userSelected?:any
  branchName?:any
  costCenterName?:any
  }