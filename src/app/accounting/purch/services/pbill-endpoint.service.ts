import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class PBillEndpoint extends EndpointFactory {
    private readonly _pbillGetUrl: string = "/api/Bill/pbills";
    private readonly _pbillInitialData: string = "/api/Bill/init";
    private readonly _pbillPostUrl: string = "/api/Bill/bills";
    private readonly _pbillPutUrl: string = "/api/Bill/bills";
    private readonly _pbillDeleteUrl: string = "/api/Bill/bills";


    get pbillUrl() {
        return this.configurations.baseUrl + this._pbillGetUrl;
    }

    getPBillInitUrl() {
        return this.configurations.baseUrl + this._pbillInitialData;
    }

    getPBillPostUrl() {
        return this.configurations.baseUrl + this._pbillPostUrl;
    }

    getPBillPutUrl() {
        return this.configurations.baseUrl + this._pbillPutUrl;
    }
    getPBillDeleteUrl() {
        return this.configurations.baseUrl + this._pbillDeleteUrl;
    }
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getPBillInitEndpoint<T>() {
        let endpointUrl = this.getPBillInitUrl();
        let data = {'BillTypeCode': 'PURCH'};
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
            .get<T>(endpointUrl, headers)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getPBillInitEndpoint()
                );
            });
    }

    getPBillsEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl =
            page && pageSize
                ? `${this.pbillUrl}/${page}/${pageSize}`
                : this.pbillUrl;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getPBillsEndpoint(page, pageSize)
                );
            });
    }

    getNewPBillEndpoint<T>(pbillObject: any): Observable<T> {
        console.log(JSON.stringify(pbillObject));
        return this.http
            .post<T>(
                this.getPBillPostUrl(),
                JSON.stringify(pbillObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewPBillEndpoint(pbillObject)
                );
            });
    }

    getUpdatePBillEndpoint<T>(
        pbillObject: any,
        pbillId?: number
    ): Observable<T> {
        let endpointUrl = pbillId
            ? `${this.getPBillPutUrl()}/${pbillId}`
            : this.getPBillPutUrl();
            console.error(endpointUrl)
        console.log(JSON.stringify(pbillObject));
        return this.http
            .put<T>(
                endpointUrl,
                JSON.stringify(pbillObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdatePBillEndpoint(pbillObject, pbillId)
                );
            });
    }

    getDeletePBillEndpoint<T>(pbillId: number): Observable<T> {
        let endpointUrl = `${this.getPBillDeleteUrl()}/${pbillId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeletePBillEndpoint(pbillId)
                );
            });
    }
}
