import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { Utilities } from "../../../../services/utilities";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { VatTypeService } from "../../services/vattype.service";
import { VatType } from "../../models/vat-type.model";

@Component({
    selector: "vat-type-modal",
    templateUrl: "./vat-type-info.component.html",
    styleUrls: ["./vat-type-info.component.css"]
})
export class VatTypeModalComponent implements OnInit {
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewVatType = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public vatType: VatType = new VatType();
    public uniqueId: string = Utilities.uniqueId();
    public vatTypeEdit: VatType;
    public formResetToggle = true;
    public allVatTypeegoryParent: VatType[] = [];
    public changesFailedCallback: () => void;
    public vatTypeViewModel: VatType;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private vatTypeService: VatTypeService,
        private translationService: AppTranslationService
    ) {}

    ngOnInit() {
        //    this.loadCurrentVatTypeData();
        this.vatType = this.vatTypeEdit = new VatType();
    }

    private loadCurrentVatTypeData() {
        //this.alertService.startLoadingMessage();
        // this.vatTypeService.getVatTypes().subscribe(result => this.onCurrentUserDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error))
    }
    gT = (key: string) => this.translationService.getTranslation(key);
    newVatType() {
        this.isNewVatType = true;
        this.vatType = this.vatTypeEdit = new VatType();
        this.edit();
        return this.vatTypeEdit;
    }

    editVatType(vatType: VatType) {
        if (vatType) {
            this.isNewVatType = false;
            this.vatType = new VatType();
            this.vatTypeEdit = new VatType();
            Object.assign(this.vatType, vatType);
            Object.assign(this.vatTypeEdit, vatType);
            this.edit();
            return this.vatTypeEdit;
        } else {
            return this.newVatType();
        }
    }

    displayVatType(vatType: VatType) {
        if (vatType) {
            this.isNewVatType = false;
            this.vatType = new VatType();
            this.vatTypeEdit = new VatType();
            Object.assign(this.vatType, vatType);
            Object.assign(this.vatTypeEdit, vatType);
            console.log(this.vatType);
            console.log(this.vatTypeEdit);
            this.isEditMode = false;
        } else {
            this.vatType = new VatType();
            this.vatTypeEdit = new VatType();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.vatTypeEdit) this.vatTypeEdit = new VatType();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {
        // for (let value of this.allVatTypeegoryParent) {
        //     if (value.id == this.vatTypeEdit.vatTypeegoryParentId) {
        //         this.vatTypeEdit.vatTypeegoryParentName = value.nameAr;
        //         break;
        //     }
        // }

        this.isSaving = true;
       // this.alertService.startLoadingMessage(this.gT("shared.Saving"));

        if (this.isNewVatType) {
            console.log(this.vatTypeEdit);
            // this.vatTypeService
            //     .newVatType(this.vatTypeEdit)
            //     .subscribe(
            //         vatTypecat => this.saveSuccessHelper(vatTypecat),
            //         error => this.saveFailedHelper(error)
            //     );
        } else {
            // this.vatTypecatService
            //     .updateVatType(this.vatTypeEdit)
            //     .subscribe(
            //         vatTypecat => this.saveSuccessHelper(vatTypecat),
            //         error => this.saveFailedHelper(error)
            //     );
        }
    }

    private saveSuccessHelper(vatType: VatType) {
        Object.assign(this.vatTypeEdit, vatType);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.vatType, this.vatTypeEdit);
        this.vatTypeEdit = new VatType();
        this.resetForm();

        // if (this.isNewVatType)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.vatType.id +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.vatType.id +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
       /* this.alertService.stopLoadingMessage();
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
        this.vatTypeEdit = this.vatType = new VatType();

        this.showValidationErrors = false;
        this.resetForm();

        // this.alertService.showMessage(
        //           this.gT("messages.closing"),
        //                 this.gT("messages.processIgnored"),
        //     MessageSeverity.default
        // );
        // this.alertService.resetStickyMessage();
        this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.vatTypeEdit = this.vatType = new VatType();
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

    private onCurrentUserDataLoadSuccessful(vatTypeegories: VatType[]) {
        this.alertService.stopLoadingMessage();
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
        this.vatType = new VatType();
    }
}
