import { Supplier } from "./../models/supplier.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { DatePipe } from "@angular/common";

@Injectable()
export class SupplierEndpointService extends EndpointFactory {
    _url = "/api/person/people";
    _urlReport = "/api/person/Report";
    _urlReportLo = "/api/person/ReportLo";
    _urlCustomer="/api/Person/people/GetPaginatedCustomers"
    get GetPaginatedCustomers(){
        return this.configurations.baseUrl + this._urlCustomer
    }

    get url() {
        return this.configurations.baseUrl + this._url;
    }

    get urlReport() {
        return this.configurations.baseUrl + this._urlReport;
    }

    get urlReportLo() {
        return this.configurations.baseUrl + this._urlReportLo;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getSupplier(whatToLoad, query:string , page:number, pageSize:number) {
        console.log("supplier end point what to load ", whatToLoad );

        if (whatToLoad == 'suppliers') {

        //  api for pagination : GetPaginatedSuppliers
            return this.http.get<Supplier[]>(`${this.url}/GetPaginatedSuppliers?query=${query}&pageNumber=${page}&pageSize=${pageSize}`);
        }
        else {
            return this.http.get<Supplier[]>(`${this.GetPaginatedCustomers}?query=${query}&pageNumber=${page}&pageSize=${pageSize}`)
        }
    }

    addSupplier(sup: Supplier) {
        console.log('sup==',sup)
        return this.http.post<Supplier>(this.url, sup);
    }

    editSupplier(supplierViewModel: Supplier, id: number) {
        return this.http.put(`${this.url}/${id}`, supplierViewModel);
    }

    deleteSupplier(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    reportSupplier(searchModel,o,s, id: number) {
        let p :DatePipe= new DatePipe('en-US')
        if(searchModel.from)
        var f =  p.transform(new Date(searchModel['from']),'short');
        if(searchModel.to)
        var t = p.transform(new Date(searchModel['to']),'short');
        return this.http.get(`${this.urlReport}/${id}?pageNumber=${o}&pageSize=${s}&FromDate=${f}&ToDate=${t}`);
    }
}
