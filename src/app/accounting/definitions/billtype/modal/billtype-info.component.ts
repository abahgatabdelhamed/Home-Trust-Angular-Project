import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { BillTypeService } from "../../services/billtype.service";
import { Utilities } from "../../../../services/utilities";
import { BillType } from "../../models/billtype.model";
import { AppTranslationService } from "../../../../services/app-translation.service";

@Component({
    selector: "billtype-info",
    templateUrl: "./billtype-info.component.html",
    styleUrls: ["./billtype-info.component.css"]
})
export class BillTypeInfoComponent implements OnInit {
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewBillType = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public billtype: BillType = new BillType();
    public uniqueId: string = Utilities.uniqueId();
    public billtypeEdit: BillType;
    public formResetToggle = true;
    private gT = (key: string) => this.translationService.getTranslation(key);
    public changesFailedCallback: () => void;

    @ViewChild("f")
    public form;

    @ViewChild("name")
    public name;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private billtypeService: BillTypeService
    ) {}

    ngOnInit() {
        this.loadCurrentBillTypeData();
    }

    private loadCurrentBillTypeData() {
      //  this.alertService.startLoadingMessage();
    }

    newBillType() {
        this.isNewBillType = true;
        this.billtype = this.billtypeEdit = new BillType();
        this.edit();

        return this.billtypeEdit;
    }

    editBillType(billtype: BillType) {
        if (billtype) {
            this.isNewBillType = false;
            this.billtype = new BillType();
            this.billtypeEdit = new BillType();
            Object.assign(this.billtype, billtype);
            Object.assign(this.billtypeEdit, billtype);
            this.edit();

            return this.billtypeEdit;
        } else {
            return this.newBillType();
        }
    }

    displayBillType(billtype: BillType) {
        this.billtype = new BillType();
        Object.assign(this.billtype, billtype);
        this.isEditMode = false;
    }

    private edit() {
        if (!this.billtypeEdit) this.billtypeEdit = new BillType();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {
        this.isSaving = true;
     //   this.alertService.startLoadingMessage(this.gT("shared.Saving"));

        if (this.isNewBillType) {
            console.log(this.billtypeEdit);
            this.billtypeService
                .newBillType(this.billtypeEdit)
                .subscribe(
                    billtype => this.saveSuccessHelper(billtype),
                    error => this.saveFailedHelper(error)
                );
        } else {
            this.billtypeService
                .updateBillType(this.billtypeEdit)
                .subscribe(
                    billtype => this.saveSuccessHelper(billtype),
                    error => this.saveFailedHelper(error)
                );
        }
    }

    private saveSuccessHelper(billtype: BillType) {
        Object.assign(this.billtypeEdit, billtype);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.billtype, this.billtypeEdit);
        this.billtypeEdit = new BillType();
        this.resetForm();

        // if (this.isNewBillType)
        //     this.alertService.showMessage(
        //         "Success",
        //         `BillType \"${this.billtype.name}\" was created successfully`,
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         "Success",
        //         `Changes to billtype \"${
        //             this.billtype.name
        //         }\" was saved successfully`,
        //         MessageSeverity.success
        //     );

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
      /*  this.alertService.stopLoadingMessage();
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
  //      this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.billtypeEdit = this.billtype = new BillType();

        this.showValidationErrors = false;
        this.resetForm();

    /*    this.alertService.showMessage(
            "Cancelled",
            "Operation cancelled by billtype",
            MessageSeverity.default
        );
        this.alertService.resetStickyMessage();
      */  this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.billtypeEdit = this.billtype = new BillType();
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

    private onCurrentUserDataLoadFailed(error: any) {
      /*  this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.billtype = new BillType();
    }
}
