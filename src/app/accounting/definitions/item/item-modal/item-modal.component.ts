import { saveAs } from 'file-saver';
import { ItemService } from './../../services/item.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { AlertService, MessageSeverity } from "../../../../services/alert.service";
import { ItemCatService } from "../../services/itemcat.service";
import { Utilities } from "../../../../services/utilities";
import { Item } from "../../models/item.model";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { Person } from "../../models/person.model";
import { SettingsService } from '../../../../services/settings.service';
import { ItemPDFService } from '../../services/item.pdf.service';
import { PrinterSettingsService } from '../../services/printer-settings.service';
import { PrintItemService } from '../../services/item.print.service';


@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent implements OnInit {
    public itemUnit: any = {name:"", price: 0, cost: 0, barCode: '', notes: ""  };
    public itemUnitSections: any = [{name:"", price: 0, cost: 0, barCode: '', notes: ""  }];
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewItem = false;
    public printerHeader = '';
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public item: Item = new Item();
    public uniqueId: string = Utilities.uniqueId();
    public itemEdit: Item;
    public formResetToggle = true;
    public allItemCategoryParent: Item[] = [];
    public changesFailedCallback: () => void;
    public itemViewModel: Item;

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private itemcatService: ItemCatService,
        private itemService: ItemService,
        private translationService: AppTranslationService,
        private settingService: PrinterSettingsService,
        private pdfService: ItemPDFService,
        private print: PrintItemService
    ) {}


 ngOnInit() {
    //    this.loadCurrentItemCatData();
    this.item = this.itemEdit = new Item();

    this.settingService.getPrinterSettings().subscribe(res => {
        console.log('ress is', res);
        this.printerHeader = res.normalPrinter.header;
    });
    //this.item.itemPeopleId = this.itemEdit.itemPeopleId = new Person().createFakePeople();
  }

    private loadCurrentItemCatData() {
       // this.alertService.startLoadingMessage();
        this.itemService.getItems().subscribe(result => this.onCurrentUserDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error))
    }
    gT = (key: string) => this.translationService.getTranslation(key);
    newItemCat() {
        this.isNewItem = true;
        this.item = this.itemEdit = new Item();
        //this.item.itemPeopleId = this.itemEdit.itemPeopleId = new Person().createFakePeople();
        this.edit();
        return this.itemEdit;
    }

    editItemCat(item: Item) {
        if (item) {
            this.isNewItem = false;
            this.item = new Item();
            this.itemEdit = new Item();
            Object.assign(this.item, item);
            Object.assign(this.itemEdit, item);
            this.edit();
            return this.itemEdit;
        } else {
            return this.newItemCat();
        }
    }

    printDocumnent() {
        this.print.printDocument(this.itemEdit, "صنف", this.printerHeader);
    }

    displayItemCat(item: Item) {
        if (item) {
            this.isNewItem = false;
            this.item = new Item();
            this.itemEdit = new Item();
            Object.assign(this.item, item);
            Object.assign(this.itemEdit, item);
            console.log(this.item);
            console.log(this.itemEdit);
            this.isEditMode = false;
        }
        else{
            this.item = new Item();
            this.itemEdit = new Item();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.itemEdit) this.itemEdit = new Item();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    exportAsPDFDocumnent() {
        console.log(this.itemEdit);
        this.pdfService.createPDF(this.itemEdit, 'صنف', this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `item-docs-${new Date().toLocaleString()}.pdf`);
        });
    }

    private save() {

        // for (let value of this.allItemCategoryParent) {
        //     if (value.id == this.itemEdit.itemCategoryParentId) {
        //         this.itemEdit.itemCategoryParentName = value.nameAr;
        //         break;
        //     }
        // }

        this.isSaving = true;
        this.alertService.startLoadingMessage(this.gT("shared.Saving"));

        if (this.isNewItem) {
            console.log(this.itemEdit);
            // this.itemService
            //     .newItemCat(this.itemEdit)
            //     .subscribe(
            //         itemcat => this.saveSuccessHelper(itemcat),
            //         error => this.saveFailedHelper(error)
            //     );
        } else {
            // this.itemcatService
            //     .updateItemCat(this.itemEdit)
            //     .subscribe(
            //         itemcat => this.saveSuccessHelper(itemcat),
            //         error => this.saveFailedHelper(error)
            //     );
        }
    }



    private saveSuccessHelper(item: Item) {
        Object.assign(this.itemEdit, item);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.item, this.itemEdit);
        this.itemEdit = new Item();
        this.resetForm();


        // if (this.isNewItem)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded")+" "+this.item.itemIndex+ " " +this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved")+" "+this.item.itemIndex+ " " +this.gT("shared.Successfully"),
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
        );
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
*/
        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.itemEdit = this.item = new Item();

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
        this.itemEdit = this.item = new Item();
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

    private onCurrentUserDataLoadSuccessful(itemCategories: Item[]) {
        this.alertService.stopLoadingMessage();
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
        );
*/
        this.item = new Item();
    }

    public handleUnitChange(e) {
        console.log(e.target.value);
        this.itemViewModel.itemUnits.push(e.target.value);
    }

    public handleUnits(e: KeyboardEvent) {
        console.log(this.itemEdit.itemUnits);
        if(e.keyCode == 13) { // The enter button was clicked
            if (this.itemEdit.itemUnits == undefined || this.itemEdit.itemUnits == null) {
                this.itemEdit.itemUnits = [];
                }
                this.itemEdit.itemUnits.push(e.target['value']);
                e.target['value'] = '';
                console.log(this.itemEdit)
        }

    }
    public handleFeatures(e: KeyboardEvent) {
        if(e.keyCode == 13) { // The enter button was clicked
            if (this.itemEdit.itemFeatures == undefined || this.itemEdit.itemFeatures == null) {
                this.itemEdit.itemFeatures = [];
                }
                this.itemEdit.itemFeatures.push(e.target['value']);
                e.target['value'] = '';
                console.log(this.itemEdit)
        }

    }

    public addItemUnit() {
        console.log(this.itemUnit);
    }



}
