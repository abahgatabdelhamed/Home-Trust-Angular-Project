import { saveAs } from 'file-saver';

import { AccountService } from "./../../../../services/account.service";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Utilities } from "../../../../services/utilities";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { Accounting, AccountingInterface } from '../../../accounting/models/accounting.model';
import { AppTranslationService } from '../../../../services/app-translation.service';

import { PrinterSettingsService } from '../../services/printer-settings.service';
import { AccountingService } from '../../../accounting/services/accounting.service';
import { PrintAccService } from '../../services/acc.print.service';
import { AccPDFService } from '../../services/accounting.pdf.service';
import { PeopleSearchService } from '../../../shared/services/people-search.service';
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
@Component({
    selector: "accounting-modal",
    templateUrl: "./accountingtree-modal.component.html",
    styleUrls: ["./accountingtree-modal.component.css"]
})
export class AccountingTableInfoComponent {
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
    public printerHeader = '';
    public people=[]
    public person
    public accountingEdit: AccountingInterface;
    public formResetToggle = true;
    public allAccountingegoryParent: Accounting[] = [];
    public changesFailedCallback: () => void;
    public people3$: Observable<any[]>;
    public people3input$ = new Subject<string>();
    public people3Loading: boolean = false;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountingService: AccountingService,
        private settingService: PrinterSettingsService,
        private pdfService : AccPDFService,
        private printer: PrintAccService,
        private peopleSearchService:PeopleSearchService,
        private ref:ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.accountingService.getInitialAccountinng().subscribe(res => {
            this.initial = res;
             console.log(this.initial);
         })

         this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
    }

    saveAndPrint() {
        this.save(true);
    }

    printDocumnent() {
        this.printer.printDocument(this.accountingEdit, "حساب", this.printerHeader);
    }

    exportAsPDFDocumnent() {
        this.pdfService.createPDF(this.accountingEdit, 'حساب', this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `account-${new Date().toLocaleString()}.pdf`);
        });
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
        this.loadPeople3();
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
            this.person = {
                nameAr: this.accountingEdit.personName
            };
            this.edit();
            this.loadPeople3();
           
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

    private save(print = false) {
        this.isSaving = true;
        // this.alertService.startLoadingMessage("Saving changes...");
        if (this.isNewAccounting) {
            console.log(this.accountingEdit);
            this.accountingService.addAccounting(this.accountingEdit).subscribe(res => this.saveSuccessHelper(res, print), err => this.saveFailedHelper(err));
        } else {
            console.log("updating .........", this.accounting["id"]);
            this.accountingService.editAccounting(this.accountingEdit, this.accountingEdit['id']).subscribe(res => this.saveSuccessHelper(res, print), err => this.saveFailedHelper(err));
        }
        // this.dailyDocService
        //     .updateAccounting(this.accountingEdit, this.accounting["id"])
        //     .subscribe(res => {
        //         this.saveSuccessHelper(res);
        //     });

    }

    private saveSuccessHelper(accounting: AccountingInterface, print) {
        console.log(accounting);
        let i = 0;
        while(i < 1 && print) {
            this.printer.printDocument(this.accountingEdit, 'حساب', this.printerHeader);
            i = 1;
        }
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
      /*  this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            "Save Error",
            "The below errors occured whilst saving your changes:",
            MessageSeverity.error,
            error
        );*/
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.accountingEdit = this.accounting = new Accounting();
        this.showValidationErrors = false;
        this.resetForm();
       /* this.alertService.showMessage(
            this.gT("messages.closing"),
            this.gT("messages.processIgnored"),
            MessageSeverity.default
        );*/
        //this.alertService.resetStickyMessage();
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

    handleCategoryChange(e) {
        const cat = this.initial['accountCategories'].find(m => m.id == e.target.value);
        console.log('current cat is', cat);
        if (cat) {
            this.accountingEdit.accountCategoryName = cat.name;
        }
    }

    handleAmountChange(e) {
        this.accountingEdit.InitialBalance = e.target.value;
        console.log('amount is', e.target.value)
    }

    handleDefaultChange(e) {
        console.log('check', e.target.value);
    }

    handleNameChange(e) {
        this.accountingEdit.name = e.target.value;

    }

    handlePersonChange(e) {
        console.log(e)
       /* const person = this.initial['people'].find(m => m.id == e.target.value);
        console.log('current per is', person);
       if(person) {

       */
       // this.accountingEdit.id = e.id;
       this.person=e
       this.accountingEdit.personId=e.id
        this.accountingEdit.personName = e.nameAr;
       console.log(     this.accountingEdit.personName)
        //}
    }

    private onCurrentUserDataLoadFailed(error: any) {
        /*this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.accounting = new Accounting();
    }

    searchPeople(event){
        console.log(event)
        //  this.peopleSearchService.getSearchPeopleEndpoint(event).subscribe(res=>{
        //     this.people=res
        //  })
    }
    
    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default people
            this.people3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.people3Loading = true)),
                switchMap(term =>
                    this.peopleSearchService.getSearchPeopleEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.people3Loading = false))
                    )
                )
            )
        );
    }
}
