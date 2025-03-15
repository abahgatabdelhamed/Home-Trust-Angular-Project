import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class ServiceSearchService  extends EndpointFactory{
    private readonly _searchUrl: string = "/api/ServiceType/serviceTypes/Search"; //change 
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    } 

    getSearchServiceEndpoint<T>(name: string):Observable<any[]>{
        let endpointUrl = this._searchUrl;
        let data = {'name': name, 'BranchId': 1}; 
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchServiceEndpoint(name)
            );
        });
    }


  
}