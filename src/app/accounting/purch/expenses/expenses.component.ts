import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { ExpensesService } from "../services/expenses.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { Expenses } from "../models/expenses.model";
import { Pagination } from "../../shared/models/pagination.model";
import { ExpensesInfoComponent } from "./modal/expenses-info.component";
import * as XLSX from "xlsx";
import { element } from "protractor";
import { CostCenterService } from "../../definitions/services/cost-center.service";
import { CostCenterModel } from "../../shared/models/cost-center.model";
import Page from "../../shared/models/page.model";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs/operators";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { FilterData } from "../../shared/models/branch-cc-filter.model";
import { CheckPermissionsService } from "../../../services/check-permissions.service";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: "expenses",
    templateUrl: "./expenses.component.html",
    styleUrls: ["./expenses.component.css"]
})
export class ExpensesComponent implements OnInit, AfterViewInit {
    CCPermissions:boolean=false
    editingName: { nameAr: string };
    sourceExpenses: Expenses;
    editedExpenses: Expenses;
    rows: Expenses[] = [];
    rowsCache: Expenses[] = [];
    excelLabel: string = 'Expense';
    isSuperAdmin = false;
    costCenterList: CostCenterModel[];
    isCostCenterEnabled: boolean = false;
    selectedBranch: number = null;
    selectCC: number = null;
    selectedExpensesId: number = null;
    searchQuery: string = '';
    page = new Page(environment.pagination.size, environment.pagination.offset);
    FilterData:FilterData={selectedBillType:null,selectedBranch:null,selectedCC:null,selectedExpensesId:null,serachModel:{from:new Date(),to:new Date}}
    columns: any[] = [];
    loadingIndicator: boolean;
    finalAmount = 0;
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
        receiptCode: {
            title: this.gT("shared.code"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        personName: {
            title: this.gT("shared.account"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        totalAmount: {
            title: this.gT("shared.totalPrice"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        branchName: {
            title: this.gT("shared.branch"),
            order: 5,
            excel_cell_header: "E1",
            isVis: false
        },
        costCenterName: {
            title: this.gT("shared.costCenter"),
            order: 6,
            excel_cell_header: "F1",
            isVis: false
        },
        expensessTreeName: {
            title: this.gT("shared.expenses-template"),
            order: 7,
            excel_cell_header: "G1",
            isVis: false
        },

    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("expensesEditor")
    expensesEditor: ExpensesInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;
    modalName: any;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private expensesService: ExpensesService,
        private exportExcelService: ExportExcelService,
        private costCenterService: CostCenterService,
        private checkPermissions:CheckPermissionsService  ,
        private authService:AuthService       
        ) { }
        ngOnInit() {
            this.isSuperAdmin=this.authService.userInStorage.value.roles.includes('superadmin')
            this.CCPermissions=this.checkPermissions.checkGroup(6,11)
        this.isCostCenterEnabled = this.checkCostCenterEnabled();
        this.initializeCoulmnsHeaders();
        this.loadData();
    }


    filterData(filterData) {
        /*this.selectedBranch = filterData.selectedBranch;
        this.selectCC = filterData.selectedCC;
        this.selectedExpensesId = filterData.selectedExpensesId;
        */this.FilterData=filterData
        this.loadData();
    }

    onSearchChanged(value: string) {
        this.searchQuery = value;
        this.page.offset = 0;
        this.loadData();
    }

    setPage(pageInfo) {
        this.page.offset = pageInfo.offset;
        this.loadData();
    }


    initializeCoulmnsHeaders() {
        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 60,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },

            { prop: "receiptCode", name: this.gT("shared.code") },
            { prop: "personName", name: this.gT("shared.account") },
            {
                prop: "totalAmount",
                name: this.gT("shared.totalPrice"),
                cellTemplate: this.parentCategory
            }
        ];
        if (this.isCostCenterEnabled) {
            this.columns.push.apply(this.columns, [
                { prop: "branchName", name: this.gT("shared.branch") },
                { prop: "costCenterName", name: this.gT("shared.costCenter") },
                { prop: "expensessTreeName", name: this.gT("shared.expenses-template") },

            ])

            for (let key in this.headers) {
                if (key === 'branchName' || key === 'costCenterName' || key === 'expensessTreeName') {
                    this.headers[key].isVis = true;
                }
            }

        }
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

    checkCostCenterEnabled() {
        return this.costCenterService.checkCostCenterEnabled();
    }



    ngAfterViewInit() {
        this.expensesEditor.changesSavedCallback = () => {
            //this.addNewExpensesToList();
            this.editorModal.hide();
            this.loadData();
        };

        this.expensesEditor.changesCancelledCallback = () => {
            this.editedExpenses = null;
            this.sourceExpenses = null;
            this.editorModal.hide();
        };
    }

    loadData() {
        // this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.expensesService.getExpensess(this.FilterData.serachModel,this.searchQuery, this.FilterData.selectedBranch, this.FilterData.selectedCC, this.FilterData.selectedExpensesId, this.page.size, this.page.offset + 1)
            .pipe(map(res => {
                res.content = res.content.map((val, idx) => {
                    val.branchName = val.branch ? val.branch.name : '';
                    val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
                    val.expensessTreeName = val.expensessTree ? val.expensessTree.nameAr : '';
                    val.index = idx + 1;
                    return val;
                })
                return res;
            }
            )).subscribe(
                (expenses: Pagination<Expenses>) => {
                    this.loadingIndicator = false;
                    this.rows = [...expenses.content];
                    this.page.count = expenses.totalCount;
                },
                error => this.onDataLoadFailed(error)
            );
    }


    onDataLoadFailed(error: any) {
        // this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        /* this.alertService.showStickyMessage(
             this.gT("messages.loadError"),
             `Unable to retrieve expenses from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                 error
             )}"`,
             MessageSeverity.error,
             error
         );
         */
    }



    addNewExpensesToList() {
        if (this.sourceExpenses) {
            Object.assign(this.sourceExpenses, this.editedExpenses);
            this.rows = [...this.rows];
            this.editedExpenses = null;
            this.sourceExpenses = null;
        } else {
            let expenses = new Expenses();
            Object.assign(expenses, this.editedExpenses);
            this.editedExpenses = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>expenses).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, expenses);
            this.rows.splice(0, 0, expenses);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.expensesEditor.resetForm(true);
    }

    newExpenses() {
        this.editingName = null;
        this.sourceExpenses = null;
        this.editedExpenses = this.expensesEditor.newExpenses();
        this.modalName = this.gT("shared.NewItem")
        this.showModal();
    }

    editExpenses(row: Expenses) {
        this.editingName = { nameAr: row.receiptCode };
        this.sourceExpenses = row;
        this.modalName = this.gT("shared.Edit")
        this.editedExpenses = this.expensesEditor.editExpenses(row);
        this.showModal();
    }

    onSelect(row) {
        this.finalAmount = row.vat + row.amount;
        this.editingName = { nameAr: row.nameAr };
        this.modalName = this.gT("shared.view")
        this.sourceExpenses = row;

        this.expensesEditor.displayExpenses(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteExpenses(row: Expenses) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.receiptCode} ?`,
            DialogType.confirm,
            () => this.deleteExpensesHelper(row)
        );
    }

    deleteExpensesHelper(row: Expenses) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.expensesService.deleteExpenses(row.id).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row);
                this.rows = this.rows.filter(item => item !== row);
            },
            error => {
                //  this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                /*  this.alertService.showStickyMessage(
                      this.gT("messages.deleteError"),
                      `An error occured whilst deleting the expenses.\r\nError: "${Utilities.getHttpResponseMessage(
                          error
                      )}"`,
                      MessageSeverity.error,
                      error
                  );*/
            }
        );
    }

    get canManageExpenses() {
        // return this.accountService.userHasPermission(
        //     Permission.manageExpensesPermission
        // );
        return false;
    }

    transformDataToModal() {
        Object.assign(this.expensesEditor.allExpensesegoryParent, this.rowsCache);
    }


    getAllDataToExport() {
        return this.expensesService
            .getExpensess(this.FilterData.serachModel,'', this.selectedBranch, this.selectCC, this.selectedExpensesId, -1, -1)
            .toPromise().then(st => st.content.map((val, idx) => {
                val.branchName = val.branch ? val.branch.name : '';
                val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
                val.expensessTreeName = val.expensessTree ? val.expensessTree.nameAr : '';
                val.index = idx + 1;
                return val;
            }));
    }

    async exportAsXLSX() {
        let exportedRows = []
        this.loadingIndicator = true;
        exportedRows = await this.getAllDataToExport();
        console.log(exportedRows,'************')
        if (!exportedRows) {
            exportedRows = [];
        }
        this.loadingIndicator = false;
        this.exportExcelService.ExportExcel(exportedRows, this.headers, this.excelLabel);
    }
}
