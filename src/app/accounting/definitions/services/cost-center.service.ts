import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigurationService } from "../../../services/configuration.service";
import { CostCenterModel } from "../../shared/models/cost-center.model";
import { Observable } from 'rxjs/Observable';
import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { ExpensesTemplateModel } from '../../shared/models/expenses-template-model';


@Injectable()
export class CostCenterService extends EndpointFactory {
  private _addUrl: string = "/api/CostCenter/AddCostCenter";
  private _editUrl: string = "/api/CostCenter/EditCostCenter";
  private _deleteUrl: string = "/api/CostCenter/DeleteCostCenter"
  private _allUrl: string = "/api/CostCenter/GetCostsCentersForBranch";
  private _closeUrl: string = "/api/CostCenter/CloseCostCenter";
  private _getByIdUrl: string = "/api/CostCenter/GetCostCenter";
  private _getUsedCCExpensesLabelesUrl = "/api/ExpensesBill/GetUsedCCExpensesLabeles"
  

  private get addUrl(): string {
    return this.configurations.baseUrl + this._addUrl;
  }

  private get editUrl(): string {
    return this.configurations.baseUrl + this._editUrl;
  }

  private get deleteUrl(): string {
    return this.configurations.baseUrl + this._deleteUrl;
  }

  private get allUrl(): string {
    return this.configurations.baseUrl + this._allUrl;
  }

  private get closeUrl(): string {
    return this.configurations.baseUrl + this._closeUrl;
  }

  private get getByIdUrl(): string {
    return this.configurations.baseUrl + this._getByIdUrl;
  }

  private get getUsedCCExpensesLabelesUrl(): string{
    return this.configurations.baseUrl + this._getUsedCCExpensesLabelesUrl;
  }

  constructor(http: HttpClient, configurations: ConfigurationService,
    injector: Injector) {
    super(http, configurations, injector)
  }

  public getAllByBranch(branchId): Observable<CostCenterModel[]> {
    let params = new HttpParams();
    params = params.append('branchId', branchId);
    return this.http.get<CostCenterModel[]>(this.allUrl, {params}).catch(error => {
      return this.handleError(error, () => this.getAllByBranch(branchId));
    });
  }

  addItem(modelToAdd: CostCenterModel): Observable<CostCenterModel> {
    return this.http.post<CostCenterModel>(this.addUrl, modelToAdd).catch(error => {
      return this.handleError(error, () => this.addItem(modelToAdd));
    });
  }

  editItem(modelToEdit: CostCenterModel): Observable<CostCenterModel> {
    return this.http.put<CostCenterModel>(this.editUrl, modelToEdit).catch(error => {
      return this.handleError(error, () => this.editItem(modelToEdit));
    });
  }

  deleteItem(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(this.deleteUrl, { params }).catch(error => {
      return this.handleError(error, () => this.deleteItem(id));
    });
  }

  closeCostCenter(modelToPut): Observable<any>{
    return this.http.put(this.closeUrl, modelToPut).catch(error => {
      return this.handleError(error, () => this.closeCostCenter(modelToPut));
    });;
  }

  getCostCenterById(id): Observable<CostCenterModel>{
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<CostCenterModel>(this.getByIdUrl, { params }).catch(error => {
      return this.handleError(error, () => this.getCostCenterById(id));
    });
  }

  getUsedCCExpensesLabeles(id): Observable<ExpensesTemplateModel[]>{
    let params = new HttpParams();
    params = params.append('costCenterId', id);
    return this.http.get<ExpensesTemplateModel[]>(this.getUsedCCExpensesLabelesUrl, { params }).catch(error => {
      return this.handleError(error, () => this.getUsedCCExpensesLabeles(id));
    });
  }



  checkCostCenterEnabled():boolean{
    return true;
  }

}
