export interface MonthlyGoalInterface {
  branchId: number;
  date: string;
  goal: number;
}



export interface Goal {
  id: number;
  date: string; 
  goal: number;
}

export interface MonthlyGoalsByBranch {
  branchID: number;
  branchName: string;
  goals: Goal[];
}
