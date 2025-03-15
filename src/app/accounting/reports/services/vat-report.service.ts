import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { VatReportEndpointService } from "./vat-report.-endpoint.service";

@Injectable()
export class VatReportService {
    constructor(private endpoint: VatReportEndpointService) {}
    getVatReportSales(s) {
        return this.endpoint.getVatReportSales(s);
    }
    getVatReportProfit(s) {
        return this.endpoint.getVatReportProfit(s);
    }
    getVatReportPurches(s) {
        return this.endpoint.getVatReportPurches(s);
    }
    getVatReportAbstract(s,b?,c?) {
        return this.endpoint.getVatReportAbstract(s,b,c);
    }
    getTrialBalanceForCC(costId,s){
        return this.endpoint.getTrialBalanceForCC(costId,s)

    }
    getTrialBalanceForBranch(brancId,s){
      return this.endpoint.getTrialBalanceForBranch(brancId,s)
    }

    getAbstractTobaco(s,b,c){
       return this.endpoint.getAbstractTobaco(s,b,c)
    }
}
