import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthlyGoal, MonthlyGoalInterface, MonthlyGoalsByBranch } from '../../components/Interface/MonthlyGoalInterface';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class MonthlyGoalServiceService {
  private apiUrl1 = '/api/monthly-goals'; // Adjust the URL if needed
private MonthlyGoal:MonthlyGoalInterface
private MonthlyGoalByBranch:MonthlyGoalsByBranch
constructor(private http: HttpClient) { }



//Post 
postMonthlyGoal(model: MonthlyGoalInterface) {
    return this.http.post(`${environment.baseUrl2}${this.apiUrl1}`, model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*'
      })
    });
  }


GetAllByBranch(BranchID: number, FromDate: string, ToDate: string): Observable<MonthlyGoal[]> {
  return this.http.get<MonthlyGoal[]>(
    `${environment.baseUrl2}${this.apiUrl1}?BranchId=${BranchID}&FromDate=${FromDate}&ToDate=${ToDate}`
  );
}

updateGoal(id: number, goal: any): Observable<any> {
  const updateUrl = `${environment.baseUrl2}${this.apiUrl1}/${id}`;
  return this.http.put(updateUrl, goal);
}


deleteGoal(goalId: number) {
  const url = `${environment.baseUrl2}${this.apiUrl1}/${goalId}`;
  return this.http.delete(url);
}
}
