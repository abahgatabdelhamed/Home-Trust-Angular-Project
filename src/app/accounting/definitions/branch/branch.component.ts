import { ExportExcelService } from './../../shared/services/export-excel.service';
import { BranchService } from "./../services/branch.service";
import * as XLSX from "xlsx";

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
import { Branch } from "../models/branch.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { ExcelService } from "../../../services/excel.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { Permission } from "../../../models/permission.model";
import { BranchModalComponent } from "./modal/branch-info.component";
import { CheckPermissionsService } from '../../../services/check-permissions.service';

@Component({
    selector: "app-branch",
    templateUrl: "./branch.component.html",
    styleUrls: ["./branch.component.css"]
})
export class BranchComponent implements OnInit {
    editingName: { name: string };
    sourceBranch: Branch;
    editedBranch: Branch;
    rows: Branch[] = [];
    rowsCache: Branch[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    CCPermissions:boolean=false
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
        name: {
            title: this.gT("shared.name"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        phone: {
            title: this.gT("shared.phone"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        isDefault: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        notes: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitBranches: {
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

    @ViewChild("branchModalEditor")
    branchModalEditor: BranchModalComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;

    excelLabel: string = 'Branch';

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private branchcatService: BranchService,
        private branchService: BranchService,
        private excelService: ExcelService,
        private ExportExcelService:ExportExcelService,
        private checkPermissions:CheckPermissionsService
    ) {}

    ngOnInit() {
        this.CCPermissions=this.checkPermissions.checkGroup(6,12)
   //     console.log(this.checkPermissions.checkGroup(6,11),this.CCPermissions)
        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 60,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            { prop: "name", name: this.gT("shared.name"), width: 70 },
            { prop: "phone", name: this.gT("shared.phone"), width: 70 },

        ];
        if (this.canManageBranch) {
            this.columns.push({
                name: "",
                width: 350,
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
        this.branchModalEditor.changesSavedCallback = () => {
            //this.addNewBranchToList();
            this.editorModal.hide();
            this.loadData();
        };

        this.branchModalEditor.changesCancelledCallback = () => {
            this.editedBranch = null;
            this.sourceBranch = null;
            this.editorModal.hide();
        };
    }

    loadData() {
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.branchService.getAllBranches().subscribe(
            branchs => {
                console.log(branchs);
                this.onDataLoadSuccessful(branchs), console.error(branchs);
            },
            error => {
                this.onDataLoadFailed(error);
            }
        );
    }

    onDataLoadSuccessful(branchs: Branch[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        branchs.forEach((bt, index, branchcat) => {
            (<any>bt).index = index + 1;
        });

        this.rowsCache = [...branchs];
        this.rows = branchs;
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        /*this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve branchcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
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

    addNewBranchToList() {
        if (this.sourceBranch) {
            Object.assign(this.sourceBranch, this.editedBranch);
            this.rows = [...this.rows];
            this.editedBranch = null;
            this.sourceBranch = null;
        } else {
            let branchcat = new Branch();
            Object.assign(branchcat, this.editedBranch);
            this.editedBranch = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>branchcat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, branchcat);
            this.rows.splice(0, 0, branchcat);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.branchModalEditor.resetForm(true);
    }

    newBranch() {
        this.editingName = null;
        this.sourceBranch = null;
        this.editedBranch = this.branchModalEditor.newBranch();
        this.showModal();
    }

    editBranch(row: Branch) {
        this.editingName = { name: row.name };
        this.sourceBranch = row;
        this.editedBranch = this.branchModalEditor.editBranch(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { name: row.name };
        this.sourceBranch = row;
        this.branchModalEditor.displayBranch(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteBranch(row: Branch) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.name} ?`,
            DialogType.confirm,
            () => this.deleteBranchHelper(row)
        );
    }

    deleteBranchHelper(row: Branch) {
        //this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.branchService.deleteBranch(row["id"]).subscribe(
            result => {
                console.log(result, row["id"]);
               // this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(
                    branch => branch !== row
                );
                this.rows = this.rows.filter(branch => branch !== row);
            },
            error => {
                //this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

               /* this.alertService.showStickyMessage(
                    this.gT("messages.deleteError"),
                    `An error occured whilst deleting the branchcat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }

    get canManageBranch() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.branchModalEditor.allBranchegoryParent,
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
        this.ExportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel)
        // let removedKeyArr: string[] = this.getRemovedHeadersArray();
        // for (var removedKey of removedKeyArr) {
        //     for (var row of exportedRows) {
        //         delete row[removedKey];
        //     }
        // }
        // let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        //     exportedRows,
        //     { header: orderedKeyArr }
        // );
        // for (var key in this.headers) {
        //     if (
        //         this.headers[key].isVis &&
        //         this.headers[key].excel_cell_header != ""
        //     ) {
        //         worksheet[this.headers[key].excel_cell_header].v = this.headers[
        //             key
        //         ].title;
        //     }
        // }

        // console.error(worksheet);
        // this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
        this.loadData();
    }
}
