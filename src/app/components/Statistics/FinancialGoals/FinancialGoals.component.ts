import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MonthlyGoalServiceService } from '../../../services/New_Service/MonthlyGoalService.service';
import { MonthlyGoalInterface, MonthlyGoalsByBranch } from '../../Interface/MonthlyGoalInterface';
import { StaticsServiceService } from '../../../services/New_Service/StaticsService.service';
import { Branch } from '../../../accounting/definitions/models/brach.model';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-FinancialGoals',
  templateUrl: './FinancialGoals.component.html',
  styleUrls: ['./FinancialGoals.component.css']
})
export class FinancialGoalsComponent implements OnInit {
  SelectedBranchIDForMonthGoal:number = -1
  MonthGoal: number = 0;
  MonthOfGoal: Date;
  MonthGoalModel: MonthlyGoalInterface;
  GoalList :MonthlyGoalsByBranch[]
  branchList:Branch[]
  fromDate: string 
  toDate: string 

  SelectedBranchName:string
  constructor(private Service :StaticsServiceService,private goalService : MonthlyGoalServiceService , private cdr:ChangeDetectorRef) { }

  ngOnInit() {

    const now = new Date();

    // ✅ First day of the current month
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
    // ✅ Six months later from the first of the current month
    const sixMonthsLater = new Date(firstOfMonth);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  
    this.fromDate = this.formatDate(firstOfMonth);
    this.toDate = this.formatDate(sixMonthsLater);

    this.Service.getBranches().subscribe({
      next: (data) => {
        this.branchList = data;
        console.log(data);
        console.log("data");
        
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
      }
    });


    


    
  this.getAllMonthGoalsByBranch();
  }

// Post the month Goal 
CreateMonthGoal(event:Event){

  event.preventDefault();  // مهم عشان يمنع ال reload
  console.log(this.SelectedBranchIDForMonthGoal)
  console.log(this.MonthOfGoal)
  console.log(this.MonthGoal)
 
  const model: MonthlyGoalInterface = {
    branchId: this.SelectedBranchIDForMonthGoal,
    date: this.MonthOfGoal + '-01'  , // "2025-04" → "2025-04-01"
    goal: Number(this.MonthGoal)
  };
  console.log('البيانات المرسلة:', model);

  this.goalService.postMonthlyGoal(model).subscribe({
    next: (res) => {
      console.log('تم الإرسال بنجاح', res);
      window.location.reload();
    },
    error: (err) => {
      console.error('حدث خطأ أثناء الإرسال', err);
  console.log('Error Response:', err);
  if (err.error) {
    console.log('Error Details:', err.error); // log the error details
  }
     
    }
  });
}


getAllMonthGoalsByBranch(){
  this.goalService.GetAllGroupedByBranch().subscribe({
    next:(res)=>{
      this.GoalList = res ; 
      console.log(this.GoalList);
      
    }
  })
}



formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

}
