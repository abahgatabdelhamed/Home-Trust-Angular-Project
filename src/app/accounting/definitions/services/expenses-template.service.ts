import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigurationService } from "../../../services/configuration.service";
import { ExpensesTemplateModel } from "../../shared/models/expenses-template-model";
import { Observable } from 'rxjs/Observable';
import { EndpointFactory } from '../../../services/endpoint-factory.service';



@Injectable()
export class ExpensesTemplateService extends EndpointFactory {

  private _addUrl: string = "/api/TemplateTree/AddTemplateTree";
  private _editUrl: string = "/api/TemplateTree/EditTemplateTree";
  private _deleteUrl: string = "/api/TemplateTree/DeleteTemplateTree"
  private _allUrl: string = "/api/TemplateTree/GetTemplateTrees";

  private get addUrl(): string {
    return this.configurations.baseUrl + this._addUrl
  }

  private get editUrl(): string {
    return this.configurations.baseUrl + this._editUrl
  }

  private get deleteUrl(): string {
    return this.configurations.baseUrl + this._deleteUrl
  }

  private get allUrl(): string {
    return this.configurations.baseUrl + this._allUrl
  }

  constructor(http: HttpClient, configurations: ConfigurationService,
    injector: Injector) {
    super(http, configurations, injector)
  }

  public getAll(): Observable<ExpensesTemplateModel[]> {
    return this.http.get<ExpensesTemplateModel[]>(this.configurations.baseUrl +'/api/ExpensesTree/GetTemplateTrees').catch(error => {
      return this.handleError(error, () => this.getAll());
    });
  }

  addItem(modelToAdd: ExpensesTemplateModel): Observable<ExpensesTemplateModel> {
    return this.http.post<ExpensesTemplateModel>(this.addUrl, modelToAdd).catch(error => {
      return this.handleError(error, () => this.addItem(modelToAdd));
    });
  }

  editItem(modelToEdit: ExpensesTemplateModel): Observable<ExpensesTemplateModel> {
    return this.http.put<ExpensesTemplateModel>(this.editUrl, modelToEdit).catch(error => {
      return this.handleError(error, () => this.editItem(modelToEdit));
    });
  }

  deleteItem(id): Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id)
    return this.http.delete(this.deleteUrl, { params: params }).catch(error => {
      return this.handleError(error, () => this.deleteItem(id));
    });
  }

}
