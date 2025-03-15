import { SupplierEndpointService } from "./supplier-endpoint.service";
import { Supplier } from "./../models/supplier.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { CustomerEndpointService } from "./customer-endpoint.service";

@Injectable()
export class CustomerService {
    constructor(private CustomerEnpPoint: CustomerEndpointService) {}

    getAllCustomer() {
        return this.CustomerEnpPoint.getAllCustomersEndpoint();
    }

    editCustomer(id: number, supplierViewModel: Supplier) {
        this.CustomerEnpPoint.editCustomer(id, supplierViewModel);
    }

    deleteCustomer(id: number) {
        this.CustomerEnpPoint.deleteCustomer(id);
    }
}
