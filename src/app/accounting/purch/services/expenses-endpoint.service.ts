import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Pagination } from "../../shared/models/pagination.model";
import { Expenses } from "../models/expenses.model";
import { DatePipe } from "@angular/common";

@Injectable()
export class ExpensesEndpoint extends EndpointFactory {
    private readonly _expensesUrl: string = "/api/ExpensesBill/expensesBills";
    private readonly _allExpensesUrl: string = "/api/ExpensesBill/GetExpensesBills";
    private readonly _refundBillUrl: string = "/api/ExpensesBill/RefundeExpensesBill";
    private readonly _availableExpensesBillForRefundeURL = "/api/ExpensesBill/GetAvailableExpensesBillForRefunde";

    get expensesUrl() {
        return this.configurations.baseUrl + this._expensesUrl;
    }

    get allExpensesUrl(){
        return this.configurations.baseUrl + this._allExpensesUrl;
    }

    get refundBillUrl(){
        return this.configurations.baseUrl + this._refundBillUrl;
    }

    get availableExpensesBillForRefundeURL(){
        return this.configurations.baseUrl + this._availableExpensesBillForRefundeURL;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }


    getAvailableExpensesBillForRefunde(){
        return this.http.get(this.availableExpensesBillForRefundeURL);
    }


    refundBill(id, date){
        return this.http.put(this.refundBillUrl, {id : id, date:date});
    }

    getExpensessEndpoint<T>(searchModel,searchQuery:any='', branchId:any= null, costCenterId:any=null, 
    expensesId:any=null,pageSize: any=-1,  page: any=-1): Observable<T> {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       let params:HttpParams = new HttpParams();
       params = params.set('query', searchQuery).set('branchId', branchId)
       .set('costCenterId', costCenterId).set('expensesId', expensesId)
       .set('page', page).set('pageSize', pageSize).set('fromDate',f).set('toDate',t);
        return this.http
            .get<T>(this.allExpensesUrl, {params, ...this.getRequestHeaders()})
            .catch(error => {
                return this.handleError(error, () =>
                    this.getExpensessEndpoint(searchModel,searchQuery,branchId,costCenterId,page, pageSize)
                );
            });
    }

    getExpensesInitEndpoint() {
        return this.http.get(`${this.expensesUrl}/init`, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () =>
                this.getExpensesInitEndpoint()
            );
        });
    }

    getNewExpensesEndpoint<T>(expensesObject: any): Observable<T> {
        console.log(JSON.stringify(expensesObject));
        return this.http
            .post<T>(
                this.expensesUrl,
                JSON.stringify(expensesObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewExpensesEndpoint(expensesObject)
                );
            });
    }

    getUpdateExpensesEndpoint<T>(
        expensesObject: any,
        expensesId?: number
    ): Observable<T> {
        let endpointUrl = expensesId
            ? `${this.expensesUrl}/${expensesId}`
            : this.expensesUrl;

            expensesObject.account={"name":"نقد"}
            expensesObject.accountType={"name":"نقد"}
        console.log(expensesObject,JSON.stringify(expensesObject));

        return this.http
            .put<T>(
                endpointUrl,
                {"id":expensesId, "receiptCode":expensesObject.receiptCode,"date":expensesObject.date,"notes":expensesObject.notes,"account":expensesObject.account?{"name":expensesObject.account.name}:null,"accountType":expensesObject.accountType?{"name":expensesObject.accountType.name}:null,"branch":expensesObject.branch?{"name":expensesObject.branch.name}:null,"accountId":expensesObject.accountId,"accountTypeId":expensesObject.accountTypeId,"branchId":expensesObject.branchId,"amount":expensesObject.amount,"vat":expensesObject.vat,"staffId":expensesObject.staffId,"staffName":expensesObject.staffName,"vatTypeId":expensesObject.vatTypeId,"costCenterId":expensesObject.costCenterId,"expensessTreeId":expensesObject.expensessTreeId,"person":expensesObject.person ,"personId":expensesObject.personId ,"personName":expensesObject.personName },
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateExpensesEndpoint(expensesObject, expensesId)
                );
            });
    }

    getDeleteExpensesEndpoint<T>(expensesId: number): Observable<T> {
        let endpointUrl = `${this.expensesUrl}/${expensesId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteExpensesEndpoint(expensesId)
                );
            });
    }



    
}
