import { Supplier } from "./../models/supplier.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class CustomerEndpointService extends EndpointFactory {
    private readonly _customerUrl: string = "/api/person/people";

    get customerUrl() {
        return this.configurations.baseUrl + this._customerUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getAllCustomersEndpoint() {
        return this.http.get<Supplier[]>(`${this.customerUrl}/Customers`);
    }

    getCustomer() {
        return this.http.get<Supplier[]>(`${this.customerUrl}/suppliers`);
    }

    editCustomer(id: number, supplierViewModel: Supplier) {
        return this.http.put(`${this.customerUrl}/${id}`, supplierViewModel);
    }

    deleteCustomer(id: number) {
        return this.http.delete(`${this.customerUrl}/${id}`);
    }
}
