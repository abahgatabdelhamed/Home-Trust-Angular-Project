import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Item } from '../models/item.model';
import { ItemInit } from '../models/item.model';
import { ItemInterface } from '../models/item.model';
import { ItemUnit } from "./../models/item-unit.model";
import { T } from "@angular/core/src/render3";
import { ItemUnitBranch } from "../models/item-unit-branch";

@Injectable()
export class ItemEndpointService extends EndpointFactory {
    _itemUrl = '/api/item/items';
    _itemUrlOne = '/api/item/getitems';
    _itemInitUrl = '/api/item/init';
    _itemTransaction = '/api/item/report';
    _itemUnitUrl = '/api/itemUnit/itemUnitsByItemId';
    private readonly _UrlExchange: string = "/api/Item/items/SearchExchangeWithoutStore";

    get itemUrl() {
        return this.configurations.baseUrl + this._itemUrl;
    }

    get itemUrlOne() {
        return this.configurations.baseUrl + this._itemUrlOne;
    }

    get itemUrlInit() {
        return this.configurations.baseUrl + this._itemInitUrl;
    }

    get itemTransaction() {
        return this.configurations.baseUrl + this._itemTransaction;
    }

    get itemUnitUrl() {
        return this.configurations.baseUrl + this._itemUnitUrl;
    }

    constructor(http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector) {
        super(http, configurations, injector);
    }


    getCurrentItem(id) {
        return this.http.get<ItemInterface>(`${this.itemUrlOne}/${id}`);
    }


    getItems(page=-1, pageSize=-1) {
        return this.http.get<any>(`${this.itemUrl}/${page}/${pageSize}/`);
    }

    getQuantityReport() {
        return this.http.get<any>(`${this.itemUrl}/QuantityReport`);
    }

    addItem(item: any) {
        return this.http.post<Item>(`${this.itemUrl}`, item);
    }

    uploadFile(item: any) {
        return this.http.post<string>(`${this.itemUrl}/Uploadfile`, item);
    }


    editItem(item: any, id) {
        return this.http.put<Item>(`${this.itemUrl}/${id}`, item);
    }

    deleteItem(id) {
        return this.http.delete<Item>(`${this.itemUrl}/${id}`);
    }

    transaction(id,isService) {
        return this.http.get<any>(`${this.itemTransaction}/${id}?isService=${isService}`);
    }

    getInitItem() {
        return this.http.get<ItemInit>(this.itemUrlInit)
    }

    getAssociatedUnitsEndpoint(id) {
        return this.http.get<ItemUnit[]>(`${this.itemUnitUrl}?id=${id}`);
    }

    getSearchItemEndpointExchange<T>(name: string): Observable<any[]> {
        let endpointUrl =this.configurations.baseUrl+ this._UrlExchange;
        let data = { 'name': name };
        let headers = this.getRequestHeaders()
        headers['params'] = data
        return this.http
            .get<T>(endpointUrl, headers)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getSearchItemEndpointExchange(name)
                );
            });
    }

}
