import { PrinterSettingsService } from "./../../../definitions/services/printer-settings.service";
import { saveAs } from "file-saver";
import * as writtenNumber from "written-number";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity,
} from "../../../../services/alert.service";
import { ExpensesService } from "../../services/expenses.service";
import { Utilities } from "../../../../services/utilities";
import { Expenses } from "../../models/expenses.model";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap,
    catchError,
} from "rxjs/operators";
import { PeopleSearchService } from "../../../shared/services/people-search.service";
import { AccountType } from "../../../definitions/models/account-type.model";
import { Account } from "../../../definitions/models/account.model";
import { Branch } from "../../../definitions/models/brach.model";
import { ExpensePDFService } from "../../services/expense.pdf.service";
import { PrintExpensesService } from "../../services/expense.print.service";
import { PrinterSettings } from "../../../definitions/models/printer-settings";
import { CostCenterService } from "../../../definitions/services/cost-center.service";
import { CostCenterModel, summarizedTreeNode, CostCenterHelper } from "../../../shared/models/cost-center.model";
import { AuthService } from "../../../../services/auth.service";

@Component({
    selector: "expenses-info",
    templateUrl: "./expenses-info.component.html",
    styleUrls: ["./expenses-info.component.css"],
})
export class ExpensesInfoComponent {
    public isViewMode;
    public automatedCode;
    public printerHeader = "";
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewExpenses = false;
    public isEditMode = false;
    private isSuperAdmin = false
    public isSaving = false;
    public showValidationErrors = false;
    public expenses: Expenses = new Expenses();
    public uniqueId: string = Utilities.uniqueId();
    public expensesEdit: Expenses = new Expenses();
    public formResetToggle = true;
    public allExpensesegoryParent: Expenses[] = [];
    public changesFailedCallback: () => void;

    public people3$: Observable<any[]>;
    public people3input$ = new Subject<string>();
    public people3Loading: boolean = false;
    public selectedPeople: any;

    public allAccountType: AccountType[] = [];
    public allAccount: Account[] = [];
    public allBranches: Branch[] = [];
    public allVatTypes: any[] = [];
    public allCostCenters: CostCenterModel[] = [];
    public allExpensesTemplates: summarizedTreeNode[] = [];

