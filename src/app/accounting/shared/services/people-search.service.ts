import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class PeopleSearchService  extends EndpointFactory{
    private readonly _Url: string = "/api/person/people/Search";
    get PersonUrl(){
        return this.configurations.baseUrl+this._Url
    }
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getSearchPeopleEndpoint<T>(name: string):Observable<any[]>{
        // let endpointUrl = this._Url;
        let endpointUrl = this.PersonUrl
        let data = {'name': name };
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchPeopleEndpoint(name)
            );
        });
    }



}
