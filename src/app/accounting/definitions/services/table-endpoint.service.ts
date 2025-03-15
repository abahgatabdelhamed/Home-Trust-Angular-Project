import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Branch, BranchInterface } from "../models/branch.model";
import { Table, TableInterface } from "../models/table.model";

@Injectable()
export class TableEndpoint extends EndpointFactory {
    private readonly _Url: string = "/api/Table/GetTables";
    private readonly _gettableUrl:string ="/api/Table/POS/GetTable"
    private readonly _addUrl:string="/api/Table/POS/AddTable"
    private readonly _editUrl:string="/api/Table/POS/EditTable"
    private readonly _deleteUrl:string="/api/Table/POS/DeleteTable"
    get TablesUrl() {
        return this.configurations.baseUrl + this._Url;
    }
    get getTableUrl() {
        return this.configurations.baseUrl + this._gettableUrl;
    }
    get addTableUrl() {
        return this.configurations.baseUrl + this._addUrl;
    }
    get editTableUrl() {
        return this.configurations.baseUrl + this._editUrl;
    }
    get deleteTableUrl() {
        return this.configurations.baseUrl + this._deleteUrl;
    }


    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getTablesEndpoint(branchId) {
        let url:string=''
        if(branchId)
        url=`${this.TablesUrl}?branchId=${branchId}`
        else
        url=`${this.TablesUrl}`
        return this.http.get(url).catch(error => {
            return this.handleError(error, () => this.getTablesEndpoint(branchId));
        });
    }

    gettableEndpoint(id: number) {
        return this.http.get<Table>(`${this.getTableUrl}?id=${id}`).catch(error => {
            return this.handleError(error, () =>
                this.gettableEndpoint(id)
            );
        });
    }

    deleteTableEndpoint(id: number) {
        return this.http
            .delete<Table>(`${this.deleteTableUrl}?id=${id}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.deleteTableEndpoint(id)
                );
            });
    }

    addTableEndpoint(t: Table) {
        return this.http.post<Table>(this.addTableUrl, t).catch(error => {
            return this.handleError(error, () =>
                this.addTableEndpoint(t)
            );
        });
    }

    editTableEndpoint( t:Table) {
        return this.http
            .put<TableInterface>(`${this.editTableUrl}`, t)
            .catch(error => {
                return this.handleError(error, () =>
                    this.editTableEndpoint( t)
                );
            });
    }

    getDefaultBranchEndpoint(){
        return this.http.get<Branch>(`${this.TablesUrl}/DefaultBranch`)
    }

    getItemsUnitsBranch(branchId, costCenterId= null, query='',pageSize=20, pageNumber =1){
        let params = new HttpParams()
        .set('query', query)
        .set('costCenterId', costCenterId)
        .set('pageSize', ""+pageSize)
        .set('pageNumber', ""+pageNumber);
        return this.http.get(this.configurations.baseUrl + `/api/Branch/GetItemsUnitsBranch/${branchId}`, {params: params})
    }

    addItemUnitBranch(objectToPost){
        return this.http.post(this.configurations.baseUrl + `/api/Branch/branches/AddItemUnitBranch`, objectToPost)
    }

    saveItemUnitBranch(objectToSave){
        return this.http.put(this.configurations.baseUrl + `/api/Branch/branches/EditItemUnitBranch/${objectToSave['id']}`, objectToSave)
    }
}