    public finalAmount = 0;
    public vatPercent = 0;
    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private expensesService: ExpensesService,
        private translationService: AppTranslationService,
        private peopleSearchService: PeopleSearchService,
        private pdfService: ExpensePDFService,
        private printer: PrintExpensesService,
        private settingService: PrinterSettingsService,
        private costCenterService: CostCenterService,
        private authService:AuthService
    ) {}

    ngOnInit() {
        this.isSuperAdmin=this.authService.userInStorage.value.roles.includes('superadmin')
          
        console.log(this.expenses, "is");
        this.loadPeople3();
        this.settingService.getPrinterSettings().subscribe((res) => {
            console.log("ress is", res);
            this.printerHeader = res.normalPrinter.header;
        });
    }

    onAmountCahnged() {
        this.expensesEdit.vat = this.expensesEdit.amount * this.vatPercent;
        this.finalAmount = this.expensesEdit.vat + this.expensesEdit.amount;
    }
    onVatChanged() {
        for (var vatType of this.allVatTypes) {
            if (vatType.id == this.expensesEdit.vatTypeId) {
                this.vatPercent = vatType.defaultValue;
                this.expensesEdit.vat =
                    this.expensesEdit.amount * this.vatPercent;
                this.finalAmount =
                    this.expensesEdit.vat + this.expensesEdit.amount;
                break;
            }
        }
    }
    mapInitialData(initailData) {
        Object.assign(this.allVatTypes, initailData.vatTypes);
        this.allVatTypes = [...this.allVatTypes];

        if (this.isNewExpenses) {
            this.expensesEdit.receiptCode = initailData.receiptCode;
            this.expensesEdit.date = new Date();
            this.finalAmount = 0;
        } else {
            if (this.expensesEdit.person) {
                
                this.selectedPeople = {
                    nameAr: this.expensesEdit.person.nameAr,
                };
            }
            if (this.expensesEdit.amount) {
                this.vatPercent =
                    this.expensesEdit.vat / this.expensesEdit.amount;
            } else {
                for (var vatType of this.allVatTypes) {
                    if (vatType.id == this.expensesEdit.vatTypeId) {
                        this.vatPercent = vatType.defaultValue;
                        break;
                    }
                }
            }
            this.finalAmount = this.expensesEdit.vat + this.expensesEdit.amount;
            this.expensesEdit.date = new Date(this.expensesEdit.date);
        }
        this.expensesEdit.staffId = initailData.staffId;
        this.expensesEdit.staffName = initailData.staffName;
        Object.assign(this.allAccountType, initailData.accountTypes);
        this.allAccountType = [...this.allAccountType];

        Object.assign(this.allBranches, initailData.branches);
        this.allBranches = [...this.allBranches];

        if (this.expensesEdit.accountTypeId && !this.isNewExpenses) {
            for (let accountType of this.allAccountType) {
                if (accountType.id === this.expensesEdit.accountTypeId) {
                    Object.assign(this.allAccount, accountType.accounts);
                    break;
                }
            }
        }

        if (!this.expensesEdit.accountTypeId && this.isNewExpenses) {
            for (let accountType of this.allAccountType) {
                if (accountType.isDefault) {
                    this.expensesEdit.accountTypeId = accountType.id;
                    this.expensesEdit.accountType = new Object();
                    this.expensesEdit.accountType[
                        "name"
                    ] = this.allAccountType.find(
                        (x) => x.id == this.expensesEdit.accountTypeId
                    ).name;
                    Object.assign(this.allAccount, accountType.accounts);
                    for (let account of this.allAccount) {
                        if (account.isDefault && this.expensesEdit != null) {
                            this.expensesEdit.accountId = account.id;
                            this.expensesEdit.account = new Object();
                            this.expensesEdit.account[
                                "name"
                            ] = this.allAccount.find(
                                (x) => x.id == this.expensesEdit.accountId
                            ).name;
                            break;
                        }
                    }
                    break;
                }
            }
        }

        if (!this.expensesEdit.branchId && this.isNewExpenses) {
            for (let branch of this.allBranches) {
                if (branch.isDefault) {
                    this.expensesEdit.branchId = branch.id;
                    this.expensesEdit.branch = new Object();
                    this.expensesEdit.branch["name"] = this.allBranches.find(
                        (x) => x.id == this.expensesEdit.branchId
                    ).name;
                    break;
                }
            }
        }

        if (this.isNewExpenses) {
            for (let vat of this.allVatTypes) {
                if (vat.isDefault) {
                    this.expensesEdit.vatTypeId = vat.id;
                    this.vatPercent = vat.defaultValue;
                    break;
                }
            }
        }
    }

    onChangedAccountTypeID($event) {
      

        for (var accountType of this.allAccountType) {
            if (accountType.id == this.expensesEdit.accountTypeId) {
                Object.assign(this.allAccount, accountType.accounts);
                for (let account of this.allAccount) {
                    if (account.isDefault) {
                        this.expensesEdit.accountId = account.id;
                        break;
                    }
                }
            }
        }
    }

    printDoc() {
        this.pdfService
            .createPDF(this.expenses, "مصروفات", this.printerHeader)
            .subscribe((res) => {
                let blob = new Blob([res], { type: "application/pdf" });
                saveAs(blob, `sbill-docs-${new Date().toLocaleString()}.pdf`);
            });
    }

    printDocumnent() {
        this.expenses.finalAmount = this.finalAmount;
        this.printer.printDocument(this.expenses, "حساب", this.printerHeader);
    }

    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default people
            this.people3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.people3Loading = true)),
                switchMap((term) =>
                    this.peopleSearchService.getSearchPeopleEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.people3Loading = false))
                    )
                )
            )
        );
    }

    peopleSearchSelected(person) {
        if (person) {
            this.selectedPeople = person;
            this.expensesEdit.personId = person.id;
            if (this.isNewExpenses) {
                this.expenses.person = {};
            }
            this.expensesEdit.person=person
            console.log(this.expensesEdit)
            this.expensesEdit.person.nameAr = person.nameAr;
            this.expensesEdit.person.id = person.id;
            this.expensesEdit.person.vatNumber = person.vatNumber;
            this.expensesEdit.personId=person.id
            this.expensesEdit.personName=person.nameAr
        }
    }
    onBranchChange() {
        if (this.expensesEdit.branchId) {
            this.costCenterService.getAllByBranch(this.expensesEdit.branchId).subscribe(
                (data:CostCenterModel[])=>{
                    this.allCostCenters = data;
                }
            )
            this.expensesEdit.branch.name = this.allBranches.find(
                (x) => x.id == this.expensesEdit.branchId
            ).name;
        }
    }

    onCostCenterChange(){
        if(this.expensesEdit.costCenterId){
            this.expensesEdit.expensessTreeId = null;
            this.allExpensesTemplates = [];            
            this.costCenterService.getCostCenterById(this.expensesEdit.costCenterId).subscribe(
                (data:CostCenterModel)=>{
                    let costCenterHelper = new CostCenterHelper(data);
                    costCenterHelper.flatExpensesLables(this.allExpensesTemplates);
                }
            )
        }
    }


    

    

    onAccountTypeChange() {
        if (this.expensesEdit.accountTypeId) {
            this.expensesEdit.accountType.name = this.allAccountType.find(
                (x) => x.id == this.expensesEdit.accountTypeId
            ).name;
        }
    }

    onAccountChange() {
        if (this.expensesEdit.accountId) {
            this.expensesEdit.account.name = this.allAccount.find(
                (x) => x.id == this.expensesEdit.accountId
            ).name;
        }
    }

    // private loadCurrentExpensesData() {
    //     this.alertService.startLoadingMessage();
    //     this.expensesService.getExpensess().subscribe(results => this.onCurrentUserDataLoadSuccessful(results), error => this.onCurrentUserDataLoadFailed(error));
    // }
    gT = (key: string) => this.translationService.getTranslation(key);
    newExpenses() {
        this.isNewExpenses = true;
        this.expenses = this.expensesEdit = new Expenses();
        this.edit();
        this.expensesService.getExpensesInit().subscribe((res) => {
            this.mapInitialData(res);
            this.onBranchChange();
        });
        return this.expensesEdit;
    }

    editExpenses(expenses: Expenses) {
        if (expenses) {
            this.isNewExpenses = false;
            this.expenses = new Expenses();
            this.expensesEdit = new Expenses();
            Object.assign(this.expenses, expenses);
            Object.assign(this.expensesEdit, expenses);
            this.edit();
            this.expensesService.getExpensesInit().subscribe((res) => {
                this.mapInitialData(res);
                this.onBranchChange();
            });
            return this.expensesEdit;
        } else {
            return this.newExpenses();
        }
    }

    displayExpenses(expenses: Expenses) {
        if (expenses) {
            this.expensesService.getExpensesInit().subscribe((res) => {
                Object.assign(this.allAccountType, res.accountTypes);
                this.allAccountType = [...this.allAccountType];

                Object.assign(this.allBranches, res.branches);
                this.allBranches = [...this.allBranches];

                if (expenses.accountTypeId) {
                    for (let accountType of this.allAccountType) {
                        if (accountType.id === expenses.accountTypeId) {
                            Object.assign(
                                this.allAccount,
                                accountType.accounts
                            );
                            break;
                        }
                    }
                }
                expenses.accountType = new Object();
                expenses.accountType["name"] = this.allAccountType.find(
                    (x) => x.id == expenses.accountTypeId
                ).name;
                expenses.account = new Object();
                expenses.account["name"] = this.allAccount.find(
                    (x) => x.id == expenses.accountId
                ).name;
                expenses.branch = new Object();
                expenses.branch["name"] = this.allBranches.find(
                    (x) => x.id == expenses.branchId
                ).name;
                this.isNewExpenses = false;
                this.expenses = new Expenses();
                this.expensesEdit = new Expenses();
                Object.assign(this.expenses, expenses);
                Object.assign(this.expensesEdit, expenses);
                this.isEditMode = false;
            });
        } else {
            this.expenses = new Expenses();
            this.expensesEdit = new Expenses();
            this.isEditMode = false;
            this.isNewExpenses = true;
        }
    }

    private edit() {
        if (!this.expensesEdit) this.expensesEdit = new Expenses();
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    saveAndPrint() {
        this.save(true);
    }

    private save(print = false) {
       if( this.isSaving)
       return
        //this will come through initial object
        // this.expensesEdit.code = ""
        this.isSaving = true;
       // this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        this.expenses.receiptCode = this.expensesEdit.receiptCode;
        if (this.isNewExpenses) {
            console.log(this.expensesEdit);
            this.expensesService.newExpenses(this.expensesEdit).subscribe(
                (expenses) => this.saveSuccessHelper(expenses, print),
                (error) => this.saveFailedHelper(error)
            );
        } else {
            this.expensesService.updateExpenses(this.expensesEdit).subscribe(
                (expenses) => this.saveSuccessHelper(expenses),
                (error) => this.saveFailedHelper(error)
            );
        }
    }

    private saveSuccessHelper(expenses: Expenses, print = false) {
        let i = 0;
        this.expensesEdit.finalAmount = this.finalAmount;
        while (i < 1 && print) {
            this.printer.printDocument(
                this.expensesEdit,
                "حساب",
                this.printerHeader
            );
            i = 1;
        }
        Object.assign(this.expensesEdit, expenses);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.expenses, this.expensesEdit);
        this.expensesEdit = new Expenses();
        this.resetForm();

        // if (this.isNewExpenses)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.expenses.receiptCode +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.expenses.receiptCode +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
     /*   this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            "Save Error",
            "The below errors occured whilst saving your changes:",
            MessageSeverity.error,
            error
        );
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
*/
        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
     //   this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.expensesEdit = this.expenses = new Expenses();

        this.showValidationErrors = false;
        this.resetForm();
        // this.alertService.showMessage(
        //     this.gT("messages.closing"),
        //     this.gT("messages.processIgnored"),
        //     MessageSeverity.default
        // );
        // this.alertService.resetStickyMessage();
        this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.expensesEdit = this.expenses = new Expenses();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;
        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
        } else {
            this.formResetToggle = false;
            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    private onCurrentUserDataLoadSuccessful(itemCategories: Expenses[]) {
        this.alertService.stopLoadingMessage();
        this.allExpensesegoryParent = itemCategories;
        console.error(itemCategories);
    }

    private onCurrentUserDataLoadFailed(error: any) {
     /*   this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.expenses = new Expenses();
    }
}
