import { CustomerService } from "./../services/customer.service";
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
import { ItemCatService } from "../services/itemcat.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { ItemCat } from "../models/itemcat.model";
import * as XLSX from "xlsx";
import { element } from "protractor";
import { SupplierService } from "../services/supplier.service";
import { Supplier } from "../models/supplier.model";
import { CustomerInfoComponent } from "./modal/customer-person-info.component";

@Component({
    selector: "supplier",
    templateUrl: "./customer-person.component.html",
    styleUrls: ["./customer-person.component.css"]
})
export class CustomerComponent implements OnInit, AfterViewInit {
    editingName: { nameAr: string };
    sourceSupplier: Supplier;
    editedSupplier: Supplier;
    rows: Supplier[] = [];
    excelLabel: string = 'Customer';

    rowsCache: Supplier[] = [];
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
        nameAr: {
            title: this.gT("shared.NameAr"),
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
        itemCategoryParentName: {
            title: this.gT("shared.ItemCategoryParentName"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        }
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("supplierEditor")
    supplierEditor: CustomerInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private supplierService: SupplierService,
        private customerService: CustomerService,
        private excelService: ExcelService
    ) {}

    ngOnInit() {
        this.columns = [
            {
                prop: "id",
                name: "#",
                width: 60,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            { prop: "nameAr", name: this.gT("shared.nameAr"), width: 70 },
            { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
            {
                prop: "mobile",
                name: this.gT("shared.mobile"),
                width: 70
            },
            {
                prop: "canLoanDisplay",
                name: this.gT("shared.canLoan"),
                width: 70
            },
            {
                prop: "vatNumber",
                name: this.gT("shared.vatNumber"),
                width: 70
            },
            {
                prop: "neighborhood",
                name: this.gT("shared.neighborhood"),
                width: 70
            }
        ];
        if (this.canManageSupplier) {
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
        this.supplierEditor.changesSavedCallback = () => {
            this.addNewSupplier();
            this.editorModal.hide();
            this.loadData();
        };

        this.supplierEditor.changesCancelledCallback = () => {
            // this.editSupplier = null;
            this.sourceSupplier = null;
            this.editorModal.hide();
        };
    }

    loadData() {
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.customerService.getAllCustomer().subscribe(
            sups => {
                this.onDataLoadSuccessful(sups), console.error("clients customer ",sups);
            },
            err => this.onDataLoadFailed(err)
        );
    }

    onDataLoadSuccessful(sups: Supplier[]) {
        console.log("from server");
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        sups.forEach((bt, id, sup) => {
            (<any>bt).id = id + 1;
            bt.canLoanDisplay = bt.canLoan ? this.gT("shared.yes")
            : this.gT("shared.no");;
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
            Utilities.searchArray(value, false, r.nameAr, r.mobile, r.phone, r.nameEn)
        );
    }

    addNewSupplier() {
        if (this.sourceSupplier) {
            Object.assign(this.sourceSupplier, this.editSupplier);
            this.rows = [...this.rows];
            // this.editSupplier = null;
            this.sourceSupplier = null;
        } else {
            let itemcat = new Supplier();
            Object.assign(itemcat, this.editSupplier);
            // this.editSupplier = null;

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
        this.supplierEditor.resetForm(true);
    }

    newSupplier() {
        this.editingName = null;
        this.sourceSupplier = null;
        this.editedSupplier = this.supplierEditor.newSupplier();
        this.showModal();
    }

    editSupplier(row: Supplier) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceSupplier = row;
        this.editedSupplier = this.supplierEditor.editSupplier(row);
        this.editedSupplier = this.supplierEditor.editSupplier(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceSupplier = row;
        this.supplierEditor.displaySupplier(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteSupplier(row: Supplier) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.nameAr + '"?',
            DialogType.confirm,
            () => this.deleteSupplierHelper(row)
        );
    }

    deleteSupplierHelper(row: Supplier) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.supplierService.deleteSupplier(row.id).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(sup => sup !== row);
                this.rows = this.rows.filter(sup => sup !== row);
            },
            error => {
              //  this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

              /*  this.alertService.showStickyMessage(
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

    get canManageSupplier() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.supplierEditor.allSupplieregoryParent,
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
