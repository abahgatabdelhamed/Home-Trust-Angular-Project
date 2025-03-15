import { saveAs } from 'file-saver';
import { SettingsService } from './../../../../services/settings.service';
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
import { Router } from "@angular/router";
import { SupplierPDFService } from "../../services/supplier.pdf.service";
import { PrinterSettingsService } from '../../services/printer-settings.service';
import { PrintSupDocsService } from '../../services/supplier.print.service';

@Component({
    selector: "supplier-info",
    templateUrl: "./supplier-info.component.html",
    styleUrls: ["./supplier-info.component.css"]
})
export class SupplierInfoComponent {
    public isItSupplierMode: boolean = true;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewSupplier = false;
    public printerHeader = '';
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
        private translationService: AppTranslationService,
        private router: Router,
        private pdfService: SupplierPDFService,
        private settingService: PrinterSettingsService,
        private printer: PrintSupDocsService
    ) {}

    ngOnInit() {
        console.log("from ..");
        if (this.router.url == "/definitions/supplier") {
            this.isItSupplierMode = true;
        } else {
            this.isItSupplierMode = false;
        }

        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
    }


    saveAndPrint() {
        this.save(true);
    }


    exportAsPDFDocumnent() {
        this.pdfService.createPDF(this.supplierEdit, this.isItSupplierMode? 'مورد': 'عميل', this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `person-doc-${new Date().toLocaleString()}.pdf`);
        });
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

    printDocumnent() {
        this.printer.printDocument(this.supplierEdit, this.isItSupplierMode? 'مورد': 'عميل', this.printerHeader);
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

    private save(print = false) {
        this.isSaving = true;
        console.log('this is supplier and customer',this.supplierEdit);
        this.alertService.startLoadingMessage("Saving changes...");
        console.log(this.supplierEdit);
        if (this.isNewSupplier) {
            this.supplierEdit.personTypeId = this.isItSupplierMode ? 1 : 2;
            this.supplierService
                .addSupplier(this.supplierEdit)
                .subscribe(result => {
                    this.saveSuccessHelper(result, print),
                        error => this.saveFailedHelper(error);
                });
        } else {
            console.log("Editing mode ...");
            this.supplierService
                .editSupplier(this.supplierEdit, this.supplierEdit.id)
                .subscribe(
                    (sup: Supplier) => this.saveSuccessHelper(sup, print),
                    error => this.saveFailedHelper(error)
                );
        }
    }

    private saveSuccessHelper(supplier: Supplier, print) {
        let i = 0;
        while(i < 1 && print) {
            this.printer.printDocument(this.supplierEdit, this.isItSupplierMode? 'مورد': 'عميل', this.printerHeader);
            i = 1;
        }
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
        //this.alertService.stopLoadingMessage();
        /*this.alertService.showStickyMessage(
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
   //     this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.supplierEdit = this.supplier = new Supplier();

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
       /* this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/

        this.supplier = new Supplier();
    }
}
