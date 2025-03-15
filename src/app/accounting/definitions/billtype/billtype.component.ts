import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService } from "../../../services/account.service";
import { BillTypeService } from "../services/billtype.service";
import { Utilities } from "../../../services/utilities";
import { Permission } from '../../../models/permission.model';
import { BillType } from '../models/billtype.model';
import { BillTypeInfoComponent } from "./modal/billtype-info.component";


@Component({
    selector: 'billtype',
    templateUrl: './billtype.component.html',
    styleUrls: ['./billtype.component.css']
})
export class BillTypeComponent implements OnInit, AfterViewInit {

    editingName: { name: string };
    sourceBillType: BillType;
    editedBillType: BillType;
    rows: BillType[] = [];
    rowsCache: BillType[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('billtypeEditor')
    billtypeEditor: BillTypeInfoComponent;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private billtypeService: BillTypeService) {
    }

    ngOnInit() {

        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 60, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'name', name: gT('billtypes.management.Name'), width: 90 },
            { prop: 'code', name: gT('shared.code'), width: 90 }
        ];
        if (this.canManageBillType)
            this.columns.push({ name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });
        this.loadData();
    }

    ngAfterViewInit() {

        this.billtypeEditor.changesSavedCallback = () => {
            this.addNewBillTypeToList();
            this.editorModal.hide();
        };

        this.billtypeEditor.changesCancelledCallback = () => {
            this.editedBillType = null;
            this.sourceBillType = null;
            this.editorModal.hide();
        };
    }

    loadData() {
        //this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.billtypeService.getBillTypes().subscribe(billtype => this.onDataLoadSuccessful(billtype), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(billtype: BillType[]) {
        //this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        billtype.forEach((bt, index, billtype) => {
            (<any>bt).index = index + 1;
        });

        this.rowsCache = [...billtype];
        this.rows = billtype;
    }

    onDataLoadFailed(error: any) {
       // this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        /*this.alertService.showStickyMessage(this.gT("messages.loadError"), `Unable to retrieve billtype from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    */}

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name));
    }

    addNewBillTypeToList() {
        if (this.sourceBillType) {
            Object.assign(this.sourceBillType, this.editedBillType);

            this.editedBillType = null;
            this.sourceBillType = null;
        }
        else {
            let billtype = new BillType();
            Object.assign(billtype, this.editedBillType);
            this.editedBillType = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u) != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>billtype).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, billtype);
            this.rows.splice(0, 0, billtype);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.billtypeEditor.resetForm(true);
    }

    newBillType() {
        this.editingName = null;
        this.sourceBillType = null;
        this.editedBillType = this.billtypeEditor.newBillType();
        this.editorModal.show();
    }

    editBillType(row: BillType) {
        this.editingName = { name: row.name };
        this.sourceBillType = row;
        this.editedBillType = this.billtypeEditor.editBillType(row);
        this.editorModal.show();
    }

    deleteBillType(row: BillType) {
        this.alertService.showDialog('Are you sure you want to delete \"' + row.name + '\"?', DialogType.confirm, () => this.deleteBillTypeHelper(row));
    }

    deleteBillTypeHelper(row: BillType) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;
        this.billtypeService.deleteBillType(row.id)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
                error => {
                  //  this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;

                    /*this.alertService.showStickyMessage(this.gT("messages.deleteError"), `An error occured whilst deleting the billtype.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                */});

    }

    get canManageBillType() {
        //return this.accountService.userHasPermission(Permission.manageBillTypePermission);
        return true;
    }
}
