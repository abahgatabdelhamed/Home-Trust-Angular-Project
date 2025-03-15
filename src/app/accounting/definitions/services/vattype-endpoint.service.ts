import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { VatTypeInterface } from "../models/vat-type.model";

@Injectable()
export class VatTypeEndpointService extends EndpointFactory {
    _vatTypeUrl = "/api/vattype/vattypes";

    get vatTypeUrl() {
        return this.configurations.baseUrl + this._vatTypeUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getCurrentVatType(id) {
        return this.http.get<VatTypeInterface>(`${this.vatTypeUrl}/${id}`);
    }

    getVatTypes() {
        return this.http.get<VatTypeInterface[]>(`${this.vatTypeUrl}`);
    }

    addVatType(vattype: VatTypeInterface) {
        return this.http.post<VatTypeInterface>(`${this.vatTypeUrl}`, vattype);
    }

    editVatType(vattype: VatTypeInterface, id) {
        return this.http.put<VatTypeInterface>(
            `${this.vatTypeUrl}/${id}`,
            vattype
        );
    }

    deleteVatType(id) {
        return this.http.delete<VatTypeInterface>(`${this.vatTypeUrl}/${id}`);
    }
}
