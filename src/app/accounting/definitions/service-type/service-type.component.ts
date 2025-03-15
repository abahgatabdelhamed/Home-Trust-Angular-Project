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
import { element } from "protractor";
import { Router } from "@angular/router";
import { ServiceType } from "../../sales/models/service-type.model";
import { ServiceTypeService } from "../services/service-type.service";
import { ServiceTypeInfoComponent } from "./modal/service-type-info.component";

@Component({
    selector: "service-type",
    templateUrl: "./service-type.component.html",
    styleUrls: ["./service-type.component.css"]
})
export class ServiceTypeComponent implements OnInit, AfterViewInit {
    editingName: { name: string };
    sourceServiceType: ServiceType;
    editedServiceType: ServiceType;
    excelLabel: string = 'Service Type';

    rows: ServiceType[] = [];
    rowsCache: ServiceType[] = [];
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
        name: {
            title: this.gT("shared.name"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        nameEn: {
            title: this.gT("shared.nameEn"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        defaultCost: {
            title: this.gT("shared.defaultCost"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        canRetured: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemCategoryParentId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatTypeId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        nameAr: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatType: {
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
        vatTypeDefaultValue: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("serviceTypeEditor")
    serviceTypeEditor: ServiceTypeInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private serviceTypeService: ServiceTypeService,
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
            { prop: "nameAr", name: this.gT("shared.name"), width: 70 },
            { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
            { prop: "code", name: this.gT("shared.code"), width: 70 },
            {
                prop: "defaultCost",
                name: this.gT("shared.defaultCost"),
                width: 70
            }
        ];
        if (this.canManageServiceType) {
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
        this.serviceTypeEditor.changesSavedCallback = () => {
            this.addNewServiceType();
            this.editorModal.hide();
            this.loadData();
        };

        this.serviceTypeEditor.changesCancelledCallback = () => {
            // this.editServiceType = null;
            this.sourceServiceType = null;
            this.editorModal.hide();
        };
    }

    loadData() {
     //   this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.serviceTypeService.getAllServiceTypes().subscribe(st => {
            this.onDataLoadSuccessful(st);
        });
    }

    onDataLoadSuccessful(sups: ServiceType[]) {
        console.log("from server");
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        sups.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            bt['name'] = bt.nameAr;
        });

        this.rowsCache = [...sups];
        this.rows = sups;
    }

    onDataLoadFailed(error: any) {
    //    this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

      /*  this.alertService.showStickyMessage(
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
            Utilities.searchArray(value, false, r.nameAr)
        );
    }

    addNewServiceType() {
        if (this.sourceServiceType) {
            Object.assign(this.sourceServiceType, this.editServiceType);
            this.rows = [...this.rows];
            // this.editServiceType = null;
            this.sourceServiceType = null;
        } else {
            let itemcat = new ServiceType();
            Object.assign(itemcat, this.editServiceType);
            // this.editServiceType = null;

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
        this.serviceTypeEditor.resetForm(true);
    }

    newServiceType() {
        this.editingName = null;
        this.sourceServiceType = null;
        this.editedServiceType = this.serviceTypeEditor.newServiceType();
        this.showModal();
    }

    editServiceType(row: ServiceType) {
        this.editingName = { name: row.nameAr };
        this.sourceServiceType = row;
        this.editedServiceType = this.serviceTypeEditor.editServiceType(row);
        this.editedServiceType = this.serviceTypeEditor.editServiceType(row);
        this.showModal();
    }

    onSelect(row) {
        console.log('selected is', row);
        this.editingName = { name: row.name };
        this.sourceServiceType = row;
        this.serviceTypeEditor.displayServiceType(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteServiceType(row: ServiceType) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.nameAr + '"?',
            DialogType.confirm,
            () => this.deleteServiceTypeHelper(row)
        );
    }

    deleteServiceTypeHelper(row: ServiceType) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.serviceTypeService.deleteServiceType(row["id"]).subscribe(
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

    get canManageServiceType() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.serviceTypeEditor.allServiceTypeegoryParent,
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
