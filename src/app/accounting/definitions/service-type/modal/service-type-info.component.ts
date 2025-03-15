import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { Utilities } from "../../../../services/utilities";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { Router } from "@angular/router";
import {
    ServiceType,
    ServiceTypeInterface
} from "../../../sales/models/service-type.model";
import { ServiceTypeService } from "../../services/service-type.service";
import { PrinterSettingsService } from "../../services/printer-settings.service";
import { ServiceTypePDFService } from "../../services/service.type.pdf.service";
import { PrintSerService } from '../../services/service.print.service';
import { SettingsService } from '../../../../services/settings.service';

@Component({
    selector: "service-type-info",
    templateUrl: "./service-type-info.component.html",
    styleUrls: ["./service-type-info.component.css"]
})
export class ServiceTypeInfoComponent {
    vatTypes;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewServiceType = false;
    public isEditMode = false;
    public printerHeader = '';
    public isSaving = false;
    public showValidationErrors = false;
    public serviceType: ServiceType = new ServiceType();
    public uniqueId: string = Utilities.uniqueId();
    public serviceTypeEdit: ServiceTypeInterface;
    public formResetToggle = true;
    public allServiceTypeegoryParent: ServiceType[] = [];
    public changesFailedCallback: () => void;

    @ViewChild("f")
    private form;
    isVatEnable: any;

    constructor(
        private alertService: AlertService,
        private serviceTypeService: ServiceTypeService,
        private translationService: AppTranslationService,
        private router: Router,
        private settingService: PrinterSettingsService,
        private pdfService : ServiceTypePDFService,
        private printer : PrintSerService,
        private settingsService:SettingsService
    ) {}

    ngOnInit() {
        this.settingsService.getSetting().subscribe(res=>{
            this.isVatEnable = res.isVatEnable;
       
        })
        this.serviceTypeService.getAllVatTypes().subscribe(res => {
            this.vatTypes = res['vatTypes'];
            this.vatTypes.splice(2,1) 
            console.log('vattypes are', this.vatTypes);
        })

        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
    }

    exportAsPDFDocumnent() {
        this.pdfService.createPDF(this.serviceTypeEdit, 'خدمة', this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `service-docs-${new Date().toLocaleString()}.pdf`);
        });
    }

    saveAndPrint() {
        this.save(true)
    }

    printDocumnent() {
        console.log(this.serviceTypeEdit);
        this.printer.printDocument(this.serviceTypeEdit, "خدمة", this.printerHeader);
    }

    private loadCurrentServiceTypeData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);

    newServiceType() {
        this.isNewServiceType = true;
        this.serviceType = this.serviceTypeEdit = new ServiceType();
        if(!this.isVatEnable)
        this.serviceType.vatTypeId=1012
        this.edit();
        return this.serviceTypeEdit;
    }

    editServiceType(serviceType: ServiceTypeInterface) {
        if (serviceType) {
            this.isNewServiceType = false;
            this.serviceType = new ServiceType();
            this.serviceTypeEdit = new ServiceType();
            Object.assign(this.serviceType, serviceType);
            Object.assign(this.serviceTypeEdit, serviceType);
            this.edit();
            return this.serviceTypeEdit;
        } else {
            this.serviceType = new ServiceType();
            this.serviceTypeEdit = new ServiceType();
            return this.newServiceType();
        }
    }

    displayServiceType(serviceType: ServiceTypeInterface) {
        if (serviceType) {
            this.isNewServiceType = false;
            this.serviceType = new ServiceType();
            this.serviceTypeEdit = new ServiceType();
            Object.assign(this.serviceType, serviceType);
            Object.assign(this.serviceTypeEdit, serviceType);
            this.isEditMode = false;
        } else {

            this.serviceType = new ServiceType();
            this.serviceTypeEdit = new ServiceType();
            this.isEditMode = false;
        }
        console.log('service type edited is',this.serviceTypeEdit);

    }

    private edit() {
        if (!this.serviceTypeEdit) this.serviceTypeEdit = new ServiceType();
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save(print = false) {
        let i = 0;
        while(i < 1 && print) {
            this.printer.printDocument(this.serviceTypeEdit, 'خدمة', this.printerHeader);
            i = 1;
        }
        this.isSaving = true;
        console.log(this.serviceTypeEdit);
    //    this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        if (this.isNewServiceType) {
            this.serviceTypeService
                .addServiceType(this.serviceType)
                .subscribe(res => {
                    this.saveSuccessHelper(res);
                });
        } else {
            console.log("updating .........", this.serviceType["id"]);
            this.serviceTypeService
                .updateServiceType(this.serviceTypeEdit, this.serviceType["id"])
                .subscribe(res => {
                    this.saveSuccessHelper(res);
                });
        }
    }

    private saveSuccessHelper(serviceType: ServiceTypeInterface) {
        console.log(serviceType);
        Object.assign(this.serviceTypeEdit, serviceType);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.serviceType, this.serviceTypeEdit);
        this.serviceTypeEdit = new ServiceType();
        this.resetForm();

        // if (this.isNewServiceType)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.serviceType.nameAr +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.serviceType.nameAr +
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
      //  this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.serviceTypeEdit = this.serviceType = new ServiceType();

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
        this.serviceTypeEdit = this.serviceType;
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
        itemCategories: ServiceTypeInterface[]
    ) {
      //  this.alertService.stopLoadingMessage();
        this.allServiceTypeegoryParent = itemCategories;
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
        this.serviceType;
    }
}
