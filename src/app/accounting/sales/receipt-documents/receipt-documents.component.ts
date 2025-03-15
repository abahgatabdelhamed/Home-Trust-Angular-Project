import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ReceiptDocument } from "../../../models/receipt-documents";
import {
    AlertService,
    MessageSeverity,
    DialogType
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { AccountService } from "../../../services/account.service";
import { ExcelService } from "../../../services/excel.service";
import { Router } from "@angular/router";
import { Utilities } from "../../../services/utilities";
import * as XLSX from "xlsx";

import { Permission } from "../../../models/permission.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ReceiptDocumentInfoComponent } from "./modal/receipt-doc-info.component";
import { ReceiptDocService } from "../services/receipt-doc.service";

@Component({
    selector: "app-receipt-documents",
    templateUrl: "./receipt-documents.component.html",
    styleUrls: ["./receipt-documents.component.css"]
})
export class ReceiptDocumentsComponent implements OnInit {
    isReceiptDocumentMode: boolean = true;
    editingName: { code: string };
    sourceReceiptDocument: ReceiptDocument;
    editedReceiptDocument: ReceiptDocument;
    excelLabel = 'Receipt Document'
    rows: ReceiptDocument[] = [];
    rowsCache: ReceiptDocument[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        index: {
            title: this.gT("shared.Index"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        code: {
            title: this.gT("shared.code"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        fax: {
            title: this.gT("shared.fax"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        mobile: {
            title: this.gT("shared.mobile"),
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatNumber: {
            title: this.gT("shared.vatNumber"),
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        neighborhood: {
            title: this.gT("shared.neighborhood"),
            order: 0,
            excel_cell_header: "",
            isVis: false
        }
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("receiptEditor")
    receiptEditor: ReceiptDocumentInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private receiptService: ReceiptDocService,
        private excelService: ExcelService,
        private router: Router
    ) {}

    ngOnInit() {
        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 60,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            {
                prop: "fromAccount.name",
                name: this.gT("shared.from"),
                width: 70
            },
            { prop: "toAccount.name", name: this.gT("shared.to"), width: 70 },
            {
                prop: "amount",
                name: this.gT("shared.amount"),
                width: 70
            },
            {
                prop: "code",
                name: this.gT("shared.code"),
                width: 70
            },
            {
                prop: "date",
                name: this.gT("shared.date"),
                width: 70
            }
        ];
        if (this.canManageReceiptDocument) {
            this.columns.push({
                name: "",
                width: 200,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false
            });
        }
        this.rows = [
            {
                id: 0,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            },
            {
                id: 1,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            },
            {
                id: 2,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            },
            {
                id: 3,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            },
            {
                id: 4,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            },
            {
                id: 5,
                code: "1111",
                amount: 1000,
                notes: "notes",
                fromAccount: { id: 0, name: "Ahmed" },
                toAccount: { id: 1, name: "Samer" },
                date: new Date()
            }
        ];
        this.rows.forEach((bt, index, sup) => {
            (<any>bt).index = bt.id + 1;
        });
        // this.loadData();
    }

    ngAfterViewInit() {
        this.receiptEditor.changesSavedCallback = () => {
            this.addNewReceiptDocument();
            this.editorModal.hide();
            this.loadData();
        };

        this.receiptEditor.changesCancelledCallback = () => {
            // this.editReceiptDocument = null;
            this.sourceReceiptDocument = null;
            this.editorModal.hide();
        };
    }

    loadData() {
         //this.alertService.startLoadingMessage();
         //this.loadingIndicator = true;
         //this.receiptService
         //    .getReceiptDocs(1)
         //    .subscribe(res => this.onDataLoadSuccessful(res));
         //  this.receiptService.getReceiptDocument(whatToLoad).subscribe(
         //      sups => {
         //          this.onDataLoadSuccessful(sups), console.error(sups);
         //      },
         //      err => this.onDataLoadFailed(err)
         //  );
    }

    onDataLoadSuccessful(sups: ReceiptDocument[]) {
        console.log("from server sups ");
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        sups.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
        });

        this.rowsCache = [...sups];
        this.rows = sups;
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

       /* this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.code)
        );
    }

    addNewReceiptDocument() {
        if (this.sourceReceiptDocument) {
            Object.assign(this.sourceReceiptDocument, this.editReceiptDocument);
            this.rows = [...this.rows];
            // this.editReceiptDocument = null;
            this.sourceReceiptDocument = null;
        } else {
            let itemcat = new ReceiptDocument();
            Object.assign(itemcat, this.editReceiptDocument);
            // this.editReceiptDocument = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>itemcat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, itemcat);
            this.rows.splice(0, 0, itemcat);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.receiptEditor.resetForm(true);
    }

    newReceiptDocument() {
        this.editingName = null;
        this.sourceReceiptDocument = null;
        this.editedReceiptDocument = this.receiptEditor.newReceiptDocument();
        this.showModal();
    }

    editReceiptDocument(row: ReceiptDocument) {
        this.editingName = { code: row.code };
        this.sourceReceiptDocument = row;
        this.editedReceiptDocument = this.receiptEditor.editReceiptDocument(
            row
        );
        this.editedReceiptDocument = this.receiptEditor.editReceiptDocument(
            row
        );
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { code: row.code };
        this.sourceReceiptDocument = row;
        this.receiptEditor.displayReceiptDocument(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteReceiptDocument(row: ReceiptDocument) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.code + '"?',
            DialogType.confirm,
            () => this.deleteReceiptDocumentHelper(row)
        );
    }

    deleteReceiptDocumentHelper(row: ReceiptDocument) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        //   this.receiptService.deleteReceiptDocument(row['id']).subscribe(
        //       results => {
        //           this.alertService.stopLoadingMessage();
        //           this.loadingIndicator = false;
        //           this.rowsCache = this.rowsCache.filter(sup => sup !== row);
        //           this.rows = this.rows.filter(sup => sup !== row);
        //       },
        //       error => {
        //           this.alertService.stopLoadingMessage();
        //           this.loadingIndicator = false;

        //           this.alertService.showStickyMessage(
        //               "Delete Error",
        //               `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
        //                   error
        //               )}"`,
        //               MessageSeverity.error,
        //               error
        //           );
        //       }
        //   );
    }

    get canManageReceiptDocument() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.receiptEditor.allReceiptDocumentegoryParent,
            this.rowsCache
        );
    }
    getRemovedHeadersArray() {
        let list: string[] = [];
        for (var key in this.headers) {
            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }
        return list;
    }

    getOrderedHeadersArray() {
        let list: string[] = [];
        let counter: number = 1;
        while (true) {
            let isFounded: boolean = false;
            for (var key in this.headers) {
                if (this.headers[key].order == counter) {
                    list.push(key);
                    isFounded = true;
                    break;
                }
            }
            if (!isFounded) {
                break;
            }
            counter++;
        }
        return list;
    }
    exportAsXLSX(): void {
        let exportedRows: any[] = [];
        Object.assign(exportedRows, this.rows);
        let removedKeyArr: string[] = this.getRemovedHeadersArray();
        for (var removedKey of removedKeyArr) {
            for (var row of exportedRows) {
                delete row[removedKey];
            }
        }
        let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            exportedRows,
            { header: orderedKeyArr }
        );
        for (var key in this.headers) {
            if (
                this.headers[key].isVis &&
                this.headers[key].excel_cell_header != ""
            ) {
                worksheet[this.headers[key].excel_cell_header].v = this.headers[
                    key
                ].title;
            }
        }

        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
    }
}
