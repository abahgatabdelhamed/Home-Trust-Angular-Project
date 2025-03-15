// Trash, The correct accounting table (grid) is in daily-advanced -> modal -> accountingtree
import { AccountingService } from "./../../services/accounting.service";
import { AccountService } from "./../../../../services/account.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Utilities } from "../../../../services/utilities";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { ReceiptDocService } from "../../../sales/services/receipt-doc.service";
import { Accounting, AccountingInterface } from "../../models/accounting.model";
import { AppTranslationService } from "../../../../services/app-translation.service";

@Component({
    selector: "accountingtree-modal",
    templateUrl: "./accountingtree-modal.component.html",
    styleUrls: ["./accountingtree-modal.component.css"]
})
export class AccountingInfoComponent {
    initial;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewAccounting = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public accounting: Accounting = new Accounting();
    public dailyAccounting: Accounting[] = [];
    public uniqueId: string = Utilities.uniqueId();
    public accountingEdit: AccountingInterface;
    public formResetToggle = true;
    public allAccountingegoryParent: Accounting[] = [];
    public changesFailedCallback: () => void;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountingService: AccountingService
    ) {}

    ngOnInit() {
        this.accountingService.getInitialAccountinng().subscribe(res => {
            this.initial = res;
             console.log(this.initial);
         })
    }

    handleAdd(e) {
        console.log(this.accountingEdit);
        this.dailyAccounting.push(this.accountingEdit);
        this.accountingEdit = new Accounting();
    }

    private loadCurrentAccountingData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);

    newAccounting() {
        this.isNewAccounting = true;
        this.accounting = this.accountingEdit = new Accounting();
        this.edit();
        return this.accountingEdit;
    }

    editAccounting(accounting: AccountingInterface) {
        if (accounting) {
            this.isNewAccounting = false;
            this.accounting = new Accounting();
            this.accountingEdit = new Accounting();
            Object.assign(this.accounting, accounting);
            Object.assign(this.accountingEdit, accounting);
            this.edit();
            return this.accountingEdit;
        } else {
            this.accounting = new Accounting();
            this.accountingEdit = new Accounting();
            return this.newAccounting();
        }
    }

    displayAccounting(accounting: AccountingInterface) {
        if (accounting) {
            this.isNewAccounting = false;
            this.accounting = new Accounting();
            this.accountingEdit = new Accounting();
            Object.assign(this.accounting, accounting);
            Object.assign(this.accountingEdit, accounting);
            this.isEditMode = false;
        } else {
            this.accounting = new Accounting();
            this.accountingEdit = new Accounting();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.accountingEdit) this.accountingEdit = new Accounting();
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    deleteAccounting(doc) {
        const index = this.dailyAccounting.indexOf(doc);
        this.dailyAccounting.splice(index, 1);
    }

    public save() {
        this.isSaving = true;
        // this.alertService.startLoadingMessage("Saving changes...");
        if (this.isNewAccounting) {
            console.log(this.accountingEdit);
            this.accountingService.addAccounting(this.accountingEdit).subscribe(/*res => this.saveSuccessHelper(res), err => this.saveFailedHelper(err)*/);
        } else {
            console.log("updating .........", this.accounting["id"]);
            this.accountingService.editAccounting(this.accountingEdit, this.accountingEdit['id']).subscribe(/*res => this.saveSuccessHelper(res), err => this.saveFailedHelper(err)*/);
        }
        // this.dailyDocService
        //     .updateAccounting(this.accountingEdit, this.accounting["id"])
        //     .subscribe(res => {
        //         this.saveSuccessHelper(res);
        //     });
        
    }

    private saveSuccessHelper(accounting: AccountingInterface) {
        console.log(accounting);
        Object.assign(this.accountingEdit, accounting);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.accounting, this.accountingEdit);
        this.accountingEdit = new Accounting();
        this.resetForm();

        // if (this.isNewAccounting)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.accounting.code +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.accounting.code +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
      /*  this.alertService.showStickyMessage(
            "Save Error",
            "The below errors occured whilst saving your changes:",
            MessageSeverity.error,
            error
        );*/
        /*this.alertService.showStickyMessage(error, null, MessageSeverity.error);
*/
        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.accountingEdit = this.accounting = new Accounting();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage(
            this.gT("messages.closing"),
            this.gT("messages.processIgnored"),
            MessageSeverity.default
        );
        this.alertService.resetStickyMessage();
        this.isEditMode = false;
        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        console.log("close");
        this.accountingEdit = this.accounting = new Accounting();
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

    private onCurrentUserDataLoadSuccessful(
        itemCategories: AccountingInterface[]
    ) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );

        this.accounting = new Accounting();
    }
}
