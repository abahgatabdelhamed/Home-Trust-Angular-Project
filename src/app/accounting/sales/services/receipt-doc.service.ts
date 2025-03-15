import { ReceiptDocument } from "./../../../models/receipt-documents";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ReceiptDocEndpoint } from "./receipt-document-endpoint.service";

@Injectable()
export class ReceiptDocService {
    constructor(private receiptDocEndpoint: ReceiptDocEndpoint) {}

    newReceiptDoc(receiptDoc: ReceiptDocument) {
        return this.receiptDocEndpoint.addNewReceiptDoc(receiptDoc);
    }

    updateReceiptDoc(receiptDoc: ReceiptDocument) {
        return this.receiptDocEndpoint.updateReceiptDoc(
            receiptDoc,
            receiptDoc["id"]
        );
    }



    updateAdvancedDocs(receiptDocs: ReceiptDocument[], id) {
        return this.receiptDocEndpoint.updateAdvancedDocs(receiptDocs, id);
    }

    addAdvabcedDocs(receiptsDocs: ReceiptDocument[]) {
        return this.receiptDocEndpoint.addAdvancedDocs(receiptsDocs);
    }

    getPersonBalance(id) {
        return this.receiptDocEndpoint.getPersonBalance(id);
    }

    getReceiptDocs(typeId: number, query:string = '', page:number = 1, pageSize:number = 50) {
        return this.receiptDocEndpoint.getAllReceiptDocsEndpoint(typeId, query, page, pageSize);
    }

    deleteReceiptDoc(receiptDocOrReceiptDocId: number) {
        return this.receiptDocEndpoint.deleteReceiptDocEndpoint(
            receiptDocOrReceiptDocId
        );
    }

    getAccounts() {
        return this.receiptDocEndpoint.getAccounts();
    }

    getInitial() {
        return this.receiptDocEndpoint.getInitialEndpoint();
    }
}
