import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class OfferEndpoint extends EndpointFactory {
    private readonly _offerGetUrl: string = "/api/Bill/bills";
    private readonly _offerGetById: string = "/api/Bill/billbyid";
    private readonly _offerInitialData: string = "/api/Bill/init";
    private readonly _offerPostUrl: string = "/api/Bill/bills";
    private readonly _offerPutUrl: string = "/api/Bill/bills";
    private readonly _offerDeleteUrl: string = "/api/Bill/bills";

    get offerUrl() {
        return this.configurations.baseUrl + this._offerGetUrl;
    }

    get offerByIdUrl(){
        return this.configurations.baseUrl + this._offerGetById;
    }

    getOfferInitUrl() {
        return this.configurations.baseUrl + this._offerInitialData;
    }

    getOfferPostUrl() {
        return this.configurations.baseUrl + this._offerPostUrl;
    }

    getOfferPutUrl() {
        return this.configurations.baseUrl + this._offerPutUrl;
    }
    getOfferDeleteUrl() {
        return this.configurations.baseUrl + this._offerDeleteUrl;
    }
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getOfferInitEndpoint<T>(dataParam) {
        let endpointUrl = this.getOfferInitUrl();
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getOfferInitEndpoint(dataParam)
            );
        });
    }

    getOffersEndpoint<T>(
        dataParam,
        page?: number,
        pageSize?: number
    ): Observable<T> {
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        let endpointUrl =
            page && pageSize
                ? `${this.offerUrl}/${page}/${pageSize}`
                : this.offerUrl;

        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getOffersEndpoint(dataParam, page, pageSize)
            );
        });
    }

    getOfferByIDEndpoint<T>(dataParam): Observable<T> {
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        let endpointUrl = this.offerByIdUrl;

        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getOffersEndpoint(dataParam)
            );
        });
    }

    getNewOfferEndpoint<T>(offerObject: any): Observable<T> {
        console.log(JSON.stringify(offerObject));
        return this.http
            .post<T>(
                this.getOfferPostUrl(),
                JSON.stringify(offerObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewOfferEndpoint(offerObject)
                );
            });
    }

    getUpdateOfferEndpoint<T>(
        offerObject: any,
        offerId?: number
    ): Observable<T> {
        let endpointUrl = offerId
            ? `${this.getOfferPutUrl()}/${offerId}`
            : this.getOfferPutUrl();
        console.error(endpointUrl);
        console.log(JSON.stringify(offerObject));
        return this.http
            .put<T>(
                endpointUrl,
                JSON.stringify(offerObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateOfferEndpoint(offerObject, offerId)
                );
            });
    }

    getDeleteOfferEndpoint<T>(offerId: number): Observable<T> {
        let endpointUrl = `${this.getOfferDeleteUrl()}/${offerId}`;
        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteOfferEndpoint(offerId)
                );
            });
    }
}
