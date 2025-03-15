import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class ItemSearchService  extends EndpointFactory{
    private readonly _Url: string = "/api/Item/items/Search";
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    } 

    getSearchItemEndpoint<T>(name: string, branchId: number):Observable<any[]>{
        let endpointUrl = this._Url;
        let data = {'name': name, 'BranchId': branchId};
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchItemEndpoint(name, branchId)
            );
        });
    }


  
}