import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";


import { BillSummary } from "../models/sbill-summary";
import { DatePipe } from "@angular/common";
import { BillPost } from "../models/bill-post.model";

@Injectable()
export class SBillEndpoint extends EndpointFactory {
    private readonly _sbillGetUrl: string = "/api/Bill/bills";
    private readonly _sbillGetById: string = "/api/Bill/billbyid";
    private readonly _sbillGetCodeByBranchId: string = "/api/Bill/billcode";
    private readonly _sbillInitialData: string = "/api/Bill/init";
    private readonly _sbillPostUrl: string = "/api/Bill/bills";
    private readonly _sbillPutUrl: string = "/api/Bill/bills";
    private readonly _sbillDeleteUrl: string = "/api/Bill/bills";
    private readonly _billSummary: string = "/api/Bill/GetSummary";
    private readonly _refundExchangeBillURL: string = "/api/Bill/ExchangeBillRefund"
    private readonly _CollectCostForCostCenter: string = "/api/Bill/CollectCostForCostCenter";
    private readonly _billsCanBeRefundedURL: string = "/api/Bill/GetBillsCanBeRefunded";
    private readonly _SearchbillsCanBeRefundedURL:string= "/api/Bill/SearchBillsCanBeRefunded";
    private readonly _SearchBillsExpenses:string='/api/ExpensesBill/Search'
    get sbillUrl() {
        return this.configurations.baseUrl + this._sbillGetUrl;
    }

    get SbillGetCodeByBranchId(): string {
        return this.configurations.baseUrl + this._sbillGetCodeByBranchId;
    }

    get billSummary() {
        return this.configurations.baseUrl + this._billSummary;
    }
    get sbillByIdUrl() {
        return this.configurations.baseUrl + this._sbillGetById;
    }

    get refundExchangeBillURL(){
        return this.configurations.baseUrl + this._refundExchangeBillURL;
    }
    get CollectCostForCostCenter(){
        return this.configurations.baseUrl +this._CollectCostForCostCenter;
    }
    get billsCanBeRefundedURL(){
        return this.configurations.baseUrl + this._billsCanBeRefundedURL;
    }
    get SearchBillsCanRefundURL(){
        return this.configurations.baseUrl + this._SearchbillsCanBeRefundedURL;
    }
    get SearchBillsExpenses(){
        return this.configurations.baseUrl + this._SearchBillsExpenses;
    }
    getBillsCanBeRefunded(billTypeId){
        let params: HttpParams = new HttpParams();
        params = params.set("billTypeCode", billTypeId);
        return this.http.get(this.billsCanBeRefundedURL , {params: params});
    }

    refundExchangeBill(billId, date){
        return this.http.put(this.refundExchangeBillURL, {id: billId, date : date})
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

    getInitialEndpoint() {
        return this.http.get(`${this.configurations.baseUrl}/api/receiptDocument/init`).catch(error => {
            return this.handleError(error, () => this.getInitialEndpoint());
        });
    }

    changeStatus(billId, isDelivered) {
        return this.http.post(`${this.configurations.baseUrl}/api/Bill/ChangeStatus`, {
            id: billId, isDelivered: isDelivered
        }).catch(error => {
            return this.handleError(error, () => this.changeStatus(billId, isDelivered));
        });
    }


    getBillSummaryEndpoint(searchModel) {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get<BillSummary[]>(`${this.billSummary}?FromDate=${f}&ToDate=${t}`)
    }

    getSBillsEndpoint<T>(
        billTypeCode: string, query: string = '', branchId: any = null,searchModel:any={from:new Date(),to:new Date()}, costCenterId: any = null,
        pageSize: any = -1,
        pageNumber: any = -1
      ,userId?:any
    ): Observable<T> {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
        let headers = this.getRequestHeaders();
        let dataParams: HttpParams = new HttpParams();
        dataParams = dataParams.append('billTypeCode', billTypeCode);
        dataParams = dataParams.append('query', query);
        dataParams =dataParams.append('fromDate',f)
        dataParams =dataParams.append('toDate',t)
        dataParams = dataParams.append('branchId', branchId);
        dataParams = dataParams.append('costCenterId', costCenterId);
        dataParams = dataParams.append('pageNumber', pageNumber);
        dataParams = dataParams.append('pageSize', pageSize);
        if(userId)
        dataParams = dataParams.append('userId', userId);
        headers["params"] = dataParams;
        console.log(dataParams)
        return this.http.get<T>(this.sbillUrl, headers).catch(error => {
            return this.handleError(error, () =>
                this.getSBillsEndpoint(billTypeCode, query, branchId, searchModel,costCenterId, pageSize, pageNumber,userId)
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
    getSBillInitCode(dataParam, code): Observable<string> {
        let endpointUrl = this.SbillGetCodeByBranchId + "?BillTypeCode=" + code;

        return this.http.get<string>(endpointUrl).catch(error => {
            return this.handleError(error, () =>
                this.getSBillsEndpoint(dataParam)
            );
        });
    }

    getNewSBillEndpoint<T>(sbillObject: BillPost): Observable<T> {
         sbillObject.BillItems.forEach(element => {
            delete element.Id
        });
        sbillObject.BillServices.forEach(element => {
            delete element.Id
        });
        console.log(JSON.stringify(sbillObject));
        sbillObject.AccountId=null
        sbillObject.AccountTypeId=null
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
        sbillObject.AccountId=null
        sbillObject.AccountTypeId=null
        let endpointUrl = sbillId
            ? `${this.getSBillPutUrl()}`
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
    getCollectCostForCostCenterurl(){
          return this.http.get(`${this.CollectCostForCostCenter}`).catch(error => {
            return this.handleError(error, () =>
                this.getCollectCostForCostCenterurl()
            );
        });
    }
    SearchBillsCanRefund<T>(invoiceCode: string,billTypeCode:string):Observable<any[]>{
        // let endpointUrl = this._Url;
        let endpointUrl = this.SearchBillsCanRefundURL
        let data = {'billTypeCode': billTypeCode,'code':invoiceCode };
        let headers = this.getRequestHeaders()
        headers['params'] =  data
        return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.SearchBillsCanRefund(invoiceCode,billTypeCode)
            );
        });
 }
 SearchBillsExpensesRefund<T>(invoiceCode: string):Observable<any[]>{
    // let endpointUrl = this._Url;
    let endpointUrl = this.SearchBillsExpenses
    let data = {'code':invoiceCode };
    let headers = this.getRequestHeaders()
    headers['params'] =  data
    return this.http
    .get<T>(`${endpointUrl}?code=${invoiceCode}`)
    .catch(error => {
        return this.handleError(error, () =>
            this.SearchBillsExpensesRefund(invoiceCode)
        );
    });
}

}
