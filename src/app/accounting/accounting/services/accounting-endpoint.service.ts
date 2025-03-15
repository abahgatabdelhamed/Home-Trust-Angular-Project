import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Accounting } from "../models/accounting.model";

@Injectable()
export class AccountingEndpointService extends EndpointFactory {
    _url = "/api/accounting/accounting";
    _deliveryAppsUrl='/api/Accounting/'
    // api/receiptDocument/init
    _treeURL = '/api/accounting/init';
    _treeTable = '/api/AccountCategory/GetAllTree';
    _accounting_init='/api/accounting/init'
    get accounting_init_url(){
      return  this.configurations.baseUrl+ this._accounting_init
    }
    get deliveryAppsUrl(){
        return  this.configurations.baseUrl+ this._deliveryAppsUrl
      }
    get url() {
        return this.configurations.baseUrl + this._url;
    }

    get treeURL() {
        return this.configurations.baseUrl + this._treeURL;
    }

    get treeTable() {
        return this.configurations.baseUrl + this._treeTable;
    }



    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getAccountings(query,pageNumber,pageSize) {
        return this.http.get<Accounting[]>(`${this.url}?query=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}`).catch(error => {
            return this.handleError(error, () => this.getAccountings(query,pageNumber,pageSize));
        });
    }

    getInitialAccounting() {
        return this.http.get(`${this.accounting_init_url}`).catch(error => {
            return this.handleError(error, () => this.getInitialAccounting());
        });
    }

    addAccounting(acc: Accounting) {
        return this.http.post(`${this.url}`, acc).catch(error => {
            return this.handleError(error, () => this.addAccounting(acc));
        });
    }

    editAccounting(acc: Accounting, id: number) {
        return this.http.put(`${this.url}/${id}`, acc).catch(error => {
            return this.handleError(error, () => this.editAccounting(acc, id));
        });
    }


    getTreeDataEndpoint() {
        return this.http.get(this.treeTable);
    }
    getAllDeliveryApps(q,s,e,offset,size){
        return this.http.get<any>(`${this.
            deliveryAppsUrl}/getDeliveryApps`)
    }
    addDeliveryApp(object){
        return this.http.post<any>(`${this.
            deliveryAppsUrl}/addDeliveryApp`,object)
    }
    updateDeliveryApp(object,id){
        return this.http.put<any>(`${this.
            deliveryAppsUrl}updateDeliveryApp/${id}`,object)
    }
    deleteAccounting(id) {
        return this.http.delete(`${this.url}/${id}`).catch(error => {
            return this.handleError(error, () => this.deleteAccounting(id));
        });
    }
    // addSupplier(sup: Accounting) {
    //     return this.http.post<Accounting>(this.url, sup);
    // }

    // editSupplier(supplierViewModel: Accounting, id: number) {
    //     return this.http.put(`${this.url}/${id}`, supplierViewModel);
    // }

    // deleteSupplier(id: number) {
    //     return this.http.delete(`${this.url}/${id}`);
    // }



}
