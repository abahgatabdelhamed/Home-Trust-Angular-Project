import { Branch } from './../../definitions/models/brach.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { format } from 'url';
import { ConfigurationService } from '../../../services/configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { shift } from '../models/shift';
import { viewShift } from '../models/ShiftItem';
import { DatePipe } from '@angular/common';
@Injectable()
export class ReportsEndpointService extends EndpointFactory {

    private readonly _UrlDueAmountReport = '/api/Report/PeopleDueAmount'
    // /api/Report/PeopleDueAmount type post
    private readonly _UrlSolidItemReport = '/api/Report/SoldItemsReport'
    // api/Report/SoldItemsReport type post
    private readonly _UrlGetAllBranch = '/api/Branch/branches'
    private readonly _UrlGetAllShifts = '/api/Shift/POS/GetShifts'
    private readonly _UrlReportShift = '/api/Shift/POS/GetShiftReport'
    private readonly _UrlAllUsers = '/api/Shift/POS/GetUsres'
    private readonly _UrlCCReport='/api/Report/CostCenterReport'
    private readonly _UrlCCProdReport='/api/Report/CostCenterProductionReport'
    // api get all item
    // private readonly _urlGetAllItem='/api/Item/items'
    // get urlAllItem
    private readonly _Url: string = this.configurations.baseUrl + "/api/Item/items/Search";
    private readonly _UrlSearch: string = this.configurations.baseUrl + "/api/Item/SearchItems";
    // itemCategories
    private readonly _itemCategoriesUrl = '/api/ItemCategory/itemCategories';

    private readonly peopleSearchUrl = '/api/person/people/Search';
    
    get UrlAllPeople() {
        return this.configurations.baseUrl + this.peopleSearchUrl
    }
    get UrlAllUsers() {
        return this.configurations.baseUrl + this._UrlAllUsers
    }
    get urlItemCategories() {
        return this.configurations.baseUrl + this._itemCategoriesUrl
    }

    get urlAllBranch() {
        return this.configurations.baseUrl + this._UrlGetAllBranch
    }

    get urlDueAmountReport() {
        return this.configurations.baseUrl + this._UrlDueAmountReport;
    }

    get urlSolidItemReport() {
        return this.configurations.baseUrl + this._UrlSolidItemReport;
    }
    get urlShift() {
        return this.configurations.baseUrl + this._UrlGetAllShifts;
    }
    get urlReportShift() {
        return this.configurations.baseUrl + this._UrlReportShift;
    }
    get urlCCReport() {
        return this.configurations.baseUrl + this._UrlCCReport;
    }
    get urlCCProdReport() {
        return this.configurations.baseUrl + this._UrlCCProdReport;
    }
    constructor(public http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector) {
        super(http, configurations, injector);
    }

    postDueAmountReport(peopleIds: number[]) {
        const Ob = { peopleIds: peopleIds }
        return this.http.post<any>(this.urlDueAmountReport, Ob)
    }
    getStatistics(from,to){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Bill/statics?fromdate=${from}&toDate=${to}`)
    }
    postSolidItemReport(fromDate: Date, toDate: Date, itemCategorie: number[], items: number[],services:number[],branchId?,userId?) {
    
        let p :DatePipe= new DatePipe('en-US')
        if(fromDate)
        var f =  p.transform(new Date(fromDate),'short');
        if(toDate)
        var t = p.transform(new Date(toDate),'short');
           const model =
        {
            fromDate: f,
            toDate: t,
            itemCategorie: itemCategorie,
            items: items,
            branchId:branchId,
            userId:userId,
            services:services
        }
        return this.http.post<any>(`${this.urlSolidItemReport}`, model)
    }
    costCenterReport(fromDate: Date, toDate: Date,branchId:number, ccId:number) {
    
        let p :DatePipe= new DatePipe('en-US')
        if(fromDate)
        var f =  p.transform(new Date(fromDate),'short');
        if(toDate)
        var t = p.transform(new Date(toDate),'short');
       
        return this.http.get<any>(`${this.urlCCReport}?FromDate=${f}&ToDate=${t}&branchId=${branchId}&CostCenterId=${ccId}`)
    }
    costCenterProdReport(fromDate: Date, toDate: Date,branchId:number) {
    
        let p :DatePipe= new DatePipe('en-US')
        if(fromDate)
        var f =  p.transform(new Date(fromDate),'short');
        if(toDate)
        var t = p.transform(new Date(toDate),'short');
       
        return this.http.get<any>(`${this.urlCCProdReport}?FromDate=${f}&ToDate=${t}&branchId=${branchId}`)
    }
    getAllBranch() {
        return this.http.get<[{ id: number, isDefault: boolean, name: String }]>(this.urlAllBranch)
    }


    getSearchItemEndpoint<T>
        (name: any, branchId: number): Observable<any[]> {
        let endpointUrl = this._Url;
        let data = { 'name': name, 'BranchId': branchId };
        let headers = this.getRequestHeaders()
        headers['params'] = data
        return this.http
            .get<T>(endpointUrl, headers)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getSearchItemEndpoint(name, branchId)
                );
            });
    }
    getSearchItemNameEndpoint<T>
    (name: any): Observable<any[]> {
    let endpointUrl = this._UrlSearch;
    let data = { 'query': name};
    let headers = this.getRequestHeaders()
    headers['params'] = data
    return this.http
        .get<T>(endpointUrl, headers)
        .catch(error => {
            return this.handleError(error, () =>
                this.getSearchItemNameEndpoint(name)
            );
        });
}
    getAllItemCategories() {
        let headers = this.getRequestHeaders()
        // {id:string,nameAr:string,nameEn:string}
        return this.http.get(this.urlItemCategories, headers).catch(error => {
            return this.handleError(error, () =>
                this.getAllItemCategories()
            );
        });
    }

    getAllShifts(q,s,e,offset,size,user,branch) {
        let p :DatePipe= new DatePipe('en-US')
        if(s)
        var f =  p.transform(new Date(s),'short');
        if(e)
        var t = p.transform(new Date(e),'short');
        console.log(q,f,t)
        // {id:string,nameAr:string,nameEn:string}
        return this.http.get<shift>(`${this.urlShift}?userId=${user}&branchId=${branch}&FromDate=${f}&ToDate=${t}&pageNumber=${offset}&pageSize=${size}`).catch(error => {
            return this.handleError(error, () =>
                this.getAllShifts(q,s,e,offset,size,user,branch)
            );
        });
    }

    getReportShift(id) {
        // {id:string,nameAr:string,nameEn:string}
        return this.http.get<viewShift[]>(`${this.urlReportShift}?id=${id}`).catch(error => {
            return this.handleError(error, () =>
                this.getReportShift(id)
            );
        });
    }


    getAllUsers() {
        // {id:string,nameAr:string,nameEn:string}
        return this.http.get<viewShift[]>(`${this.UrlAllUsers}`).catch(error => {
            return this.handleError(error, () =>
                this.getAllUsers()
            );
        });
    }
    getSearchPeopleEndpoint<T>
        (name: string): Observable<any[]> {
        let endpointUrl = this.UrlAllPeople;
        let data = { 'name': name };
        let headers = this.getRequestHeaders()
        headers['params'] = data
        return this.http
            .get<T>(endpointUrl, headers)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getSearchPeopleEndpoint(name)
                );
            });
    }


}
