import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef,
    Input
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import * as XLSX from "xlsx";
import { element, by } from "protractor";
import { VatTypeInterface, VatType } from "../models/vat-type.model";
import { VatTypeModalComponent } from "./vat-type-modal/vat-type-info.component";
import { VatTypeService } from "../services/vattype.service";

@Component({
    selector: "app-vat-type",
    templateUrl: "./vat-type.component.html",
    styleUrls: ["./vat-type.component.css"]
})
export class VatTypeComponent implements OnInit {
    editingName: { name: string };
    sourceVatType: VatTypeInterface;
    editedVatType: VatTypeInterface;
    rows: VatTypeInterface[] = [];
    excelLabel: string = 'Item Category';

    rowsCache: VatTypeInterface[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "shared.index",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        name: {
            title: this.gT("shared.name"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        defaultValue: {
            title: this.gT("shared.defaultValue"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        isDefaultDisplay: {
            title: '{{ "shared.isDefault" | translate }}',
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        isDefault: {
            title: "",
            order: 0,
            isVis: false
        },
        index: {
            title: "",
            order: 0,
            isVis: false
        }
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("vatTypeModalEditor")
    vatTypeModalEditor: VatTypeModalComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentegory")
    parentegory: TemplateRef<any>;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private vatTypeService: VatTypeService,
        private excelService: ExcelService
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
            { prop: "name", name: this.gT("shared.name"), width: 70 },
            {
                prop: "defaultValue",
                name: this.gT("shared.defaultValue"),
                width: 70
            },
            {
                prop: "isDefaultDisplay",
                name: this.gT("shared.isDefault"),
                width: 70
            }
        ];
        if (this.canManageVatType) {
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

    ngAfterViewInit() {
        this.vatTypeModalEditor.changesSavedCallback = () => {
            //this.addNewVatTypeToList();
            this.editorModal.hide();
            this.loadData();
        };

        this.vatTypeModalEditor.changesCancelledCallback = () => {
            this.editedVatType = null;
            this.sourceVatType = null;
            this.editorModal.hide();
        };
    }

    loadData() {
        //this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vatTypeService.getVatTypes().subscribe(
            vatTypes => {
                console.log(vatTypes);
                this.onDataLoadSuccessful(vatTypes), console.error(vatTypes);
            },
            error => {
                this.onDataLoadFailed(error);
            }
        );
    }

    onDataLoadSuccessful(vatTypes: VatType[]) {
        console.log(vatTypes);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        vatTypes.forEach((bt, index, vatTypecat) => {
            (<any>bt).index = index + 1;
            bt.isDefaultDisplay = bt.isDefault ?  this.gT("shared.yes")
            : this.gT("shared.no");
        });

        this.rowsCache = [...vatTypes];
        this.rows = vatTypes;
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

      /*  this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve vatTypecat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.name)
        );
    }

    addNewVatTypeToList() {
        if (this.sourceVatType) {
            Object.assign(this.sourceVatType, this.editedVatType);
            this.rows = [...this.rows];
            this.editedVatType = null;
            this.sourceVatType = null;
        } else {
            let vatTypecat = new VatType();
            Object.assign(vatTypecat, this.editedVatType);
            this.editedVatType = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>vatTypecat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, vatTypecat);
            this.rows.splice(0, 0, vatTypecat);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.vatTypeModalEditor.resetForm(true);
    }

    newVatType() {
        this.editingName = null;
        this.sourceVatType = null;
        // this.editedVatType = this.vatTypeModalEditor.newVatType();
        this.showModal();
    }

    editVatType(row: VatType) {
        this.editingName = { name: row.name };
        this.sourceVatType = row;
        // this.editedVatType = this.vatTypeModalEditor.editVatType(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { name: row.name };
        this.sourceVatType = row;
        this.vatTypeModalEditor.displayVatType(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteVatType(row: VatTypeInterface) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.name} ?`,
            DialogType.confirm,
            () => this.deleteVatTypeHelper(row)
        );
    }

    deleteVatTypeHelper(row: VatType) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.vatTypeService.deletevattype(row["id"]).subscribe(
            result => {
                console.log(result);
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(
                    vatType => vatType !== row
                );
                this.rows = this.rows.filter(vatType => vatType !== row);
            },
            error => {
            //    this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

            /*    this.alertService.showStickyMessage(
                    this.gT("messages.deleteError"),
                    `An error occured whilst deleting the vatTypecat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }

    get canManageVatType() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.vatTypeModalEditor.allVatTypeegoryParent,
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
