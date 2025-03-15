import { Component, OnInit, ViewChild } from "@angular/core";

import { Router } from "@angular/router";
import { AppTranslationService } from "../../../../services/app-translation.service";
import {
    ReceiptDocument,
    ReceiptDocumentInterface
} from "../../../../models/receipt-documents";
import { Utilities } from "../../../../services/utilities";
import {
    MessageSeverity,
    AlertService
} from "../../../../services/alert.service";
import { ReceiptDocService } from "../../services/receipt-doc.service";

@Component({
    selector: "receipt-info",
    templateUrl: "./receipt-doc-info.component.html",
    styleUrls: ["./receipt-doc-info.component.css"]
})
export class ReceiptDocumentInfoComponent {
    public isItReceiptDocumentMode: boolean = true;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewReceiptDocument = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public receipt: ReceiptDocument = new ReceiptDocument();
    public uniqueId: string = Utilities.uniqueId();
    public receiptEdit: ReceiptDocumentInterface;
    public formResetToggle = true;
    public allReceiptDocumentegoryParent: ReceiptDocument[] = [];
    public changesFailedCallback: () => void;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private receiptService: ReceiptDocService,
        private translationService: AppTranslationService,
        private router: Router
    ) {}

    ngOnInit() {
        // this.receiptService.getAccounts().subscribe(res => console.log(res));
    }

    private loadCurrentReceiptDocumentData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);

    newReceiptDocument() {
        this.isNewReceiptDocument = true;
        this.receipt = this.receiptEdit = new ReceiptDocument();
        this.edit();
        return this.receiptEdit;
    }

    editReceiptDocument(receipt: ReceiptDocument) {
        if (receipt) {
            this.isNewReceiptDocument = false;
            this.receipt = new ReceiptDocument();
            this.receiptEdit = new ReceiptDocument();
            Object.assign(this.receipt, receipt);
            Object.assign(this.receiptEdit, receipt);
            this.edit();
            return this.receiptEdit;
        } else {
            return this.newReceiptDocument();
        }
    }

    displayReceiptDocument(receipt: ReceiptDocument) {
        if (receipt) {
            this.isNewReceiptDocument = false;
            this.receipt = new ReceiptDocument();
            this.receiptEdit = new ReceiptDocument();
            Object.assign(this.receipt, receipt);
            Object.assign(this.receiptEdit, receipt);
            this.isEditMode = false;
        } else {
            this.receipt = new ReceiptDocument();
            this.receiptEdit = new ReceiptDocument();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.receiptEdit) this.receiptEdit = new ReceiptDocument();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    public save() {
        this.isSaving = true;
        console.log(this.receiptEdit);
     //   this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        console.log(this.receiptEdit);
        if (this.isNewReceiptDocument) {
            this.receiptService
            // this.receiptService
            //     .addReceiptDocument(this.receiptEdit)
            //     .subscribe(result => {
            //         this.saveSuccessHelper(result),
            //             error => this.saveFailedHelper(error);
            //     });
            console.log(this.receiptEdit)
            this.receiptService.newReceiptDoc(this.receiptEdit).subscribe(res => {
                this.saveSuccessHelper(res),
                error => this.saveFailedHelper(error)
            })
        } else {
            console.log("Editing mode ...");
            console.log(this.receiptEdit)
            this.receiptService.updateReceiptDoc(this.receiptEdit)
                .subscribe(res => {
                    this.saveSuccessHelper(res),
                    error => this.saveFailedHelper(error)
                })
        }
    }

    private saveSuccessHelper(receipt: ReceiptDocument) {
        Object.assign(this.receiptEdit, receipt);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.receipt, this.receiptEdit);
        this.receiptEdit = new ReceiptDocument();
        this.resetForm();

        // if (this.isNewReceiptDocument)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.receipt.code +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.receipt.code +
        //             " " +
        //             this.gT("shared.Successfully"),
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
    //    this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.receiptEdit = this.receipt = new ReceiptDocument();

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
        this.receiptEdit = this.receipt = new ReceiptDocument();
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

    private onCurrentUserDataLoadSuccessful(itemCategories: ReceiptDocument[]) {
        this.alertService.stopLoadingMessage();
        this.allReceiptDocumentegoryParent = itemCategories;
        console.error(itemCategories);
    }

    private onCurrentUserDataLoadFailed(error: any) {
     /*   this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.receipt = new ReceiptDocument();
    }
}
