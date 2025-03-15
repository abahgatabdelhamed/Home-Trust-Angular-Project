import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { BillSummary } from "../models/sbill-summary";
import { SaleBillSummary } from "../models/sale-bill-summary";
import { DatePipe } from "@angular/common";

@Injectable()
export class SBillEndpoint extends EndpointFactory {
    private readonly _sbillGetUrl: string = "/api/Bill/bills";
    private readonly _sbillGetById: string = "/api/Bill/billbyid";
    private readonly _sbillInitialData: string = "/api/Bill/init";
    private readonly _sbillPostUrl: string = "/api/Bill/bills";
    private readonly _sbillPutUrl: string = "/api/Bill/bills";
    private readonly _sbillDeleteUrl: string = "/api/Bill/bills";
    private readonly _billSummary: string = "/api/Bill/GetSummary";
    private readonly _billSaleSummary: string = "/api/Bill/GetSaleSummary";

    get sbillUrl() {
        return this.configurations.baseUrl + this._sbillGetUrl;
    }



    get billSummary() {
        return this.configurations.baseUrl + this._billSummary;
    }
    get billSaleSummary() {
        return this.configurations.baseUrl + this._billSaleSummary;
    }
    get sbillByIdUrl(){
        return this.configurations.baseUrl + this._sbillGetById;
    }

    getSBillInitUrl() {
        return this.configurations.baseUrl + this._sbillInitialData;
    }

    getSBillPostUrl() {
        return this.configurations.baseUrl + this._sbillPostUrl;
    }


    getSBillPutUrl() {
        return this.configurations.baseUrl + this._sbillPutUrl;
    }
    getSBillDeleteUrl() {
        return this.configurations.baseUrl + this._sbillDeleteUrl;
    }
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getSBillInitEndpoint<T>(dataParam) {
        let endpointUrl = this.getSBillInitUrl();
        //let data = {'BillTypeCode': 'SALE'};
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getSBillInitEndpoint(dataParam)
            );
        });
    }

    getBillSummaryEndpoint(searchModel) {
        if(searchModel.from)
        var f = new Date(searchModel['from']).toJSON();
        if(searchModel.to)
        var t = new Date(searchModel['to']).toJSON();
        return this.http.get<BillSummary[]>(`${this.billSummary}?FromDate=${f}&ToDate=${t}`);
    }

    getSBillsEndpoint<T>(
        dataParam,
        page?: number,
        pageSize?: number
    ): Observable<T> {
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        let endpointUrl =
            page && pageSize
                ? `${this.sbillUrl}/${page}/${pageSize}`
                : this.sbillUrl;

        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getSBillsEndpoint(dataParam, page, pageSize)
            );
        });
    }

    getSBillByIDEndpoint<T>(dataParam): Observable<T> {
        let headers = this.getRequestHeaders();
        headers["params"] = dataParam;
        let endpointUrl = this.sbillByIdUrl;

        return this.http.get<T>(endpointUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getSBillsEndpoint(dataParam)
            );
        });
    }

    getBillSalesSummaryEndpoint(searchModel,branchId,coastCenterId?,userId?:any) {
        console.log(userId,coastCenterId)
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
        let headers = this.getRequestHeaders();
        let dataParams: HttpParams = new HttpParams();
        dataParams =dataParams.append('FromDate',f)
        dataParams =dataParams.append('ToDate',t)
        if(branchId)
        dataParams = dataParams.append('branch', branchId);
        if(coastCenterId)
        dataParams = dataParams.append('costCenterId', coastCenterId);
        if(userId)
        dataParams = dataParams.append('userId', userId);
     
        headers["params"] = dataParams;
      
        //    return this.http.get<SaleBillSummary>(`${this.billSaleSummary}?FromDate=${f}&ToDate=${t}`);
           return this.http.get<SaleBillSummary>(this.billSaleSummary,headers)
        }


    getNewSBillEndpoint<T>(sbillObject: any): Observable<T> {
        console.log(JSON.stringify(sbillObject));
        return this.http
            .post<T>(
                this.getSBillPostUrl(),
                JSON.stringify(sbillObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewSBillEndpoint(sbillObject)
                );
            });
    }

    getUpdateSBillEndpoint<T>(
        sbillObject: any,
        sbillId?: number
    ): Observable<T> {
        let endpointUrl = sbillId
            ? `${this.getSBillPutUrl()}/${sbillId}`
            : this.getSBillPutUrl();
        console.error(endpointUrl);
        console.log(JSON.stringify(sbillObject));
        return this.http
            .put<T>(
                endpointUrl,
                JSON.stringify(sbillObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateSBillEndpoint(sbillObject, sbillId)
                );
            });
    }

    getDeleteSBillEndpoint<T>(sbillId: number): Observable<T> {
        let endpointUrl = `${this.getSBillDeleteUrl()}/${sbillId}`;
        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteSBillEndpoint(sbillId)
                );
            });
    }
}
