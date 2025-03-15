import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Branch, BranchInterface } from "../models/branch.model";

@Injectable()
export class BranchEndpoint extends EndpointFactory {
    private readonly _branchUrl: string = "/api/branch/branches";
    private readonly _storageUrl:string ="/api/Report/WarehouseInventory"
    get branchUrl() {
        return this.configurations.baseUrl + this._branchUrl;
    }
    get storageUrl() {
        return this.configurations.baseUrl + this._storageUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getBranchesEndpoint() {
        return this.http.get<Branch>(this.branchUrl).catch(error => {
            return this.handleError(error, () => this.getBranchesEndpoint());
        });
    }
    getWarehouseInventoryEndpoint(b,c){
        return this.http.post<any>(this.storageUrl+"?BranchId="+b+"&CostCenterId="+c,{}).catch(error => {
            return this.handleError(error, () => this.getWarehouseInventoryEndpoint(b,c));
        });
    }
    getCurrentBranchEndpoint(id: number) {
        return this.http.get<Branch>(`${this.branchUrl}/${id}`).catch(error => {
            return this.handleError(error, () =>
                this.getCurrentBranchEndpoint(id)
            );
        });
    }

    deleteBranchEndpoint(id: number) {
        return this.http
            .delete<Branch>(`${this.branchUrl}/${id}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.deleteBranchEndpoint(id)
                );
            });
    }

    addBranchEndpoint(branch: BranchInterface) {
        return this.http.post<Branch>(this.branchUrl, branch).catch(error => {
            return this.handleError(error, () =>
                this.addBranchEndpoint(branch)
            );
        });
    }

    editBranchEndpoint(branch: BranchInterface, id: number) {
        return this.http
            .put<Branch>(`${this.branchUrl}`, branch)
            .catch(error => {
                return this.handleError(error, () =>
                    this.editBranchEndpoint(branch, id)
                );
            });
    }

    getDefaultBranchEndpoint(){
        return this.http.get<Branch>(`${this.branchUrl}/DefaultBranch`)
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
