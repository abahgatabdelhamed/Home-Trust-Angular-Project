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


export interface MonthlyGoal {
  id: number;
  branchId: number;
  branchName: string;
  date: string; // or use Date if you're converting it later
  isCompany: boolean;
  goal: number;
}

