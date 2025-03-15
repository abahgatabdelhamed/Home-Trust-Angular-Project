import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import {
    PrinterSettingsInterface,
    ThermalPrinterSettingsInterface
} from "../models/printer-settings";

@Injectable()
export class PrinterSettingsEndpoint extends EndpointFactory {
    private readonly _printerSettingsUrl: string = "/api/setting/settings";

    get printerSettingsUrl() {
        return this.configurations.baseUrl + this._printerSettingsUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getPrinterSettingsEndpoint() {
        return this.http.get(`${this.printerSettingsUrl}/PrinterInfo`);
    }

    updatePrinterSetting(printerSettings: any ) {
        return this.http.put(`${this.printerSettingsUrl}/PrinterInfo`, printerSettings);
    }

    updateThermalPrinterSetting(
        thermalSettings: any
    ) {
        return this.http.put(
            `${this.printerSettingsUrl}/PrinterInfo`,
            thermalSettings
        );
    }
}
