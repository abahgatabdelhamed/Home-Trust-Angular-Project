import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class PBillEndpoint extends EndpointFactory {
    private readonly _billUrl: string = "/api/itemCategory/itemCategories";

    get billUrl() {
        return this.configurations.baseUrl + this._billUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getBillsEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl =
            page && pageSize
                ? `${this.billUrl}/${page}/${pageSize}`
                : this.billUrl;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getBillsEndpoint(page, pageSize)
                );
            });
    }

    getNewBillEndpoint<T>(billObject: any): Observable<T> {
        console.log(JSON.stringify(billObject));
        return this.http
            .post<T>(
                this.billUrl,
                JSON.stringify(billObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewBillEndpoint(billObject)
                );
            });
    }

    getUpdateBillEndpoint<T>(
        billObject: any,
        billId?: number
    ): Observable<T> {
        let endpointUrl = billId
            ? `${this.billUrl}/${billId}`
            : this.billUrl;
        console.log(JSON.stringify(billObject));
        return this.http
            .put<T>(
                endpointUrl,
                JSON.stringify(billObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateBillEndpoint(billObject, billId)
                );
            });
    }

    getDeleteBillEndpoint<T>(billId: number): Observable<T> {
        let endpointUrl = `${this.billUrl}/${billId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteBillEndpoint(billId)
                );
            });
    }
}
