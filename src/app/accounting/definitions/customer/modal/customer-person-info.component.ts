import { SupplierService } from "./../../services/supplier.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { Utilities } from "../../../../services/utilities";
import { ItemCat } from "../../models/itemcat.model";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { Supplier, SupplierInterface } from "../../models/supplier.model";

@Component({
    selector: "customer-info",
    templateUrl: "./customer-person-info.component.html",
    styleUrls: ["./customer-person-info.component.css"]
})
export class CustomerInfoComponent {
    public billsToSelectFrom: any;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewSupplier = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public supplier: Supplier = new Supplier();
    public uniqueId: string = Utilities.uniqueId();
    public supplierEdit: SupplierInterface;
    public formResetToggle = true;
    public allSupplieregoryParent: Supplier[] = [];
    public changesFailedCallback: () => void;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private supplierService: SupplierService,
        private translationService: AppTranslationService
    ) {}

    ngOnInit() {
    }

    private loadCurrentSupplierData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);

    newSupplier() {
        this.isNewSupplier = true;
        this.supplier = this.supplierEdit = new Supplier();
        this.supplier.canLoan = this.supplierEdit.canLoan = false;
        this.edit();
        return this.supplierEdit;
    }

    editSupplier(supplier: Supplier) {
        if (supplier) {
            this.isNewSupplier = false;
            this.supplier = new Supplier();
            this.supplierEdit = new Supplier();
            Object.assign(this.supplier, supplier);
            Object.assign(this.supplierEdit, supplier);
            this.edit();
            return this.supplierEdit;
        } else {
            return this.newSupplier();
        }
    }

    displaySupplier(supplier: Supplier) {
        if (supplier) {
            this.isNewSupplier = false;
            this.supplier = new Supplier();
            this.supplierEdit = new Supplier();
            Object.assign(this.supplier, supplier);
            Object.assign(this.supplierEdit, supplier);
            this.isEditMode = false;
        } else {
            this.supplier = new Supplier();
            this.supplierEdit = new Supplier();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.supplierEdit) this.supplierEdit = new Supplier();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {
        this.isSaving = true;
        this.supplierEdit.personTypeId = 2;
        console.log(this.supplierEdit);
     //   this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        console.log(this.supplierEdit);
        if (this.isNewSupplier) {
            this.supplierService
                .addSupplier(this.supplierEdit)
                .subscribe(result => {
                    this.saveSuccessHelper(result),
                        error => this.saveFailedHelper(error);
                });
        } else {
            console.log("Editing mode ...");
            this.supplierService
                .editSupplier(this.supplierEdit, this.supplierEdit.id)
                .subscribe(
                    (sup: Supplier) => this.saveSuccessHelper(sup),
                    error => this.saveFailedHelper(error)
                );
        }
    }

    private saveSuccessHelper(supplier: Supplier) {
        Object.assign(this.supplierEdit, supplier);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.supplier, this.supplierEdit);
        this.supplierEdit = new Supplier();
        this.resetForm();

        // if (this.isNewSupplier)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.supplier.nameAr +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.supplier.nameAr +
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
        this.supplierEdit = this.supplier = new Supplier();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage(
            "إغلاق",
            "تم تجاهل العملية",
            MessageSeverity.default
        );
        this.alertService.resetStickyMessage();
        this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.supplierEdit = this.supplier = new Supplier();
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

    private onCurrentUserDataLoadSuccessful(itemCategories: Supplier[]) {
        this.alertService.stopLoadingMessage();
        this.allSupplieregoryParent = itemCategories;
        console.error(itemCategories);
    }

    private onCurrentUserDataLoadFailed(error: any) {
      /*  this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.supplier = new Supplier();
    }
}
