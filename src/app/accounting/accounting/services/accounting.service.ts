import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Accounting } from "../models/accounting.model";
import { AccountingEndpointService } from "./accounting-endpoint.service";

@Injectable()
export class AccountingService {
    constructor(private endpoint: AccountingEndpointService) {}

    getAccountings(query,pageNumber,pageSize) {
        return this.endpoint.getAccountings(query,pageNumber,pageSize);
    }

    getInitialAccountinng() {
        return this.endpoint.getInitialAccounting();
    }

    addAccounting(acc: Accounting) {
        return this.endpoint.addAccounting(acc);
    }

    editAccounting(acc: Accounting, id: number) {
        return this.endpoint.editAccounting(acc, id);
    }

    deleteAccounting(id) {
        return this.endpoint.deleteAccounting(id);
    }

    getTree() {
        return this.endpoint.getTreeDataEndpoint();
    }
    getAllDeliveryApps(q,s,e,offset,size){
        return this.endpoint.getAllDeliveryApps(q,s,e,offset,size);
    }
    addDeliveryApp(object){
        return this.endpoint.addDeliveryApp(object);
    }
    updateDeliveryApp(object,id){
        return this.endpoint.updateDeliveryApp(object,id);
    }
}
