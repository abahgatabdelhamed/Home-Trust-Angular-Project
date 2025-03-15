
import {
    ReceiptDocument,
    ReceiptDocumentInterface
 } from "./../../../models/receipt-documents";
 import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
 import { Router } from "@angular/router";
 import { ReceiptDocService } from "../../sales/services/receipt-doc.service";
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
 
 import { AccountingTableInfoComponent } from './modal/accountingtree-modal.component';
 import Page from '../../definitions/models/page.model';
 import { Accounting } from "../../accounting/models/accounting.model";
 import { AccountingService } from "../../accounting/services/accounting.service";
 
 @Component({
    selector: "accounting-table",
    templateUrl: "./daily-advanced.component.html",
    styleUrls: ["./daily-advanced.component.css"]
 })
 export class AccountingTabelComponent {
    isVatReport = false;
    whatToLoad;
    isAdvanced = false;
    editingName: { code: string };
    sourceAccountingTabels: Accounting;
    editedAccountingTabels: Accounting;
    rows: Accounting[] = [];
    rowsCache: Accounting[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    page:Page = new Page(0, 0)
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
        name: {
            title: this.gT("shared.name"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        initialBalance: {
            title: this.gT("shared.initialBalance"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        defaultDisplay: {
            title: this.gT("shared.isDefault"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        personName: {
            title: this.gT("shared.personName"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        accountCategoryName: {
            title: this.gT("shared.accountCategoryName"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        accountTypeId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        accountCategoryId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        canBeDeleted: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        personId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        actualBalance: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        accountTypeName: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        isDefault: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
    };
 
    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;
 
    @ViewChild("editorModal")
    editorModal: ModalDirective;
 
    @ViewChild("dailyDocEditor")
    dailyDocEditor: AccountingTableInfoComponent;
 
    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;
 
    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;
     excelLabel: string = 'Accounts';
 
    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountingService: AccountingService,
        private excelService: ExcelService,
        private router: Router
    ) {}
 
    get canManageDocs() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }
 
    ngOnInit() {
        this.setType(this.router.url);
        this.columns = [
         {
             prop: "index",
             name: "#",
             width: 60
         },
         {
             prop: "name",
             name: this.gT("shared.name"),
             width: 70
         },
         {
             prop: "code",
             name: this.gT("shared.code"),
             width: 70
         },
         {
             prop: "initialBalance",
             name: this.gT("shared.initialBalance"),
             width: 70
         },
         {
             prop: "defaultDisplay",
             name: this.gT("shared.defaultDisplay"),
             width: 70
         },
         {
             prop: "personName",
             name: this.gT("shared.personName"),
             width: 70
         },
         {
             prop: "accountCategoryName",
             name: this.gT("shared.accountCategoryName"),
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
 
    setType(url) {
        switch (url) {
            case "/accounting/daily-advanced":
                this.whatToLoad = { name: "daily", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size };
                this.isAdvanced = true;
                break;
            case "/accounting/daily":
                this.whatToLoad = { name: "daily", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
                this.isAdvanced = false;
                break;
            case "/accounting/deposits":
                this.whatToLoad = { name: "deposits", type: 2 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
                this.isAdvanced = false;
                break;
            case "/accounting/receipts":
                this.whatToLoad = { name: "receipts", type: 3 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
                this.isAdvanced = false;
                break;
            case "/accounting/payments":
                this.whatToLoad = { name: "payments", type: 4 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
                this.isAdvanced = false;
                break;
            case "/accounting/vat-reports":
                this.whatToLoad = { name: "vat-reports", type: 5 };
                this.isAdvanced = false;
                this.isVatReport = true;
                console.log("vat report mode activated");
                break;
 
            default:
                break;
        }
    }
 
    ngAfterViewInit() {
        this.dailyDocEditor.changesSavedCallback = () => {
            this.addNewAccountingTabels();
            this.editorModal.hide();
            this.loadData();
        };
 
        this.dailyDocEditor.changesCancelledCallback = () => {
            // this.editAccountingTabels = null;
            this.sourceAccountingTabels = null;
            this.editorModal.hide();
        };
    }
 
    setPage(pageInfo:any){
     console.log(pageInfo)
     this.page.offset = pageInfo.offset;
     this.loadData();
 }
 
    loadData() {
 
      /*  this.alertService.startLoadingMessage();
        */this.loadingIndicator = true;
        this.loadingIndicator = true;/*
 */
     //   this.alertService.startLoadingMessage();
     console.log(this.page.size,this.page)
        this.accountingService.getAccountings('',this.page.offset+1,this.page.size).subscribe(
            accounting => {
                this.onDataLoadSuccessful(accounting.content)
                this.page.count = accounting.totalCount;
                console.log(this.page,accounting)
            //        console.error(accounting);
            },
            //error => this.onDataLoadFailed(error)
        );
    }
 
    onDataLoadSuccessful(sups: Accounting[]) {
        console.log("from server");
        console.log(sups);
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        
        sups.forEach((bt, index, sup) => {
            (<any>bt).index = bt.id + 1;
            bt['defaultDisplay'] = bt.isDefault? this.gT("shared.yes")
            : this.gT("shared.no");
         });
 
        this.rowsCache = [...sups];
        this.rows = sups;
    }
 
    onDataLoadFailed(error: any) {
        /*this.alertService.stopLoadingMessage();
      */  this.loadingIndicator = false;
 
        this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
    }
 
    onSearchChanged(value: string) {
       /* this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.name)
        );*/
        this.page.offset = 0;
        this.accountingService.getAccountings(value,this.page.offset+1,this.page.size).subscribe(
         accounting => {
             this.onDataLoadSuccessful(accounting.content)
         //        console.error(accounting);
         },
         //error => this.onDataLoadFailed(error)
     );
    }
 
    addNewAccountingTabels() {
        if (this.sourceAccountingTabels) {
            Object.assign(
                this.sourceAccountingTabels,
                this.editAccountingTabels
            );
            this.rows = [...this.rows];
            // this.editAccountingTabels = null;
            this.sourceAccountingTabels = null;
        } else {
            let itemcat = new Accounting();
            Object.assign(itemcat, this.editAccountingTabels);
            // this.editAccountingTabels = null;
 
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
 
    newAccountingTabels() {
        this.editingName = null;
        this.sourceAccountingTabels = null;
        this.editedAccountingTabels = this.dailyDocEditor.newAccounting();
        this.showModal();
    }
 
    editAccountingTabels(row: Accounting) {
        this.editingName = { code: row.code };
        this.sourceAccountingTabels = row;
        this.editedAccountingTabels = this.dailyDocEditor.editAccounting(
            row
        );
        this.editedAccountingTabels = this.dailyDocEditor.editAccounting(
            row
        );
        this.showModal();
    }
 
    onSelect(row) {
        console.log(row);
        this.editingName = { code: row.code };
        this.sourceAccountingTabels = row;
        this.dailyDocEditor.displayAccounting(row);
        this.showModal();
    }
 
    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }
 
    deleteAccountingTabels(row: Accounting) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.code + '"?',
            DialogType.confirm,
            () => this.deleteAccountingTabelsHelper(row)
        );
    }
 
    deleteAccountingTabelsHelper(row: Accounting) {
        //this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.accountingService.deleteAccounting(row["id"]).subscribe(
            results => {
         //       this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(sup => sup !== row);
                this.rows = this.rows.filter(sup => sup !== row);
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
 
        /*        this.alertService.showStickyMessage(
                    "Delete Error",
                    `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }
 
    get canManageAccountingTabels() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }
 
    transformDataToModal() {
        Object.assign(
            this.dailyDocEditor.allAccountingegoryParent,
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
    async exportAsXLSX() {
        let exportedRows: any[] = [];
        let temp
        temp= await this.accountingService.getAccountings('',-1,-1).toPromise()
       // Object.assign(exportedRows, this.rows);
       exportedRows=temp.content
       exportedRows.forEach((e,index) =>{
         e.index=index+1
       })
       console.log(exportedRows)
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
 