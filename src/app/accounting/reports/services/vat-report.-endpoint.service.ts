import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { VatReport } from "../models/vat-report.model";
import { DatePipe } from "@angular/common";

@Injectable()
export class VatReportEndpointService extends EndpointFactory {
    _url = "/api/vatType";
    _urlCC='/api/Report/TrialBalanceForCC'
    _urlBranch='/api/Report/TrialBalanceForBranch'
    _urlTobaco='/api/VatType/VatTwoReportAbstract'
    get url() {
        return this.configurations.baseUrl + this._url;
    }
    get urlCC(){
        return this.configurations.baseUrl+this._urlCC
    }
    get urlBranch(){
        return this.configurations.baseUrl+this._urlBranch
    }
    get urlTobaco(){
        return this.configurations.baseUrl+this._urlTobaco
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getVatReportSales(searchModel) {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.url}/VatReportSale?FromDate=${f}&ToDate=${t}`).catch(error => {
            return this.handleError(error, () => this.getVatReportSales(searchModel));
        });
    }

    getVatReportProfit(searchModel) {
        console.log(searchModel)
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.url}/VatReportProfit?FromDate=${f}&ToDate=${t}`).catch(error => {
            return this.handleError(error, () => this.getVatReportSales(searchModel));
        });
    }

    getVatReportPurches(searchModel) {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.url}/VatReportPurch?FromDate=${f}&ToDate=${t}`).catch(error => {
            return this.handleError(error, () => this.getVatReportPurches(searchModel));
        });
    }

    getVatReportAbstract(searchModel,branchId?,coastCenterId?) {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.url}/VatReportAbstract?FromDate=${f}&ToDate=${t}&branchId=${branchId}&costCenterId=${coastCenterId}`).catch(error => {
            return this.handleError(error, () => this.getVatReportAbstract(searchModel));
        });
    }
    getTrialBalanceForCC(CostId,searchModel){
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.urlCC}?FromDate=${f}&ToDate=${t}&CostCenterId=${CostId}`)
    }
    getTrialBalanceForBranch(branchId,searchModel){
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.urlBranch}?FromDate=${f}&ToDate=${t}&BranchId=${branchId}`)
    
    }
    getAbstractTobaco(searchModel,branchId?,coastCenterId?){
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
       
        return this.http.get(`${this.urlTobaco}?FromDate=${f}&ToDate=${t}&branchId=${branchId}&costCenterId=${coastCenterId}`).catch(error => {
            return this.handleError(error, () => this.getVatReportAbstract(searchModel));
        });
    }
}
