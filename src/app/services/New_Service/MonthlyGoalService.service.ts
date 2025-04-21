import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthlyGoalInterface, MonthlyGoalsByBranch } from '../../components/Interface/MonthlyGoalInterface';
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
    return this.http.post('https://localhost:7091/api/monthly-goals', model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*'
      })
    });
  }

// Get All Grouped By Branch 

GetAllGroupedByBranch():Observable<MonthlyGoalsByBranch[]>{
  return this.http.get<MonthlyGoalsByBranch[]>("https://localhost:7091/api/monthly-goals/Get-All-Grouped-By-Branches") ;
}

}
