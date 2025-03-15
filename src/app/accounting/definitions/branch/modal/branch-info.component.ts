import { PrinterSettingsService } from './../../services/printer-settings.service';
import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AlertService, MessageSeverity } from "../../../../services/alert.service";
import { Utilities } from "../../../../services/utilities";
import { Branch } from "../../models/branch.model";
import { AppTranslationService } from "../../../../services/app-translation.service";
import { Person } from "../../models/person.model";
import { BranchPDFService } from '../../services/branch.pdf.service';
import { PrintBranchService } from '../../services/branch.print.service';
import { ExcelService } from "../../../../services/excel.service";
import * as XLSX from "xlsx";




@Component({
  selector: 'branch-info',
  templateUrl: './branch-info.component.html',
  styleUrls: ['./branch-info.component.css']
})
export class BranchModalComponent implements OnInit {
    public branchUnit: any = {name:"", price: 0, cost: 0, barCode: '', notes: ""  };
    public branchUnitSections: any = [{name:"", price: 0, cost: 0, barCode: '', notes: ""  }];
    public changesSavedCallback: () => void;
    public printerHeader = '';
    public changesCancelledCallback: () => void;
    public isNewBranch = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public branch: Branch = new Branch();
    public uniqueId: string = Utilities.uniqueId();
    public branchEdit: Branch;
    public formResetToggle = true;
    public allBranchegoryParent: Branch[] = [];
    public changesFailedCallback: () => void;
    public branchViewModel: Branch;

  gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitName: {
            title: this.gT("shared.itemUnitName"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        itemName: {
            title: this.gT("shared.itemName"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        initialQuantity: {
            title: this.gT("shared.initialQuantity"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        realQuantity: {
            title: this.gT("shared.realQuantity"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        branchId: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitId: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        quantity: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        expireDate: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
    };

    @ViewChild("f")
    private form;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private settingService: PrinterSettingsService,
        private pdfService : BranchPDFService,
        private printer: PrintBranchService,
        private excelService : ExcelService
    ) {}


 ngOnInit() {
    this.branch = this.branchEdit = new Branch();

    this.settingService.getPrinterSettings().subscribe(res => {
        console.log('ress is', res);
        this.printerHeader = res.normalPrinter.header;
    });
  }

  exportAsPDFDocumnent() {
    this.pdfService.createPDF(this.branchEdit, 'فرع', this.printerHeader).subscribe(res => {
        console.log('ehyyyy')
        let blob = new Blob([res], { type: 'application/pdf' });
        saveAs(blob, `branch-doc-${new Date().toLocaleString()}.pdf`);
    });
}

    private loadCurrentBranchData() {
     //   this.alertService.startLoadingMessage();
        // this.branchService.getBranchs().subscribe(result => this.onCurrentUserDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error))
    }
    newBranch() {
        this.isNewBranch = true;
        this.branch = this.branchEdit = new Branch();
        this.edit();
        return this.branchEdit;
    }

    printDocumnent() {
        this.printer.printDocument(this.branchEdit, "فرع", this.printerHeader);
    }

    editBranch(branch: Branch) {
        if (branch) {
            this.isNewBranch = false;
            this.branch = new Branch();
            this.branchEdit = new Branch();
            Object.assign(this.branch, branch);
            Object.assign(this.branchEdit, branch);
            this.edit();
            return this.branchEdit;
        } else {
            return this.newBranch();
        }
    }

    displayBranch(branch: Branch) {
        if (branch) {
            this.isNewBranch = false;
            this.branch = new Branch();
            this.branchEdit = new Branch();
            Object.assign(this.branch, branch);
            Object.assign(this.branchEdit, branch);
            console.log(this.branch);
            console.log(this.branchEdit);
            this.isEditMode = false;
        }
        else{
            this.branch = new Branch();
            this.branchEdit = new Branch();
            this.isEditMode = false;
        }
    }

    private edit() {
        if (!this.branchEdit) this.branchEdit = new Branch();

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {

        // for (let value of this.allBranchegoryParent) {
        //     if (value.id == this.branchEdit.branchegoryParentId) {
        //         this.branchEdit.branchegoryParentName = value.nameAr;
        //         break;
        //     }
        // }

        this.isSaving = true;
        this.alertService.startLoadingMessage(this.gT("shared.Saving"));

        if (this.isNewBranch) {
            console.log(this.branchEdit);
            // this.branchService
            //     .newBranch(this.branchEdit)
            //     .subscribe(
            //         branchcat => this.saveSuccessHelper(branchcat),
            //         error => this.saveFailedHelper(error)
            //     );
        } else {
            // this.branchcatService
            //     .updateBranch(this.branchEdit)
            //     .subscribe(
            //         branchcat => this.saveSuccessHelper(branchcat),
            //         error => this.saveFailedHelper(error)
            //     );
        }
    }



    private saveSuccessHelper(branch: Branch) {
        Object.assign(this.branchEdit, branch);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.branch, this.branchEdit);
        this.branchEdit = new Branch();
        this.resetForm();


        // if (this.isNewBranch)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded")+" "+this.branch.branchIndex+ " " +this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved")+" "+this.branch.branchIndex+ " " +this.gT("shared.Successfully"),
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
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.branchEdit = this.branch = new Branch();

        this.showValidationErrors = false;
        this.resetForm();

        /*this.alertService.showMessage(
                  this.gT("messages.closing"),
                        this.gT("messages.processIgnored"),
            MessageSeverity.default
        );*/
        this.alertService.resetStickyMessage();
        this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.branchEdit = this.branch = new Branch();
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

    private onCurrentUserDataLoadSuccessful(branchegories: Branch[]) {
        //this.alertService.stopLoadingMessage();
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
        this.branch = new Branch();
    }

    getRemovedHeadersArray() {
        let list: string[] = [];
        for (var key in this.headers) {
            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }
        return list;
    }

    getOrderedHeadersArray() {
        let list: string[] = [];
        let counter: number = 1;
        while (true) {
            let isFounded: boolean = false;
            for (var key in this.headers) {
                if (this.headers[key].order == counter) {
                    list.push(key);
                    isFounded = true;
                    break;
                }
            }
            if (!isFounded) {
                break;
            }
            counter++;
        }
        return list;
    }

    exportAsXLSX(): void {
        let exportedRows: any[] = [];
        Object.assign(exportedRows, this.branch['itemUnitBranches']);
        let removedKeyArr: string[] = this.getRemovedHeadersArray();
        for (var removedKey of removedKeyArr) {
            for (var row of exportedRows) {
                delete row[removedKey];
            }
        }
        let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            exportedRows,
            { header: orderedKeyArr }
        );
        for (var key in this.headers) {
            if (
                this.headers[key].isVis &&
                this.headers[key].excel_cell_header != ""
            ) {
                worksheet[this.headers[key].excel_cell_header].v = this.headers[
                    key
                ].title;
            }
        }

        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet,  this.branch.name);
    }



    }
