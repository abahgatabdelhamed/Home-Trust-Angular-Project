import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MonthlyGoalServiceService } from '../../../services/New_Service/MonthlyGoalService.service';
import { MonthlyGoal, MonthlyGoalInterface, MonthlyGoalsByBranch } from '../../Interface/MonthlyGoalInterface';
import { StaticsServiceService } from '../../../services/New_Service/StaticsService.service';
import { Branch } from '../../../accounting/definitions/models/brach.model';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { Console } from 'console';

@Component({
  selector: 'app-FinancialGoals',
  templateUrl: './FinancialGoals.component.html',
  styleUrls: ['./FinancialGoals.component.css']
})
export class FinancialGoalsComponent implements OnInit {
  SelectedBranchIDForMonthGoal:number = -1
  SelectedBranchID:number = -1
  MonthGoal: number = 0;
  MonthOfGoal: Date;
  MonthGoalModel: MonthlyGoalInterface;
  GoalList :MonthlyGoalsByBranch[]
  branchList:Branch[]
  fromDate: string 
  toDate: string 
monthlyGoals: MonthlyGoal[] = [];
hasError: boolean = false;
errorMessage: string = '';

isEditGoalActive: boolean = false;



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

    this.goalService.GetAllByBranch(-1, this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.monthlyGoals = data;
        this.hasError = false;
  
      },
      error: (err) => {
        this.monthlyGoals = [];
  
        if (err.status === 404) {
          this.errorMessage = 'لا توجد أهداف مالية لهذا الفرع في هذه الفترة.';
        } else {
          this.errorMessage = 'حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.';
        }
  
        this.hasError = true;
        console.error('Error fetching monthly goals:', err);
    }
    });
    


    
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





formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

onBranchChange(event: Event) {
  const selectedBranchId = this.SelectedBranchIDForMonthGoal;

  this.goalService.GetAllByBranch(selectedBranchId, this.fromDate, this.toDate).subscribe({
    next: (data) => {
      this.monthlyGoals = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.hasError = false;
    },
    error: (err) => {
      this.monthlyGoals = [];

      if (err.status === 404) {
        this.errorMessage = 'لا توجد أهداف مالية لهذا الفرع في هذه الفترة.';
      } else {
        this.errorMessage = 'حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.';
      }

      this.hasError = true;
      console.error('Error fetching monthly goals:', err);
  }
  });
}


 isFutureMonth(dateStr: string): boolean {
  const goalDate = new Date(dateStr);
  const today = new Date();

  const goalMonth = goalDate.getMonth();
  const goalYear = goalDate.getFullYear();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Compare by year first, then month
  return goalYear > currentYear || (goalYear === currentYear && goalMonth >= currentMonth);
}


editGoal = {
  id: 0,
  branchId: 0,
  date: '',
  goal: 0 , 
  branchName : ''
};






onUpdate(goal: MonthlyGoal): void {
  
  if (goal.id != 0) {
    this.editGoal = {
      id: goal.id,
      branchId: goal.branchId,
      date: goal.date,
      goal: goal.goal , 
      branchName : goal.branchName 
    };
    console.log(this.editGoal);
    this.isEditGoalActive = true; 
    // Check if the goal is properly set
  } else {
    console.error('No goal selected for update');
  }
}


submitUpdate() {
  // Check if editGoal is not null before proceeding
  if (this.editGoal && this.editGoal.id) {
    console.log('Updating Goal:', this.editGoal);
    this.goalService.updateGoal(this.editGoal.id, this.editGoal).subscribe({
      next: () => {
        window.location.reload();  // Reload the page after successful update
      },
      error: (err) => {
        console.error('Error updating goal:', err);
      },
    });
  } else {
    console.error('No goal data available to update');
  }
}
cancelUpdate() {
  this.isEditGoalActive = false; // Hide the form when canceling
}

// Check if the edit goal form should be shown
ChkEditGoal(): boolean {
  return this.isEditGoalActive;
}

onDelete(goalId: number) {
  if (confirm('هل أنت متأكد أنك تريد حذف هذا الهدف؟')) {
    this.goalService.deleteGoal(goalId).subscribe({
      next: () => {
        // Remove the deleted goal from the array
        this.monthlyGoals = this.monthlyGoals.filter(goal => goal.id !== goalId);
        alert('تم حذف الهدف بنجاح');
      },
      error: (err) => {
        console.error('حدث خطأ أثناء الحذف:', err);
        alert('فشل في حذف الهدف');
      }
    });
  }
}

}
