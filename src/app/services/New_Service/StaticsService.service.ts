import { Injectable } from '@angular/core';
import { Branches, IStatisticsModel } from '../../components/Interface/IStatisticsModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class StaticsServiceService {

private IStatisticsModel : IStatisticsModel[]
private BranchesModel : Branches[]
private apiUrl1 = '/Branches'; // Adjust the URL if needed
private apiUrl2 = '/PerformanceMetrics/monthly'; // Adjust the URL if needed

constructor(private http: HttpClient) { }

getBranches(): Observable<Branches[]> {
  return this.http.get<Branches[]>(`${environment.baseUrl2}${this.apiUrl1}`);
}

getBranchStatistcsByID(BranchID : number , FromDate:string , ToDate:string):Observable<IStatisticsModel>{
  return this.http.get<IStatisticsModel>(`${environment.baseUrl2}${this.apiUrl2}?FromDate=${FromDate}&ToDate=${ToDate}&BranchId=${BranchID}`);
}

getAllBranches():Branches[]{
    return this.BranchesModel
}

}
