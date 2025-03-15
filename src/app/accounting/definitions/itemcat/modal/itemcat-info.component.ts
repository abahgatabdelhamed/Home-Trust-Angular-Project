import { saveAs } from 'file-saver';
import { PrinterSettingsService } from './../../services/printer-settings.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { ItemCatService } from "../../services/itemcat.service";
import { Utilities } from "../../../../services/utilities";
import { ItemCat } from "../../models/itemcat.model";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { ItemCatPDFService } from "../../services/item-cat.pdf.service";
import { PrintItemCatDocsService } from '../../services/item-cat.print.service';
import { ItemService } from '../../services/item.service';

@Component({
    selector: "itemcat-info",
    templateUrl: "./itemcat-info.component.html",
    styleUrls: ["./itemcat-info.component.css"]
})
export class ItemCatInfoComponent {
    public automatedCode;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewItemCat = false;
    public isEditMode = false;
    public printerHeader = '';
    public isSaving = false;
    public showValidationErrors = false;
    public itemcat: ItemCat = new ItemCat();
    public uniqueId: string = Utilities.uniqueId();
    public itemcatEdit: ItemCat;
    public formResetToggle = true;
    public allItemCategoryParent: ItemCat[] = [];
    public changesFailedCallback: () => void;
    logoPath;
    imgURL;
    uploadDone: boolean;

    @ViewChild("f")
    private form;
    fileToUpload: FormData;
    file: FormData;

    constructor(
        private alertService: AlertService,
        private itemcatService: ItemCatService,
        private translationService: AppTranslationService,
        private pdfService: ItemCatPDFService,
        private settingService: PrinterSettingsService,
        private printer: PrintItemCatDocsService,
        private itemService: ItemService
    ) { }

    ngAfterViewInit() {


        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
    }

