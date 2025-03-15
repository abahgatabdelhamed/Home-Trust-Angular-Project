//import { Component, OnInit, ViewChild } from "@angular/core";
//import { Router } from "@angular/router";
//import { Utilities } from "../../../../services/utilities";
//import {
//    AlertService,
//    MessageSeverity
//} from "../../../../services/alert.service";
//import { ReceiptDocService } from "../../../sales/services/receipt-doc.service";
//import { AppTranslationService } from "../../../../services/app-translation.service";
//import {
//    ReceiptDocument,
//    ReceiptDocumentInterface
//} from "../../../../models/receipt-documents";

//@Component({
//    selector: "daily-ad-info",
//    templateUrl: "./daily-advanced-info.component.html",
//    styleUrls: ["./daily-advanced-info.component.css"]
//})
//export class DailyDocumentInfoComponent {
//    public accounts = [];
//    public initial: any;
//    public isAdvanced: boolean = false;
//    public changesSavedCallback: () => void;
//    public changesCancelledCallback: () => void;
//    public isNewDailyDocument = false;
//    public isEditMode = false;
//    public isSaving = false;
//    public showValidationErrors = false;
//    public dailyDoc: ReceiptDocument = new ReceiptDocument();
//    public dailyDocAdvanced: ReceiptDocument[] = [];
//    public uniqueId: string = Utilities.uniqueId();
//    public dailyDocEdit: ReceiptDocumentInterface;
//    public formResetToggle = true;
//    public allDailyDocumentegoryParent: ReceiptDocument[] = [];
//    public changesFailedCallback: () => void;

//    @ViewChild("f")
//    private form;

//    constructor(
//        private alertService: AlertService,
//        private dailyDocService: ReceiptDocService,
//        private translationService: AppTranslationService,
//        private router: Router
//    ) { }

//    ngOnInit() {
//        if (this.router.url == "/accounting/daily-advanced") {
//            this.isAdvanced = true;
//            console.log("supplier mode is activated");
//        } else {
//            this.isAdvanced = false;
//            console.log("customer mode is activated");
//        }

//        this.dailyDocService.getInitial().subscribe(res => {
//            this.accounts = res["accounts"];
//            console.log("init is ", this.accounts);
//        });
//    }

//    handleAdd(e) {
//        if (!this.dailyDocEdit.fromAccountId || !this.dailyDocEdit.toAccountId)
//            return;
//        this.dailyDocEdit.fromAccount = this.accounts.find(
//            e => e.id == this.dailyDocEdit["fromAccountId"]
//        );

//        this.dailyDocEdit.toAccount = this.accounts.find(
//            e => e.id == this.dailyDocEdit["toAccountId"]
//        );
//        this.dailyDocAdvanced.push(this.dailyDocEdit);

//        this.dailyDocEdit = new ReceiptDocument();
//        this.dailyDocEdit.fromAccountId = this.dailyDocEdit.toAccountId = null;
//    }

//    private loadCurrentDailyDocumentData() {
//        //data is passed by the parent, why would you load it from the server?
//    }
//    gT = (key: string) => this.translationService.getTranslation(key);

//    newDailyDocument() {
//        this.isNewDailyDocument = true;
//        this.dailyDoc = this.dailyDocEdit = new ReceiptDocument();
//        this.dailyDocEdit.date = new Date();
//        this.edit();
//        return this.dailyDocEdit;
//    }

//    editDailyDocument(dailyDoc: ReceiptDocumentInterface) {
//        if (dailyDoc) {
//            this.isNewDailyDocument = false;
//            this.dailyDoc = new ReceiptDocument();
//            this.dailyDocEdit = new ReceiptDocument();
//            Object.assign(this.dailyDoc, dailyDoc);
//            Object.assign(this.dailyDocEdit, dailyDoc);
//            this.edit();
//            return this.dailyDocEdit;
//        } else {
//            this.dailyDoc = new ReceiptDocument();
//            this.dailyDocEdit = new ReceiptDocument();
//            return this.newDailyDocument();
//        }
//    }

//    displayDailyDocument(dailyDoc: ReceiptDocumentInterface) {
//        if (dailyDoc) {
//            this.isNewDailyDocument = false;
//            this.dailyDoc = new ReceiptDocument();
//            this.dailyDocEdit = new ReceiptDocument();
//            console.log(dailyDoc);
//            Object.assign(this.dailyDoc, dailyDoc);
//            Object.assign(this.dailyDocEdit, dailyDoc);
//            this.isEditMode = false;
//        } else {
//            this.dailyDoc = new ReceiptDocument();
//            this.dailyDocEdit = new ReceiptDocument();
//            this.isEditMode = false;
//        }
//        console.log(this.dailyDoc);
//    }

