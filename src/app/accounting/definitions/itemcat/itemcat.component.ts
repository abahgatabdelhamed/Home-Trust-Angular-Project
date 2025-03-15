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
import { ItemCatInfoComponent } from "./modal/itemcat-info.component";
import * as XLSX from "xlsx";
import { element } from "protractor";

@Component({
    selector: "itemcat",
    templateUrl: "./itemcat.component.html",
    styleUrls: ["./itemcat.component.css"]
})
export class ItemCatComponent implements OnInit, AfterViewInit {
    editingName: { nameAr: string };
    sourceItemCat: ItemCat;
    editedItemCat: ItemCat;
    rows: ItemCat[] = [];
    excelLabel: string = 'Item Categories';

    rowsCache: ItemCat[] = [];
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
        },
        notes: {
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

    @ViewChild("itemcatEditor")
    itemcatEditor: ItemCatInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private itemcatService: ItemCatService,
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
            { prop: "nameAr", name: this.gT("shared.NameAr"), width: 70 },
            { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
            { prop: "code", name: this.gT("shared.code"), width: 70 },
            {
                prop: "itemCategoryParentName",
                name: this.gT("shared.ItemCategoryParentName"),
                width: 120,
                cellTemplate: this.parentCategory
            }
        ];
        if (this.canManageItemCat)
            this.columns.push({
                name: "",
                width: 200,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false
            });
        this.loadData();
    }

    ngAfterViewInit() {
        this.itemcatEditor.changesSavedCallback = () => {
            //this.addNewItemCatToList();
            this.editorModal.hide();
            this.loadData();
        };

        this.itemcatEditor.changesCancelledCallback = () => {
            this.editedItemCat = null;
            this.sourceItemCat = null;
            this.editorModal.hide();
        };
    }

    loadData() {
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.itemcatService.getItemCats().subscribe(
            itemcat => {
                this.onDataLoadSuccessful(itemcat)
            },
            error => this.onDataLoadFailed(error)
        );
    }

    onDataLoadSuccessful(itemcat: ItemCat[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        itemcat.forEach((bt, index, itemcat) => {
            (<any>bt).index = index + 1;
        });

        this.rowsCache = [...itemcat];
        this.rows = itemcat;
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        /*this.alertService.showStickyMessage(
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
            Utilities.searchArray(value, false, r.nameAr)
        );
    }

    addNewItemCatToList() {
        if (this.sourceItemCat) {
            Object.assign(this.sourceItemCat, this.editedItemCat);
            this.rows = [...this.rows];
            this.editedItemCat = null;
            this.sourceItemCat = null;
        } else {
            let itemcat = new ItemCat();
            Object.assign(itemcat, this.editedItemCat);
            this.editedItemCat = null;

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
        this.itemcatEditor.resetForm(true);
    }

    newItemCat() {
        this.editingName = null;
        this.sourceItemCat = null;
        this.editedItemCat = this.itemcatEditor.newItemCat(this.rows);
        console.log("code");
        this.itemcatService.getItemCatInit().subscribe(res => {
            console.log(res);
            this.itemcatEditor.automatedCode = res["code"];
            this.showModal();
        });
        
    }

    editItemCat(row: ItemCat) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceItemCat = row;
        this.editedItemCat = this.itemcatEditor.editItemCat(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceItemCat = row;
        this.itemcatEditor.displayItemCat(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteItemCat(row: ItemCat) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeletingItemCat")}  `,
            DialogType.confirm,
            () => this.deleteItemCatHelper(row)
        );
    }

    deleteItemCatHelper(row: ItemCat) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.itemcatService.deleteItemCat(row.id).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row);
                this.rows = this.rows.filter(item => item !== row);
            },
            error => {
                //this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

               /* this.alertService.showStickyMessage(
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

    get canManageItemCat() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(this.itemcatEditor.allItemCategoryParent, this.rowsCache);

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