    printDocumnent() {
        this.printer.printDocument(this.itemcatEdit, "تصنيف أساسي", this.printerHeader);
    }
    handleFileChange(event) {
       /* this.fileToUpload = event.target.files[0]
       */let reader = new FileReader();
        if (event.target['files'] && event.target['files'].length > 0) {
            const file = new FormData();
            file.append('files', event.target['files'][0]);
            file.append('fileName', event.target['files'][0].name);
            this.preview(event.target['files']);
            this.fileToUpload = file;
            // console.log(file,e)
        }
    }
    preview(files) {
        if (files && files[0]) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = e => this.imgURL = reader.result;

            reader.readAsDataURL(file);
        }
    }

    changeLogo() {
        if (this.fileToUpload) {
            this.itemcatService.uploadImg(this.file).subscribe(res => {
                this.uploadDone = true;
                //  this.deleteLogoDone = false;
            });
        }
    }

    deleteLogo() {

    }


    exportAsPDFDocumnent() {
        this.pdfService.createPDF(this.itemcatEdit, 'مجموعة أصناف', this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `item-category-doc-${new Date().toLocaleString()}.pdf`);
        });
    }

    // private loadCurrentItemCatData() {
    //     this.alertService.startLoadingMessage();
    //     this.itemcatService.getItemCats().subscribe(results => this.onCurrentUserDataLoadSuccessful(results), error => this.onCurrentUserDataLoadFailed(error));
    // }
    gT = (key: string) => this.translationService.getTranslation(key);
    newItemCat(itemcat) {
        this.allItemCategoryParent=itemcat
        this.isNewItemCat = true;
        this.itemcat = this.itemcatEdit = new ItemCat();
        this.edit();
        return this.itemcatEdit;
    }

    editItemCat(itemcat: ItemCat) {
        if (itemcat) {
            this.isNewItemCat = false;
            this.itemcat = new ItemCat();
            this.itemcatEdit = new ItemCat();
            Object.assign(this.itemcat, itemcat);
            Object.assign(this.itemcatEdit, itemcat);
            this.imgURL=itemcat.imageUrl
            this.edit();

            return this.itemcatEdit;
        } else {
            return this.newItemCat(this.allItemCategoryParent);
        }
    }

    displayItemCat(itemcat: ItemCat) {
        if (itemcat) {
            this.logoPath=itemcat.imageUrl
            this.imgURL=itemcat.imageUrl
            this.isNewItemCat = false;
            this.itemcat = new ItemCat();
            this.itemcatEdit = new ItemCat();
            Object.assign(this.itemcat, itemcat);
            Object.assign(this.itemcatEdit, itemcat);
            this.itemcat.itemCategoryParentId = itemcat.itemCategoryParentId;
            this.itemcatEdit.itemCategoryParentId =
                itemcat.itemCategoryParentId;
            this.isEditMode = false;
        } else {
            this.itemcat = new ItemCat();
            this.itemcatEdit = new ItemCat();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.itemcatEdit) this.itemcatEdit = new ItemCat();
        this.isEditMode = true;
        this.imgURL=this.itemcatEdit.imageUrl
        this.showValidationErrors = true;
    }

    saveAndPrint() {
        this.save(true);
    }

    private save(print = false) {
        for (let value of this.allItemCategoryParent) {
            if (value.id == this.itemcatEdit.itemCategoryParentId) {
                this.itemcatEdit.itemCategoryParentName = value.nameAr;
                break;
            }
        }
        //this will come through initial object
        // this.itemcatEdit.code = ""
        this.isSaving = true;
        // this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        if (this.itemcat.code == null || this.itemcat.code == undefined)
            this.itemcat.code = this.itemcatEdit.code = this.automatedCode;
        else
            this.itemcat.code = this.itemcatEdit.code;
        if (this.isNewItemCat) {
            console.log(this.fileToUpload, 'body')
            if(this.fileToUpload){
            this.itemService.uploadFile(this.fileToUpload).subscribe(res=>{
                console.log(res)
                this.itemcatEdit.imageUrl = "uploads/" + res;
                this.itemcatService
                .newItemCat(this.itemcatEdit)
                .subscribe(
                    itemcat => this.saveSuccessHelper(itemcat, print),
                    error => this.saveFailedHelper(error)
                );
            }
                )}else{
                    this.itemcatService
                    .newItemCat(this.itemcatEdit)
                    .subscribe(
                        itemcat => this.saveSuccessHelper(itemcat, print),
                        error => this.saveFailedHelper(error)
                    );
                }
            console.log(this.itemcatEdit);
           
        } else {
            if(this.fileToUpload)
              this.itemService.uploadFile(this.fileToUpload).subscribe(res=>{
                this.itemcatEdit.imageUrl = "uploads/" + res;
                console.log(res)
                this.itemcatService
                .updateItemCat(this.itemcatEdit)
                .subscribe(
                    itemcat => this.saveSuccessHelper(itemcat, print),
                    error => this.saveFailedHelper(error)
                );
              }
                 )
                 else
                 this.itemcatService
                .updateItemCat(this.itemcatEdit)
                .subscribe(
                    itemcat => this.saveSuccessHelper(itemcat, print),
                    error => this.saveFailedHelper(error)
                );
           /* console.log(this.fileToUpload, 'body')
            this.itemcatService.uploadImg(this.fileToUpload).subscribe({
                next: (res) => {
                    console.log(res)
                },
                error: (err) => {
                    console.log(err)
                }
            })*/
           
        }
    }

    private saveSuccessHelper(itemcat: ItemCat, print) {
        let i = 0;
        while (i < 1 && print) {
            this.printer.printDocument(this.itemcatEdit, 'تصنيف أساسي', this.printerHeader);
            i = 1;
        }
        Object.assign(this.itemcatEdit, itemcat);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.itemcat, this.itemcatEdit);
        this.itemcatEdit = new ItemCat();
        this.resetForm();

        // if (this.isNewItemCat)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.itemcat.nameAr +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.itemcat.nameAr +
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
         );*/
        //  this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.itemcatEdit = this.itemcat = new ItemCat();

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
        this.itemcatEdit = this.itemcat = new ItemCat();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;
        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    handleParentChange(e: MouseEvent) {
        const parent = this.allItemCategoryParent.find(i => i.id == e.target['value']);
        if (parent) {
            this.itemcatEdit.itemCategoryParentName = parent.nameAr;
        }
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

    private onCurrentUserDataLoadSuccessful(itemCategories: ItemCat[]) {
        this.alertService.stopLoadingMessage();
        this.allItemCategoryParent = itemCategories;
        console.error(itemCategories);
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
        this.itemcat = new ItemCat();
    }
}
