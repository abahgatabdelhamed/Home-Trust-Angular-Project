import { ReceiptDocument } from "./../../../models/receipt-documents";
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { ReceiptDocService } from "../../sales/services/receipt-doc.service";
import { saveAs } from 'file-saver';

import * as XLSX from "xlsx";
import { Utilities } from "../../../services/utilities";
import {
    AlertService,
    MessageSeverity,
    DialogType
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { DailyDocumentInfoComponent } from "./modal/daily-advanced-info.component";
import { PDFService } from "../services/pdf.service";
import Page from "../../definitions/models/page.model";


@Component({
    selector: "daily-advanced",
    templateUrl: "./daily-advanced.component.html",
    styleUrls: ["./daily-advanced.component.css"]
})
export class DailyAdvancedDocComponent {
    isShowMode:boolean=false
    isVatReport = false;
    dataNeverExist = false;
    whatToLoad;
    isSale = false;
    isAdvanced = false;
    editingName: { code: string };
    sourceDailyAdvancedDocs: ReceiptDocument;
    excelLabel = 'Receipt Document'
    editedDailyAdvancedDocs: ReceiptDocument;
    rows: ReceiptDocument[] = [];
    rowsCache: ReceiptDocument[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    page:Page = new Page(0, 0);
    query = ''

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
        fromAccountDisplay: {
            title: this.gT("shared.fromAccount"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        toAccountDisplay: {
            title: this.gT("shared.toAccount"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        amount: {
            title: this.gT("shared.amount"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        code: {
            title: this.gT("shared.code"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        dateDisplay: {
            title: this.gT("shared.date"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        createdDate: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        date: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        notes: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        receiptDocumentAccounts: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        receiptDocumentBills: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        receiptDocumentType: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        receiptDocumentTypeCode: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        receiptDocumentTypeId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        toAccount: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        toAccountId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        updatedBy: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        updatedDate: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        fromAccount: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        createdBy: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        fromAccountId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        dueAmount:{
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        }
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;


    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("dailyDocEditor")
    dailyDocEditor: DailyDocumentInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;
    ispayment: boolean=false;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private dailyDocService: ReceiptDocService,
        private excelService: ExcelService,
        private router: Router,
        private pdfService: PDFService
    ) {}

    get canManageDocs() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    get canDeleteSBill() {
        let perm = this.accountService.userHasPermission(
            Permission.deleteBillPermission
        );
        return perm
    }


    setPage(pageInfo:any){
        console.log(pageInfo)
        this.page.offset = pageInfo.offset;
        this.loadData();
    }

    ngOnInit() {
     //   console.log(this.dailyDocEditor);
        this.setType(this.router.url);
        this.columns = [
            {
                prop: "index",
                name: this.gT("shared.index"),
                width: 60
            },
            {
                prop: "fromAccount.name",
                name: this.ispayment?this.gT("shared.paymentMethodelogy"):this.gT("shared.fromAccount"),
                width: 70
            },
            {
                prop: "toAccount.name",
                name: this.ispayment?this.gT("shared.supplierName"):this.gT("shared.toAccount"),
                width: 70
            },
            { prop: "amount", name: this.gT("shared.amount"), width: 70 },
            {
                prop: "code",
                name: this.gT("shared.code"),
                width: 70
            },
            {
                prop: "dateDisplay",
                name: this.gT("shared.date"),
                width: 70
            }
        ];
        if (this.canManageDocs) {
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
        this.loadData();
    }

    exportAsPDF() {

    }

    setType(url) {
        switch (url) {
            case "/accounting/daily-advanced":
                this.whatToLoad = { name: "daily", type: "DAILY", printerLabel:"قيد يومية" };
                this.isAdvanced = true;
                break;
            case "/accounting/daily":
                this.whatToLoad = { name: "daily", type: "DAILY", printerLabel:"قيد يومية" };
                this.isAdvanced = false;
                break;
            case "/accounting/deposits":
                this.whatToLoad = { name: "deposits", type: "DEPOSITS", printerLabel:"قيد إيداع و سحب" };
                this.isAdvanced = false;
                break;
            case "/accounting/receipts":
                this.whatToLoad = { name: "receipts", type: "RECEIPTSDOCUMENTS", printerLabel:"قيد مقبوضات" };
                this.isAdvanced = false;
                break;
            case "/accounting/payments":
                this.whatToLoad = { name: "payments", type: "PAYMENTS", printerLabel:"قيد مدفوعات" };
                this.isAdvanced = false;
                break;
            case "/accounting/receipt-documents":
                this.whatToLoad = {
                    name: "receipt-documents", type: "SALERECEIPT", printerLabel:"سند القبض" };
                this.isAdvanced = false;
                this.isSale = true;
                this.excelLabel = 'Sale Receipt Document';
                break;
            
            case "/accounting/payment-documents":
                    this.whatToLoad = {
                        name: "payment-documents", type: "PAYMENTRECEIPT", printerLabel:"سند دفع" };
                    this.isAdvanced = false;
                    this.isSale = true;
                    this.ispayment=true
                    this.excelLabel = 'Payment  Document';
                    break;
                default:
                    break;
        }
    }

    ngAfterViewInit() {
        this.dailyDocEditor.changesSavedCallback = () => {
            // this.addNewDailyAdvancedDocs();
            this.editorModal.hide();
            this.isShowMode=false
            this.loadData();
        };

        this.dailyDocEditor.changesCancelledCallback = () => {
            this.editedDailyAdvancedDocs = null;
            this.sourceDailyAdvancedDocs = null;
            this.editorModal.hide();
            this.isShowMode=false
            this.editorModal.hide();
        };
    }

    loadData() {
       // this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.dailyDocService
            .getReceiptDocs(this.whatToLoad["type"], this.query,this.page.offset + 1, this.page.size)
            .subscribe(st => {
                this.onDataLoadSuccessful(st);
            });
    }

    onDataLoadSuccessful(sups) {
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.page.count = sups.totalCount;
        sups = sups.content;
        sups.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            (<any>bt)['date'] = new Date(bt.date);
            bt["dateDisplay"] = this.formatDate(new Date(bt.date));
            if(bt.fromAccount)
            bt["fromAccountDisplay"] = bt.fromAccount.name;
            bt["toAccountDisplay"] = bt.toAccount.name;
            if(bt.fromAccount)
            bt.fromAccountId = bt.fromAccount.id;
            bt.toAccountId = bt.toAccount.id;
        });
        this.rowsCache = [...sups];
        this.rows = sups;
        this.dataNeverExist = (this.rows.length == 0);

    }

    formatDate(date: Date) {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    onDataLoadFailed(error: any) {
       // this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

       /* this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

    onSearchChanged(value: string) {
       this.page.offset = 0;
       this.query = value;
       this.loadData();
    }

    addNewDailyAdvancedDocs() {
        if (this.sourceDailyAdvancedDocs) {
            Object.assign(
                this.sourceDailyAdvancedDocs,
                this.editDailyAdvancedDocs
            );
            this.rows = [...this.rows];
            this.editDailyAdvancedDocs = null;
            this.sourceDailyAdvancedDocs = null;
        } else {
            let itemcat = new ReceiptDocument();
            Object.assign(itemcat, this.editDailyAdvancedDocs);
            this.editDailyAdvancedDocs = null;

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
        this.dailyDocEditor.resetForm(true);
    }
    newDailyAdvancedDocs() {
        this.editingName = null;
        this.sourceDailyAdvancedDocs = null;
        this.editedDailyAdvancedDocs = this.dailyDocEditor.newDailyDocument();
        this.showModal();
    }

    editDailyAdvancedDocs(row: ReceiptDocument) {
        this.editingName = { code: row.code };
        this.sourceDailyAdvancedDocs = row;
        this.editedDailyAdvancedDocs = this.dailyDocEditor.editDailyDocument(
            row
        );
        this.showModal();
    }

    onSelect(row) {
        this.isShowMode=true
        console.log(row);
        this.editingName = { code: row.code };
        this.sourceDailyAdvancedDocs = row;
        this.dailyDocEditor.displayDailyDocument(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteDailyAdvancedDocs(row: ReceiptDocument) {
        this.alertService.showDialog(
            `هل أنت متأكد من حذف السند؟ حذفك للسند قد يسبّب مشاكل في شجرة الحسابات.   ${row.code} ?`,

            DialogType.confirm,
            () => this.deleteDailyAdvancedDocsHelper(row)
        );
    }

    deleteDailyAdvancedDocsHelper(row: ReceiptDocument) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.dailyDocService.deleteReceiptDoc(row["id"]).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(sup => sup !== row);
                this.rows = this.rows.filter(sup => sup !== row);
            },
            error => {
              //  this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                /*this.alertService.showStickyMessage(
                    this.gT("messages.deleteError"),
                    `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }

    get canManageDailyAdvancedDocs() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;

    }

    transformDataToModal() {
        Object.assign(
            this.dailyDocEditor.allDailyDocumentegoryParent,
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

        for(var keyRow in this.rows[0]){
            for(var keyHeader in this.headers){
                if(keyRow === keyHeader ){
                    break
                }
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

    getAllDataToExport(){
        return this.dailyDocService
            .getReceiptDocs(this.whatToLoad["type"], '',-1, this.page.size)
            .toPromise().then(st => st['content']);
    }

    async exportAsXLSX() {
        let exportedRows =  []
        this.loadingIndicator = true;
        exportedRows = await this.getAllDataToExport()
        exportedRows.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            (<any>bt)['date'] = new Date(bt.createdDate);
            bt["dateDisplay"] = this.formatDate(new Date(bt.date));
            bt["fromAccountDisplay"] = bt.fromAccount.name;
            bt["toAccountDisplay"] = bt.toAccount.name;
            bt.fromAccountId = bt.fromAccount.id;
            bt.toAccountId = bt.toAccount.id;
        });
         console.log('emit',exportedRows)
       this.loadingIndicator=false;

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
                worksheet[this.headers[key].excel_cell_header].v =
                this.headers[
                    key
                ].title;
            }
        }
        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
        this.query = '';
        this.loadData();
    }
}
