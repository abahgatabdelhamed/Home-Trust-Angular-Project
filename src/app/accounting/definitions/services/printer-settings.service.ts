import {
    ThermalPrinterSettings,
    ThermalPrinterSettingsInterface
} from "./../models/printer-settings";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { PrinterSettingsEndpoint } from "./printer-settings-endpoint.service";
import { PrinterSettingsInterface } from "../models/printer-settings";

@Injectable()
export class PrinterSettingsService {
    constructor(private printerEndpoint: PrinterSettingsEndpoint) {}

    getPrinterSettings(): Observable<any> {
        return this.printerEndpoint.getPrinterSettingsEndpoint();
    }

    updatePrinterSettings(printerSettings: any) {
        return this.printerEndpoint.updatePrinterSetting(printerSettings);
    }

    updateThermalPrinterSettings(
        thermalSettings: any
    ) {
        return this.printerEndpoint.updateThermalPrinterSetting(
            thermalSettings
        );
    }
}
