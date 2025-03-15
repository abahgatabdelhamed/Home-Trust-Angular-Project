import { SettingsService } from './../../../../services/settings.service';
import { saveAs } from 'file-saver';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Utilities } from "../../../../services/utilities";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap,
    catchError,
    count
} from "rxjs/operators";
import { Subject, Observable, Subscription } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { ReceiptDocService } from "../../../sales/services/receipt-doc.service";
import { AppTranslationService } from "../../../../services/app-translation.service";
import {
    ReceiptDocument,
    ReceiptDocumentInterface
} from "../../../../models/receipt-documents";
import { D } from "@angular/core/src/render3";
import { PrintDocsService } from "../../services/receipt-docs.print.service";
import { PDFService } from "../../services/pdf.service";
import { PrinterSettingsService } from '../../../definitions/services/printer-settings.service';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { AccountSearchService } from '../../services/account-search.service';

@Component({
    selector: "daily-ad-info",
    templateUrl: "./daily-advanced-info.component.html",
    styleUrls: ["./daily-advanced-info.component.css"]
})
export class DailyDocumentInfoComponent {
    showPersonDebt = false;
    dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    printable = { personDebt: '', fromName: '', toName: '', amount: 0, notes: '', code: '',dueAmount:null ,date: new Date().toLocaleDateString("ar-EG", this.dateOptions) };
    isSales: boolean = false;
    fromValueChanged = false;
    toValueChanged = false;
    personDebt: any;
    originalPersonDebt: any;
    printerHeader = '';
    hasClickedEdit = false;
    toAccount:any
    fromAccount:any
    editingDoc = { editing: false, target: 0 };
    public automatedCode;
    public accounts = [];
    public accountsSales = [];
    public whatToLoad = { name: null, type: "", printerLabel: '' };
    public initial: any;
    public isAdvanced: boolean = false;
    public changesSavedCallback: (code) => void;
    public changesCancelledCallback: () => void;
    
    public isNewDailyDocument = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public dailyDoc: ReceiptDocument = new ReceiptDocument();
    public dailyDocAdvanced: ReceiptDocument[] = [];
    public uniqueId: string = Utilities.uniqueId();
    public dailyDocEdit: ReceiptDocumentInterface;
    public formResetToggle = true;
    public allDailyDocumentegoryParent: ReceiptDocument[] = [];
    public changesFailedCallback: () => void;
    public account$: Observable<any[]>;
    public accountinput$ = new Subject<string>();
    public accountLoading: boolean = false;
    public accountto$: Observable<any[]>;
    public accountinputto$ = new Subject<string>();
    public accountLoadingto: boolean = false;
    @ViewChild("f")
    private form;
    personDebtChanged: boolean = false;
    ispayment: boolean=false;

    constructor(
        private pdfService: PDFService,
        private alertService: AlertService,
        private dailyDocService: ReceiptDocService,
        private translationService: AppTranslationService,
        public router: Router,
        private printer: PrintDocsService,
        private settingService: PrinterSettingsService,
        private ref: ChangeDetectorRef,
        private accountSearchService:AccountSearchService
    ) { }

    ngOnInit() {
        this.loadAccounts3()
        this.loadAccountsto3()
        if (this.dailyDoc && this.dailyDoc.personDebt != null && this.dailyDoc.personDebt != undefined) {
            this.printable['personDebt'] = this.dailyDoc.personDebt.toString();

            // this.personDebt = this.dailyDoc.personDebt;
        }
        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
        this.setType(this.router.url);
        if (this.router.url == "/accounting/daily-advanced") {
            this.isAdvanced = true;
        } else {
            this.isAdvanced = false;
        }

        this.dailyDocService.getInitial().subscribe(res => {
            this.accounts = res["accounts"];
            this.accounts.forEach(e => {
                if (e.isDefault == true)
                    this.accountsSales.push(e);
            });
            this.automatedCode = res["code"];
            console.log("init is ", res);
        });
        console.log(this.dailyDocEdit);
    }

    handleAdd(e) {
        if (!this.dailyDocEdit.fromAccountId || !this.dailyDocEdit.toAccountId || !this.dailyDocEdit.amount)
            return;
        this.dailyDocEdit.fromAccount = this.accounts.find(
            e => e.id == this.dailyDocEdit["fromAccountId"]
        );

        this.dailyDocEdit.toAccount = this.accounts.find(
            e => e.id == this.dailyDocEdit["toAccountId"]
        );
        this.dailyDocAdvanced.push(this.dailyDocEdit);
        this.dailyDocEdit = new ReceiptDocument();
        this.dailyDocEdit.fromAccountId = this.dailyDocEdit.toAccountId = null;
    }

