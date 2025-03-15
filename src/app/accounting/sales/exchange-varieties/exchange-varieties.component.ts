import { ExchangeVar } from "./../../../models/exchange-varieties";
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { ExchangeVarService } from "../../sales/services/exchange-varieties.service";
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
import { ExchangeVarietiesInfoComponent } from "./modal/exchange-varieties-info.component";
import { PDFService } from "../../shared/services/pdf.service";
import { StatmentsService } from "../../permissions/services/statments.service";
import { AssetService } from "../../accounting/services/asset.service";
import { e } from "@angular/core/src/render3";

@Component({
    selector: 'app-exchange-varieties',
    templateUrl: './exchange-varieties.component.html',
    styleUrls: ['./exchange-varieties.component.css']
})
export class ExchangeVarietiesComponent implements OnInit {
    isVatReport = false;
    dataNeverExist = false;
    whatToLoad;
    isSale = false;
    isAdvanced = false;
    editingName: { code: string };
    sourceDailyAdvancedDocs: ExchangeVar;
    excelLabel = 'Receipt Document'
    editedDailyAdvancedDocs: ExchangeVar;
    rows: ExchangeVar[] = [];
    rowsCache: ExchangeVar[] = [];
    columns: any[] = [];
    isCC:boolean=false
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers:any = {
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
        fromBranchDisplay: {
            title: this.gT("shared.fromBranch"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        toBranchDisplay: {
            title: this.gT("shared.toBranch"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        quantity: {
            title: this.gT("shared.quantity"),
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
        receiptDocumentBranchs: {
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
        toBranch: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        toBranchId: {
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
        fromBranch: {
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
        fromBranchId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
    };
    headersCC = {
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
        fromCostCenter: {
            title: this.gT("shared.fromCC"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        branch: {
            title: this.gT("shared.toBranch"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        
        item: {
            title: this.gT("shared.item"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        itemUnit: {
            title: this.gT("shared.itemUnit"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        quantity: {
            title: this.gT("shared.quantity"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        dateDisplay: {
            title: this.gT("shared.date"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        itemId: {
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
        costCenterId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        branchId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        

    }
    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;


    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("exchangeVarEditor")
    exchangeVarEditor: ExchangeVarietiesInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    setType(url){
       switch (url){
           case '/sales/convert-cc':{
                this.isCC=true
           }
       }
    }
    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private exchangeVarService: ExchangeVarService,
        private excelService: ExcelService,
        private router: Router,
        private pdfService: PDFService,
        private servicecc:AssetService
    ) { }

    get canManageDocs() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }
    ngOnInit() {
        this.setType(this.router.url)
        console.log(this.exchangeVarEditor);
        this.isCC?
        this.columns = [
            {
                prop: "index",
                name: this.gT("shared.index"),
                width: 60
            },
            {
                prop: "fromCostCenter",
                name: this.gT("shared.fromCC"),
                width: 70
            },
            
            {
                prop: "branch",
                name: this.gT("shared.toBranch"),
                width: 70
            },
           
            {
                prop: "item",
                name: this.gT("shared.item"),
                width: 70
            },
            {
                prop: "itemUnit",
                name: this.gT("shared.itemUnit"),
                width: 70
            },
            {
                prop: "quantity",
                name: this.gT("shared.quantity"),
                width: 70
            },
            {
                prop: "dateDisplay",
                name: this.gT("shared.date"),
                width: 70
            }
        ]

        :
        this.columns = [
            {
                prop: "index",
                name: this.gT("shared.index"),
                width: 60
            },
            {
                prop: "fromBranch.name",
                name: this.gT("shared.fromBranch"),
                width: 70
            },
            {
                prop: "toBranch.name",
                name: this.gT("shared.toBranch"),
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

    ngAfterViewInit() {
        this.exchangeVarEditor.changesSavedCallback = () => {
            // this.addNewDailyAdvancedDocs();
            this.editorModal.hide();
            this.loadData();
        };

        this.exchangeVarEditor.changesCancelledCallback = () => {
            this.editedDailyAdvancedDocs = null;
            this.sourceDailyAdvancedDocs = null;
            this.editorModal.hide();
        };
    }

    loadData() {
        console.log(this.isCC)
       // this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
       this.isCC? 
       this.exchangeVarService
            .getExchangeVarsforCC()
            .subscribe(st => {
                this.onDataLoadSuccessful(st);
            })
       : this.exchangeVarService
            .getExchangeVars()
            .subscribe(st => {
                this.onDataLoadSuccessful(st);
            });
        
    }

    onDataLoadSuccessful(sups: ExchangeVar[]) {
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        sups.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            (<any>bt)['date'] = new Date(bt.date);
            bt["dateDisplay"] = this.formatDate(new Date(bt.date));
            if(this.isCC){
                 bt['costCenterId']=bt.fromCostCenter.id
                  bt['fromCostCenter']=bt.fromCostCenter.nameAr
                  bt['itemId']=bt.item.id
                  bt['item']=bt.item.nameAr
                 bt['itemUnitId']=bt.itemUnit.id
                 bt['itemUnit']=bt.itemUnit.name
                 bt['branchId']=bt.branch.id
                 bt['branch']=bt.branch.name
                 
            }
            else{
            bt["fromBranchDisplay"] = bt.fromBranch.name;
            bt["toBranchDisplay"] = bt.toBranch.name;
            bt.fromBranchId = bt.fromBranch.id;
            bt.toBranchId = bt.toBranch.id
            }
         
        });
        this.rowsCache = [...sups];
        this.rows = sups;
        this.dataNeverExist = (this.rows.length == 0);

    }

    formatDate(date: Date) {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
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
        this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.code)
        );
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
            let itemcat = new ExchangeVar();
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
        this.exchangeVarEditor.resetForm(true);
    }
    newDailyAdvancedDocs() {
        this.editingName = null;
        this.sourceDailyAdvancedDocs = null;
        this.editedDailyAdvancedDocs = this.exchangeVarEditor.newDailyDocument();
        this.showModal();
    }

    editDailyAdvancedDocs(row: ExchangeVar) {
        this.editingName = { code: row.code };
        this.sourceDailyAdvancedDocs = row;
        this.editedDailyAdvancedDocs = this.exchangeVarEditor.editDailyDocument(
            row
        );
        console.log("row=",row)
        this.showModal();
    }

    onSelect(row) {
        console.log(row);
        this.editingName = { code: row.code };
        this.sourceDailyAdvancedDocs = row;
        this.exchangeVarEditor.displayDailyDocument(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteDailyAdvancedDocs(row: ExchangeVar) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.code} ?`,

            DialogType.confirm,
            () => this.deleteDailyAdvancedDocsHelper(row)
        );
    }

    deleteDailyAdvancedDocsHelper(row: ExchangeVar) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.exchangeVarService.deleteExchangeVar(row["id"]).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(sup => sup !== row);
                this.rows = this.rows.filter(sup => sup !== row);
            },
            error => {
             //   this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

             /*   this.alertService.showStickyMessage(
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
            this.rowsCache
        );
    }
    getRemovedHeadersArray() {

        let list: string[] = [];
        if(this.isCC){

            for (var key in this.headersCC) {

                if (this.headersCC[key].isVis == false) {
                    list.push(key);
                }
            }
    
            for (var keyRow in this.rows[0]) {
                for (var keyHeader in this.headersCC) {
                    if (keyRow === keyHeader) {
                        break
                    }
                }
            }
        }else{

            for (var key in this.headers) {

                if (this.headers[key].isVis == false) {
                    list.push(key);
                }
            }
    
            for (var keyRow in this.rows[0]) {
                for (var keyHeader in this.headers) {
                    if (keyRow === keyHeader) {
                        break
                    }
                }
            }
        }
        return list;
    }

    getOrderedHeadersArray() {
        let list: string[] = [];
        let counter: number = 1;
        if(this.isCC){
            while (true) {
                let isFounded: boolean = false;
                for (var key in this.headersCC) {
                    if (this.headersCC[key].order == counter) {
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
        }else{
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
        if(this.isCC){
            for (var key in this.headersCC) {
                if (
                    this.headersCC[key].isVis &&
                    this.headersCC[key].excel_cell_header != ""
                ) {
                    worksheet[this.headersCC[key].excel_cell_header].v = this.headersCC[
                        key
                    ].title;
                }
            }
        }else{
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
        }
       
        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
        this.loadData();
    }
}
