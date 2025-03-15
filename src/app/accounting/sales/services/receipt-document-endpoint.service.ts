import { ReceiptDocument } from "./../../../models/receipt-documents";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { type } from "os";

@Injectable()
export class ReceiptDocEndpoint extends EndpointFactory {
    // For taha Edit
    private baseUrl1 = this.configurations.baseUrl
    private readonly _reciptDocUrl: string =
        "/api/receiptDocument/receiptDocuments";
    private readonly _balanceUrl: string = "/api/accounting/accounting/getByPersonId";

    get reciptDocUrl() {
        return this.configurations.baseUrl + this._reciptDocUrl;
    }

    get balanceUrl() {
        return this.configurations.baseUrl + this._balanceUrl;
    }

    getAllReceiptDocsEndpoint(typeId: number, query:string ,page:number, pageSize:number) {
        return this.http
            .get(`${this.reciptDocUrl}/?type=${typeId}&query=${query}&pageNumber=${page}&pageSize=${pageSize}`)
    }

    addNewReceiptDoc(reciptDoc: ReceiptDocument) {
        return this.http
            .post<ReceiptDocument>(this.reciptDocUrl, reciptDoc)
            .catch(error => {
                return this.handleError(error, () =>
                    this.addNewReceiptDoc(reciptDoc)
                );
            });
    }

    getPersonBalance(id) {
        return this.http.get(`${this.balanceUrl}?id=${id}`);
    }

    updateReceiptDoc(reciptDoc: ReceiptDocument, id) {
        return this.http
            .put<ReceiptDocument>(`${this.reciptDocUrl}/${id}`, reciptDoc)
            .catch(error => {
                return this.handleError(error, () =>
                    this.updateReceiptDoc(reciptDoc, id)
                );
            });
    }

    updateAdvancedDocs(reciptDoc: ReceiptDocument[], id) {
        return this.http
            .put<ReceiptDocument>(
                `${this.reciptDocUrl}/advanced/${id}`,
                reciptDoc
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.updateAdvancedDocs(reciptDoc, id)
                );
            });
    }
    addAdvancedDocs(reciptDoc: ReceiptDocument[]) {
        return this.http
            .post<ReceiptDocument>(`${this.reciptDocUrl}/Advanced`, reciptDoc)
            .catch(error => {
                return this.handleError(error, () =>
                    this.addAdvancedDocs(reciptDoc)
                );
            });
    }

    deleteReceiptDocEndpoint(id: number) {
        return this.http
            .delete<ReceiptDocument>(`${this.reciptDocUrl}/${id}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.deleteReceiptDocEndpoint(id)
                );
            });
    }

    getInitialEndpoint() {
        return this.http.get(`${this.baseUrl1}/api/receiptDocument/init`).catch(error => {
            return this.handleError(error, () => this.getInitialEndpoint());
        });
    }

    getAccounts() {
        return this.http.get(`${this.reciptDocUrl}`);
    }
}