    private loadCurrentDailyDocumentData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);
    newDailyDocument() {
        this.isNewDailyDocument = true;
        this.dailyDoc = this.dailyDocEdit = new ReceiptDocument();
        this.dailyDocEdit.date = new Date();
        this.edit();
        return this.dailyDocEdit;
    }

    exportAsPDFDocumnent() {
        this.printable.amount = this.dailyDocEdit.amount;
        this.printable.code = this.dailyDocEdit.code;
        this.printable.notes = this.dailyDocEdit.notes;
        this.printable.date = this.dailyDocEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
        this.printable.fromName = this.dailyDocEdit.fromAccount.name;
        this.printable.toName = this.dailyDocEdit.toAccount.name;
        this.printable.dueAmount=this.dailyDocEdit.dueAmount
        this.pdfService.createPDF(this.printable, this.isSales, this.whatToLoad.printerLabel, this.printerHeader,this.ispayment).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `reciept-docs-${new Date().toLocaleString()}.pdf`);
        });
    }

    editDailyDocument(dailyDoc: ReceiptDocumentInterface) {
        if (dailyDoc) {
            this.isNewDailyDocument = false;
            this.personDebt = dailyDoc.personDebt;
            this.originalPersonDebt = dailyDoc.personDebt;
            this.showPersonDebt = typeof (this.personDebt) == "number";
            this.dailyDoc = new ReceiptDocument();
            this.dailyDocEdit = new ReceiptDocument();
            Object.assign(this.dailyDoc, dailyDoc);
            Object.assign(this.dailyDocEdit, dailyDoc);
            this.fromAccount=this.dailyDoc.fromAccount.name
            this.toAccount=this.dailyDoc.toAccount.name
            this.printable.fromName=this.dailyDoc.fromAccount.name
            this.printable.toName=this.dailyDoc.toAccount.name
            this.edit();
            return this.dailyDocEdit;
        } else {
            this.dailyDoc = new ReceiptDocument();
            this.dailyDocEdit = new ReceiptDocument();
            return this.newDailyDocument();
        }
    }

    displayDailyDocument(dailyDoc: ReceiptDocumentInterface) {
        if (dailyDoc) {
            console.log("editing mode ..");
            this.isNewDailyDocument = false;
            this.dailyDoc = new ReceiptDocument();
            this.dailyDocEdit = new ReceiptDocument();
            console.log(dailyDoc);
            Object.assign(this.dailyDoc, dailyDoc);
            Object.assign(this.dailyDocEdit, dailyDoc);
            this.fromAccount=this.dailyDoc.fromAccount.name
            this.toAccount=this.dailyDoc.toAccount.name
            this.isEditMode = false;
            this.accounts.forEach(e => {
                e["fromIsSelected"] = this.dailyDocEdit.fromAccount.id == e.id;
                e["toIsSelected"] = this.dailyDocEdit.toAccount.id == e.id;
            });
            this.personDebt = this.dailyDoc.personDebt;
            this.dailyDoc.fromAccountId = this.dailyDocEdit.fromAccountId = this.dailyDocEdit.fromAccount.id;
            this.dailyDocEdit.toAccountId = this.dailyDocEdit.toAccountId = this.dailyDocEdit.toAccount.id;
            console.log(this.dailyDocEdit);
        } else {
            this.dailyDoc = new ReceiptDocument();
            this.dailyDocEdit = new ReceiptDocument();
            this.isEditMode = false;
        }
        console.log(this.dailyDoc);
    }

    private edit() {
        if (!this.dailyDocEdit) this.dailyDocEdit = new ReceiptDocument();
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    deleteDocAdvanced(doc) {
        const index = this.dailyDocAdvanced.indexOf(doc);
        this.dailyDocAdvanced.splice(index, 1);
    }

    saveWithoutPrint() {
        if(this.isSaving==true)
        return
        this.isSaving = true;
        //this.dailyDoc.code = this.dailyDocEdit.code = this.automatedCode;
        
        this.dailyDocEdit.receiptDocumentTypeCode = this.dailyDoc.receiptDocumentTypeCode = this.whatToLoad.type;
        console.log(this.dailyDocEdit);
        if (this.isAdvanced) {
            //this.dailyDocAdvanced.forEach(e => (e.code = this.automatedCode));
            this.dailyDocAdvanced.forEach(e => e.receiptDocumentTypeCode = 'DAILY');
            console.log('advanced are', this.dailyDocAdvanced);
            this.dailyDocService
                .addAdvabcedDocs(this.dailyDocAdvanced)
                .subscribe(
                    res => this.saveSuccessHelper(res, false),
                    err => this.saveFailedHelper(err)
                );
        } else {
            if (this.isNewDailyDocument) {
                console.log("added is ", this.dailyDocEdit);
                this.dailyDocService
                    .newReceiptDoc(this.dailyDocEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    );
            } else {
                this.dailyDocService
                    .updateReceiptDoc(this.dailyDocEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    );
            }
            console.log(this.dailyDoc);
        }
    }

    private save() {
        if(this.isSaving==true)
        return
        this.isSaving = true;
        //this.dailyDoc.code = this.dailyDocEdit.code = this.automatedCode;
        this.dailyDocEdit.receiptDocumentTypeCode = this.dailyDoc.receiptDocumentTypeCode = this.whatToLoad.type;
        console.log(this.dailyDocEdit);
        if (this.isAdvanced) {
            //this.dailyDocAdvanced.forEach(e => (e.code = this.automatedCode));
            this.dailyDocAdvanced.forEach(e => e.receiptDocumentTypeCode = 'DAILY');
            console.log('advanced are', this.dailyDocAdvanced);
            this.dailyDocService
                .addAdvabcedDocs(this.dailyDocAdvanced)
                .subscribe(
                    res => this.saveSuccessHelper(res, false),
                    err => this.saveFailedHelper(err)
                );
        } else {
            if (this.isNewDailyDocument) {
                console.log("added is ", this.dailyDocEdit);
                this.dailyDocService
                    .newReceiptDoc(this.dailyDocEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, true),
                        err => this.saveFailedHelper(err)
                    );
            } else {
                this.dailyDocService
                    .updateReceiptDoc(this.dailyDocEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, true),
                        err => this.saveFailedHelper(err)
                    );
            }
            console.log(this.dailyDoc);
        }
    }

    printDocumnent() {
        console.log(this.dailyDocEdit)
            this.ref.detectChanges()
        if (this.dailyDocEdit) {
            this.printable.amount = this.dailyDocEdit.amount;
            this.printable.code = this.dailyDocEdit.code;
            // this.printable.fromName = this.dailyDocEdit.fromAccount ? this.dailyDocEdit.fromAccount.name:this.fromAccount;
            // this.printable.toName = this.dailyDocEdit.toAccount ?this.dailyDocEdit.toAccount.name: this.toAccount ;
            if (this.dailyDoc.personDebt != null && this.dailyDoc.personDebt != undefined) {
                this.printable['personDebt'] = this.dailyDoc.personDebt.toString();

                console.log('ppp', this.printable['personDebt'])
            }
            else
                this.printable['personDebt'] = "0";
            this.printable.notes = this.dailyDocEdit.notes;
            this.printable.date = this.dailyDocEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
        }
        if (this.dailyDoc.personDebt != null && this.dailyDoc.personDebt != undefined)
            this.printable['personDebt'] = this.dailyDoc.personDebt.toString();
        // if (!this.fromValueChanged) {
        //     this.printable.fromName = this.dailyDocEdit.fromAccount ?this.dailyDocEdit.fromAccount.name: this.fromAccount.name ;
        // }
        // if (!this.toValueChanged) {
        //     this.printable.toName = this.dailyDocEdit.toAccount ?this.dailyDocEdit.toAccount.name:  this.toAccount.name;
        // }
        this.printable.personDebt = this.personDebt;
        this.printable.dueAmount=this.dailyDocEdit.dueAmount
        console.log(this.ispayment)
        console.log(this.printable)
        this.printer.printDocument(this.printable, this.isSales, this.whatToLoad.printerLabel, this.printerHeader,this.ispayment);
    }


    isPrintable() {
        if (this.isAdvanced && this.isEditMode) return false;
        else return true;
    }

    setType(url) {
        switch (url) {
            case "/accounting/daily-advanced":
                this.whatToLoad = { name: "daily", type: "DAILY", printerLabel: 'قيد يومي' };
                this.isAdvanced = true;
                break;
            case "/accounting/daily":
                this.whatToLoad = { name: "daily", type: "DAILY", printerLabel: 'قيد يومي' };
                this.isAdvanced = false;
                break;
            case "/accounting/deposits":
                this.whatToLoad = { name: "deposits", type: "DEPOSITS", printerLabel: 'قيد إيداع و سحب' };
                this.isAdvanced = false;
                break;
            case "/accounting/receipts":
                this.whatToLoad = {
                    name: "receipts",
                    type: "RECEIPTSDOCUMENTS",
                    printerLabel: 'قيد مقبوضات'
                };
                this.isAdvanced = false;
                break;
            case "/accounting/payments":
                this.whatToLoad = { name: "payments", type: "PAYMENTS", printerLabel: 'قيد مدفوعات' };
                this.isAdvanced = false;
                break;
            case "/accounting/receipt-documents":
                this.whatToLoad = {
                    name: "receipt-documents",
                    type: "SALERECEIPT",
                    printerLabel: 'سند قبض'
                };
                this.isSales = true;
                this.isAdvanced = false;
                break;
            case "/accounting/payment-documents":
                    this.whatToLoad = {
                        name: "payment-documents",
                        type: "PAYMENTRECEIPT",
                        printerLabel: 'سند دفع'
                    };
                    this.ispayment=true
                    this.isSales = true;
                    this.isAdvanced = false;
                    break;
            default:
                break;
        }
    }

    private mapDocToPrint(dailyDoc: ReceiptDocument) {
        const fromAccount = this.accounts.find(e => e.id == dailyDoc.fromAccountId);
        const toAccount = this.accounts.find(e => e.id == dailyDoc.toAccountId);
        const result = { amount: dailyDoc.amount, fromAccount, toAccount, date: dailyDoc.date };
        return result;
    }

    handleFromAccountChange(id) {
        console.log('changed to', id);
        const account = this.accounts.find(e => e.id == id);
        this.fromValueChanged = true;
        if (account) {
            this.printable.fromName = account['name'];
        }
        console.log('prinatable', this.printable);

    }

    handleToAccountChange(id) {
        console.log('changed to', id);
        const account = this.accounts.find(e => e.id == id);
        this.toValueChanged = true;
        console.log('account is', account);
        if (account) {
            console.log('person');
          this.ispayment?(this.printable.fromName = account['name'],this.dailyDocEdit.fromAccount=account): ( this.printable.toName = account['name'],this.dailyDocEdit.toAccount=account);
        }
        console.log('prinatable', this.printable);
    }

    handleAccChange(e: MouseEvent) {
        if (this.isSales) return;
        console.log(this.dailyDocEdit.toAccountId);
        const id = this.dailyDocEdit.toAccountId;
        const account = this.accounts.find(e => e.id == id);
        if (account) {
            console.log('account now is', account)
            //this.personDebt = this.dailyDocService.getPersonBalance(account['personId'])
            //.subscribe(res => {
            //    console.log('person has', res);
            //    this.personDebt = res;
            //    this.showPersonDebt = typeof(this.personDebt) == "number";

            //});
        }
    }

    handleFromAccChange(e: MouseEvent) {
        console.log('sales moode');
        if (!this.isSales) return;
        console.log(this.dailyDocEdit.toAccountId);
        const id = e.target['value'];
        const account = this.accounts.find(e => e.id == id);
        if (account && this.isSales) {
            console.log('account now issssss', account)
            this.personDebt = this.dailyDocService.getPersonBalance(account['personId'])
                .subscribe(res => {
                    console.log('person has', res);
                    this.personDebt = res;
                    this.showPersonDebt = typeof (this.personDebt) == "number";
                });
        }
    }

    handleAmountChange(e) {
        if (this.personDebt) {
            this.personDebt = this.originalPersonDebt - (+e.target['value']);
            this.printable.amount = e.target.value;
            this.personDebtChanged = true;
            this.printable.amount = +e.target['value'];
        }
    }

    handleDateChanging(e) {
        console.log('date changed to', e);
        if (e) {
            this.printable.date = e.toLocaleDateString("ar-EG", this.dateOptions);
        }
        console.log(this.printable)
    }

    private saveSuccessHelper(dailyDoc: ReceiptDocumentInterface, printable) {
        if (printable) {
            setTimeout(() => {
                if (this.dailyDoc.personDebt != null && this.dailyDoc.personDebt != undefined) {
                    this.printable['personDebt'] = this.dailyDoc.personDebt.toString();
                } else
                    this.printable['personDebt'] = "0";
                if (this.dailyDoc.personDebt != null && this.dailyDoc.personDebt != undefined)
                    this.printable['personDebt'] = this.dailyDoc.personDebt.toString();
                this.printable.personDebt = this.personDebt;
                this.printable.amount = dailyDoc.amount;
                this.printable.code = dailyDoc.code;
                this.printable.notes = dailyDoc.notes;
                this.printable.dueAmount=dailyDoc.dueAmount
                console.log(this.fromAccount,this.toAccount)
                this.printable.fromName = dailyDoc.fromAccount ? dailyDoc.fromAccount.name:this.fromAccount;
                this.printable.toName = dailyDoc.toAccount ?dailyDoc.toAccount.name :this.toAccount;
               
                console.log('result is', this.printable);
                this.printer.printDocument(this.printable, this.isSales, this.whatToLoad.printerLabel, this.printerHeader,this.ispayment);
            }, 0);
        }
        Object.assign(this.dailyDocEdit, dailyDoc);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;


        Object.assign(this.dailyDoc, this.dailyDocEdit);

        this.dailyDocEdit = new ReceiptDocument();
        this.resetForm();

        // if (this.isNewDailyDocument)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //         " " +
        //         this.dailyDoc.code +
        //         " " +
        //         this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //         " " +
        //         this.dailyDoc.code +
        //         " " +
        //         this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback(this.dailyDoc.code);
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
      //  this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.dailyDocEdit = this.dailyDoc = new ReceiptDocument();
        this.showValidationErrors = false;
        this.personDebt = '';
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

    canPrint() {
        if (this.isAdvanced && this.isEditMode) return false;
        else if (!this.isEditMode) return false;
        else return true;
    }


    saveEdited(e) {
        this.editingDoc = { editing: false, target: null };
        this.hasClickedEdit = false;
        this.dailyDocEdit = new ReceiptDocument();
        this.dailyDocEdit.fromAccountId = this.dailyDocEdit.toAccountId = null;
    }


    editDoc(adv) {
        this.dailyDocEdit = adv;
        this.editingDoc = { editing: true, target: adv["id"] };
        this.hasClickedEdit = true;
        console.log(this.editingDoc);
    }
    private close() {
        this.dailyDocEdit = this.dailyDoc = new ReceiptDocument();
        this.personDebt = '';
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;
        if (this.changesSavedCallback) this.changesSavedCallback(this.dailyDoc.code);
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
 private loadAccounts3() {
        this.account$ = concat(
            of([]), // default people
            this.accountinput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.accountLoading = true)),
                switchMap(term =>
                    this.accountSearchService.getSearchAccountEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.accountLoading = false))
                    )
                )
            )
        );
    }
    private loadAccountsto3() {
        this.accountto$ = concat(
            of([]), // default people
            this.accountinputto$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.accountLoadingto = true)),
                switchMap(term =>
                    this.accountSearchService.getSearchAccountEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.accountLoadingto = false))
                    )
                )
            )
        );
    }
    accountSearchSelected(e,accountType:string){
        
        accountType=='toAccount'?( this.dailyDocEdit.toAccountId=e.id,this.toAccount=e,this.printable.toName=e.name,this.dailyDocEdit.toAccount=e):( this.dailyDocEdit.fromAccountId=e.id,this.dailyDocEdit.fromAccount=e,this.fromAccount,this.printable.fromName=e.fromName)
       // accountType=='toAccount'?( this.dailyDoc.toAccountId=e.id,this.toAccount=e,this.printable.toName=e.name):( this.dailyDoc.fromAccountId=e.id,this.fromAccount,this.printable.fromName=e.fromName)
        
        console.log(e,this.dailyDocEdit.toAccountId,this.dailyDocEdit.fromAccountId,this.toAccount,this.fromAccount)
    }
    accountSelected(e,accountType:string){
        console.log(e)
        accountType=='toAccount'? this.dailyDocEdit.toAccountId=e.target.value: this.dailyDocEdit.fromAccountId=e.target.value
       // accountType=='toAccount'? this.dailyDoc.toAccountId=e.target.value: this.dailyDoc.fromAccountId=e.target.value
       
        console.log(e,this.dailyDoc.toAccountId,this.dailyDocEdit.fromAccountId,this.toAccount,this.fromAccount)
         
    }
   
    private onCurrentUserDataLoadSuccessful(
        itemCategories: ReceiptDocumentInterface[]
    ) {
        this.alertService.stopLoadingMessage();
        this.allDailyDocumentegoryParent = itemCategories;
        console.error(itemCategories);
    }

    private onCurrentUserDataLoadFailed(error: any) {
       /* this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/

        this.dailyDoc;
    }
    
}
