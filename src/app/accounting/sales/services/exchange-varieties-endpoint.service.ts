import { ExchangeVar } from "./../../../models/exchange-varieties";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { type } from "os";

@Injectable()
export class ExchangeVarEndpoint extends EndpointFactory {
    private  readonly transferItem_init ='/api/transferItem/init'
    // /api/itemUnit/itemUnitsByItemId
    private readonly itemUnitsByItemId= '/api/itemUnit/itemUnitsByItemId'
    private readonly _exchangeVarCCUrl='/api/TransferItem/GetTransferItemsForCC'
    private readonly _exchangeVarforCCUrl='/api/TransferItem/AddTransferItemForCC'
    private readonly _exchangeVarUrlCC='/api/TransferItem/EditTransferItemForCC'
    get itemUnitsByItemIdUrl(){
        return this.configurations.baseUrl + this.itemUnitsByItemId
    }
    get transferItem_init_url(){
        return this.configurations.baseUrl+ this.transferItem_init
    }
    private readonly _exchangeVarUrl: string =
        "/api/transferItem/transferItems";

    get exchangeVarUrl() {
        return this.configurations.baseUrl + this._exchangeVarUrl;
    }
    get exchangeVarUrlCC() {
        return this.configurations.baseUrl + this._exchangeVarUrlCC;
    }
    get exchangeVarforCCUrl(){
        return this.configurations.baseUrl + this._exchangeVarforCCUrl;
    }
   get exchangeVarCCUrl(){
    return this.configurations.baseUrl + this._exchangeVarCCUrl;
   }

    getAllExchangeVarsEndpoint() {
        return this.http
            .get<ExchangeVar[]>(`${this.exchangeVarUrl}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getAllExchangeVarsEndpoint()
                );
            });
    }
    getAllExchangeVarsforCCEndpoint(){
        return this.http
            .get<ExchangeVar[]>(`${this.exchangeVarCCUrl}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getAllExchangeVarsforCCEndpoint()
                );
            }); 
    }
    addNewExchangeVar(exchangeVar: ExchangeVar) {
        return this.http
            .post<ExchangeVar>(this.exchangeVarUrl, exchangeVar)
            .catch(error => {
                return this.handleError(error, () =>
                    this.addNewExchangeVar(exchangeVar)
                );
            });
    }
    addNewExchangeVarforCC(exchangeVar: ExchangeVar){
        return this.http
        .post<ExchangeVar>(this.exchangeVarforCCUrl, exchangeVar)
        .catch(error => {
            return this.handleError(error, () =>
                this.addNewExchangeVarforCC(exchangeVar)
            );
        });
    }
    updateExchangeVar(exchangeVar: ExchangeVar, id) {
        return this.http
            .put<ExchangeVar>(`${this.exchangeVarUrl}/${id}`, exchangeVar)
            .catch(error => {
                return this.handleError(error, () =>
                    this.updateExchangeVar(exchangeVar, id)
                );
            });
    }
    updateExchangeVarCC(exchangeVar: ExchangeVar, id) {
        return this.http
            .put<ExchangeVar>(`${this.exchangeVarUrlCC}`, exchangeVar)
            .catch(error => {
                return this.handleError(error, () =>
                    this.updateExchangeVarCC(exchangeVar, id)
                );
            });
    }
    deleteExchangeVarEndpoint(id: number) {
        return this.http
            .delete<ExchangeVar>(`${this.exchangeVarUrl}/${id}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.deleteExchangeVarEndpoint(id)
                );
            });
    }

    getInitialEndpoint() {
        return this.http.get(`${this.transferItem_init_url}`).catch(error => {
            return this.handleError(error, () => this.getInitialEndpoint());
        });
    }

    getItemUnitsEndpoint(id) {
        let data = { 'id': id };
        let headers = this.getRequestHeaders()
        headers['params'] = data
        ///api/itemUnit/itemUnitsByItemId
        return this.http.get(`${this.itemUnitsByItemIdUrl}`, headers).catch(error => {
            return this.handleError(error, () => this.getInitialEndpoint());
        });
    }

    getAccounts() {
        return this.http.get(`${this.exchangeVarUrl}`);
    }
}
