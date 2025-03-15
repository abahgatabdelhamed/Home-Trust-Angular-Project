// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { ConfigurationService } from '../../../services/configuration.service';


@Injectable()
export class BillTypeEndpoint extends EndpointFactory {

    private readonly _billtypeUrl: string = "/api/billtype/billtypes";

    get billtypeUrl() { return this.configurations.baseUrl + this._billtypeUrl; }
    

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }


    getBillTypesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.billtypeUrl}/${page}/${pageSize}` : this.billtypeUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getBillTypesEndpoint(page, pageSize));
            });
    }


    getNewBillTypeEndpoint<T>(billtypeObject: any): Observable<T> {
        console.log(JSON.stringify(billtypeObject));
        return this.http.post<T>(this.billtypeUrl, JSON.stringify(billtypeObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewBillTypeEndpoint(billtypeObject));
            });
    }

    getUpdateBillTypeEndpoint<T>(billtypeObject: any, billtypeId?: number): Observable<T> {
        let endpointUrl = billtypeId ? `${this.billtypeUrl}/${billtypeId}` : this.billtypeUrl;
        console.log(JSON.stringify(billtypeObject));
        return this.http.put<T>(endpointUrl, JSON.stringify(billtypeObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateBillTypeEndpoint(billtypeObject, billtypeId));
            });
    }

   
    getDeleteBillTypeEndpoint<T>(billtypeId: number): Observable<T> {
        let endpointUrl = `${this.billtypeUrl}/${billtypeId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteBillTypeEndpoint(billtypeId));
            });
    }





    
}
