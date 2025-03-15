import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigurationService } from "../../../services/configuration.service";
import { ExpensesTreeModel, ExpensesTreeItemModel } from "../../shared/models/expenses-tree";
import { Observable } from 'rxjs/Observable';
import { EndpointFactory } from '../../../services/endpoint-factory.service';



@Injectable()
export class ExpensesTreeService extends EndpointFactory {

  private _addUrl: string = "/api/ExpensesTree/AddTreeNode";
  private _editUrl: string = "/api/ExpensesTree/EditTreeNode";
  private _deleteUrl: string = "/api/ExpensesTree/DeleteTreeNode"
  private _allUrl: string = "/api/ExpensesTree/TreeOfExpensesNodes";

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

  public getTree(headId:number): Observable<{data :ExpensesTreeModel[]}> {
    let params = new HttpParams();
    params = params.append('headId', ''+headId)
    return this.http.get<{data :ExpensesTreeModel[]}>(this.allUrl, {"params" : params}).catch(error => {
      return this.handleError(error, () => this.getTree(headId));
    });
  }

  addItem(modelToAdd: ExpensesTreeItemModel): Observable<ExpensesTreeItemModel> {
    return this.http.post<ExpensesTreeItemModel>(this.addUrl, modelToAdd).catch(error => {
      return this.handleError(error, () => this.addItem(modelToAdd));
    });
  }

  editItem(modelToEdit: ExpensesTreeItemModel): Observable<ExpensesTreeItemModel> {
    return this.http.put<ExpensesTreeItemModel>(this.editUrl, modelToEdit).catch(error => {
      return this.handleError(error, () => this.editItem(modelToEdit));
    });
  }

  deleteItem(id): Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id)
    return this.http.delete(this.deleteUrl,{ params: params }).catch(error => {
      return this.handleError(error, () => this.deleteItem(id));
    });
  }

}
