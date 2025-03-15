import { ExchangeVar } from "./../../../models/exchange-varieties";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ExchangeVarEndpoint } from "./exchange-varieties-endpoint.service";

@Injectable()
export class ExchangeVarService {
    constructor(private exchangeVarEndpoint: ExchangeVarEndpoint) {}

    newExchangeVar(exchangeVar: ExchangeVar) {
        return this.exchangeVarEndpoint.addNewExchangeVar(exchangeVar);
    }
    newExchangeVarforCC(exchangeVar: ExchangeVar) {
        return this.exchangeVarEndpoint.addNewExchangeVarforCC(exchangeVar);
    }
    updateExchangeVar(exchangeVar: ExchangeVar) {
        return this.exchangeVarEndpoint.updateExchangeVar(
            exchangeVar,
            exchangeVar["id"]
        );
    }
    updateExchangeVarCC(exchangeVar: ExchangeVar) {
        return this.exchangeVarEndpoint.updateExchangeVarCC(
            exchangeVar,
            exchangeVar["id"]
        );
    }
    getExchangeVars() {
        return this.exchangeVarEndpoint.getAllExchangeVarsEndpoint();
    }
    getExchangeVarsforCC() {
        return this.exchangeVarEndpoint.getAllExchangeVarsforCCEndpoint();
    }
    deleteExchangeVar(exchangeVarOrExchangeVarId: number) {
        return this.exchangeVarEndpoint.deleteExchangeVarEndpoint(
            exchangeVarOrExchangeVarId
        );
    }

    getAccounts() {
        return this.exchangeVarEndpoint.getAccounts();
    }

    getInitial() {
        return this.exchangeVarEndpoint.getInitialEndpoint();
    }

    getItemUnits(id) {
        return this.exchangeVarEndpoint.getItemUnitsEndpoint(id);
    }
}
