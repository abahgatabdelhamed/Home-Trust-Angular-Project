import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class BillEndpoint extends EndpointFactory {
    private readonly _billUrl: string = "/api/bill";

    get billUrl() {
        return this.configurations.baseUrl + this._billUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getAllBillsEndpoint() {
        return this.http.get(this.billUrl);
    }
}
