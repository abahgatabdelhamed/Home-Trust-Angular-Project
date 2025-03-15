import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class ItemSearchService  extends EndpointFactory{
    private readonly _Url: string =this.configurations.baseUrl+"/api/Item/items/Search";
    private readonly _UrlSearch: string =this.configurations.baseUrl+"/api/Item/SearchItems";
    private readonly _UrlExchange: string = this.configurations.baseUrl+"/api/Item/items/SearchExchange";
    private readonly _UrlGetSearchById : string =this.configurations.baseUrl+ "/api/Item/GetItemSearchById"


getUrlSearchItem(){
    return this.configurations.baseUrl+ this._Url
}
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getSearchItemEndpoint<T>(name: any, branchId: number, costCenterId:number=null,type?):Observable<any[]>{
        let endpointUrl =''
        if(type){
          type!='exchange'? endpointUrl=this._Url:endpointUrl=this._UrlExchange;
        }else
        endpointUrl=this._Url
        let data = {'name': name, 'BranchId': branchId, 'costCenterId':costCenterId};
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchItemEndpoint(name, branchId, costCenterId)
            );
        });
    }
    getSearchItemNameEndpoint<T>(name: any,type?):Observable<any[]>{
        let endpointUrl =''
        if(type){
          type!='exchange'? endpointUrl=this._UrlSearch:endpointUrl=this._UrlExchange;
        }else
        endpointUrl=this._UrlSearch
        let data = {'query': name};
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchItemNameEndpoint(name)
            );
        });
    }

    getSearchItemByIdEndPoint(id:any, branchId, costCenterId:number):Observable<any>{
        let data = {'id': id, 'BranchId': branchId, 'costCenterId':costCenterId};
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http.get(this._UrlGetSearchById, headers).catch(error => {
            return this.handleError(error, () =>
                this.getSearchItemEndpoint(id, branchId, costCenterId)
            );
        });
    }

    getSearchItemEndpointExchange<T>(name: string, branchId: number, costCenterId:number): Observable<any[]> {
        console.log('i am here')
        let endpointUrl = this._UrlExchange;
        let data = { 'name': name, 'BranchId': branchId, 'costCenterId': costCenterId };
        let headers = this.getRequestHeaders()
        headers['params'] = data
        return this.http
            .get<T>(endpointUrl, headers)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getSearchItemEndpoint(name, branchId, costCenterId)
                );
            });
    }



}