//    private edit() {
//        if (!this.dailyDocEdit) this.dailyDocEdit = new ReceiptDocument();
//        this.isEditMode = true;
//        this.showValidationErrors = true;
//    }

//    deleteDocAdvanced(doc) {
//        const index = this.dailyDocAdvanced.indexOf(doc);
//        this.dailyDocAdvanced.splice(index, 1);
//    }

//    private save() {
//        if (this.isAdvanced) {
//            this.dailyDocService.addAdvabcedDocs(this.dailyDocAdvanced).subscribe(
//                res => this.saveSuccessHelper(res), err => this.saveFailedHelper(err)
//            );
//        }
//        else {
//            if (this.newDailyDocument) {
//                this.dailyDocService.newReceiptDoc(this.dailyDocEdit).subscribe(res => this.saveSuccessHelper(res), err => this.saveFailedHelper(err));
//            }
//            else {
//                this.dailyDocService.updateReceiptDoc(this.dailyDocEdit).subscribe(res => this.saveSuccessHelper(res), err => this.saveFailedHelper(err));
//            }
//        }
//} 

//    private saveSuccessHelper(dailyDoc: ReceiptDocumentInterface) {
//        console.log(dailyDoc);
//        Object.assign(this.dailyDocEdit, dailyDoc);
//        this.isSaving = false;
//        this.alertService.stopLoadingMessage();
//        this.showValidationErrors = false;

//        Object.assign(this.dailyDoc, this.dailyDocEdit);
//        this.dailyDocEdit = new ReceiptDocument();
//        this.resetForm();

//        if (this.isNewDailyDocument)
//            this.alertService.showMessage(
//                this.gT("shared.OperationSucceded"),
//                this.gT("shared.CreationSucceded") +
//                    " " +
//                    this.dailyDoc.code +
//                    " " +
//                    this.gT("shared.Successfully"),
//                MessageSeverity.success
//            );
//        else
//            this.alertService.showMessage(
//                this.gT("shared.OperationSucceded"),
//                this.gT("shared.ChangesSaved") +
//                    " " +
//                    this.dailyDoc.code +
//                    " " +
//                    this.gT("shared.Successfully"),
//                MessageSeverity.success
//            );

//        this.isEditMode = false;

//        if (this.changesSavedCallback) this.changesSavedCallback();
//    }

//    private saveFailedHelper(error: any) {
//        this.isSaving = false;
//        this.alertService.stopLoadingMessage();
//        this.alertService.showStickyMessage(
//            "Save Error",
//            "The below errors occured whilst saving your changes:",
//            MessageSeverity.error,
//            error
//        );
//        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

//        if (this.changesFailedCallback) this.changesFailedCallback();
//    }

//    private showErrorAlert(caption: string, message: string) {
//        this.alertService.showMessage(caption, message, MessageSeverity.error);
//    }

//    private cancel() {
//        this.dailyDocEdit = this.dailyDoc = new ReceiptDocument();

//        this.showValidationErrors = false;
//        this.resetForm();

//        this.alertService.showMessage(
//            "إغلاق",
//            "تم تجاهل العملية",
//            MessageSeverity.default
//        );
//        this.alertService.resetStickyMessage();
//        this.isEditMode = false;

//        if (this.changesCancelledCallback) this.changesCancelledCallback();
//    }

//    private close() {
//        this.dailyDocEdit = this.dailyDoc;
//        this.showValidationErrors = false;
//        this.resetForm();
//        this.isEditMode = false;
//        if (this.changesSavedCallback) this.changesSavedCallback();
//    }

//    resetForm(replace = false) {
//        if (!replace) {
//            this.form.reset();
//        } else {
//            this.formResetToggle = false;

//            setTimeout(() => {
//                this.formResetToggle = true;
//            });
//        }
//    }

//    private onCurrentUserDataLoadSuccessful(
//        itemCategories: ReceiptDocumentInterface[]
//    ) {
//        this.alertService.stopLoadingMessage();
//        this.allDailyDocumentegoryParent = itemCategories;
//        console.error(itemCategories);
//    }

//    private onCurrentUserDataLoadFailed(error: any) {
//        this.alertService.stopLoadingMessage();
//        this.alertService.showStickyMessage(
//            "Load Error",
//            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
//                error
//            )}"`,
//            MessageSeverity.error,
//            error
//        );

//        this.dailyDoc;
//    }
//}
