import { SupplierEndpointService } from "./supplier-endpoint.service";
import { Supplier } from "./../models/supplier.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class SupplierService {
    constructor(private SupplierEnpPoint: SupplierEndpointService) {}

    addSupplier(sup: Supplier) {
        return this.SupplierEnpPoint.addSupplier(sup);
    }

    // query for search
    getSupplier(whatToLoad: string ,query:string = '', page:number = -1, pageSize:number = -1) {
        return this.SupplierEnpPoint.getSupplier(whatToLoad,query, page, pageSize);
    }

    editSupplier(supplierViewModel: Supplier, id: number) {
        return this.SupplierEnpPoint.editSupplier(supplierViewModel, id);
    }

    deleteSupplier(id: number) {
        return this.SupplierEnpPoint.deleteSupplier(id);
    }

    reportSupplier(searchModel,o,s ,id: number) {
        return this.SupplierEnpPoint.reportSupplier(searchModel,o,s, id);
    }
}
