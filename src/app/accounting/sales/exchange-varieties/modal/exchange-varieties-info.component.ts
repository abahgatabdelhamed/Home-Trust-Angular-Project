import { SettingsService } from './../../../../services/settings.service';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Utilities } from "../../../../services/utilities";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { ExchangeVarService } from "../../../sales/services/exchange-varieties.service";
import { AppTranslationService } from "../../../../services/app-translation.service";
import {
    ExchangeVar,
    ExchangeVarInterface
} from "../../../../models/exchange-varieties";
import { D } from "@angular/core/src/render3";
import { PrintExchangeService } from "../../../shared/services/exchange-varieties.print.service";
import { PDFService } from "../../../shared/services/pdf.service";
import { PrinterSettingsService } from '../../../definitions/services/printer-settings.service';
import { AssetService } from '../../../accounting/services/asset.service';

@Component({
    selector: "exchange-varieties-info",
    templateUrl: "./exchange-varieties-info.component.html",
    styleUrls: ["./exchange-varieties-info.component.css"]
})
export class ExchangeVarietiesInfoComponent {
    showPersonDebt = false;
    @Input() isCC:boolean=false
    dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    printable = { itemName: '', itemUnitName: '',fromCostCenter:null,branch:'', fromName: '', toName: '', quantity: 0, notes: '', date: new Date().toLocaleDateString("ar-EG", this.dateOptions)};
    isSales: boolean =  false;
    fromValueChanged = false;
    toValueChanged = false;
    personDebt: any;
    objectToEdit:ExchangeVar
    printerHeader = '';
    hasClickedEdit = false;
    editingDoc = { editing: false, target: 0 };
    public automatedCode;
    public branches = [];
    CostCenters:any=[]
    CostItem:any
    public items = [];
    public itemUnits = [];
    public whatToLoad = { name: null, type: "", printerLabel: '' };
    public initial: any;
    public isAdvanced: boolean = false;
    public changesSavedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isNewDailyDocument = false;
    public isEditMode = false;
    public isSaving = false;
    public showValidationErrors = false;
    public exchangeVar: ExchangeVar = new ExchangeVar();
    public exchangeVarAdvanced: ExchangeVar[] = [];
    public uniqueId: string = Utilities.uniqueId();
    public exchangeVarEdit: ExchangeVarInterface;
    public formResetToggle = true;
    public changesFailedCallback: () => void;

    @ViewChild("f")
    private form;

    constructor(
        private pdfService: PDFService,
        private alertService: AlertService,
        private exchangeVarService: ExchangeVarService,
        private translationService: AppTranslationService,
        private router: Router,
        private printer: PrintExchangeService,
        private settingService: PrinterSettingsService,
        private ccService:AssetService
    ) {}

    ngOnInit() {
       
        
        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.normalPrinter.header;
        });
        
            this.exchangeVarService.getInitial().subscribe(res => {
            this.branches = res["branches"];
            this.items = res["items"];
          
            //this.automatedCode = res["code"];
            console.log("init is ", res);
        });
        
        
        if (this.exchangeVarEdit == undefined)
            this.exchangeVarEdit = null;
        console.log("aaaaa" + this.exchangeVarEdit);
        console.log(this.itemUnits);
    }
     getcostCenterData(){

     }
    handleAdd(e) {
        if (!this.exchangeVarEdit.fromBranchId || !this.exchangeVarEdit.toBranchId)
            return;
        this.exchangeVarEdit.fromBranch = this.branches.find(
            e => e.id == this.exchangeVarEdit["fromBranchId"]
        );

        this.exchangeVarEdit.toBranch = this.branches.find(
            e => e.id == this.exchangeVarEdit["toBranchId"]
        );
        this.exchangeVarAdvanced.push(this.exchangeVarEdit);
        this.exchangeVarEdit = new ExchangeVar();
        console.log("ssss" + this.exchangeVarEdit);
        this.exchangeVarEdit.fromBranchId = this.exchangeVarEdit.toBranchId = null;
    }

    private loadCurrentDailyDocumentData() {
        //data is passed by the parent, why would you load it from the server?
    }
    gT = (key: string) => this.translationService.getTranslation(key);
    newDailyDocument() {
        this.isNewDailyDocument = true;
        this.exchangeVar = this.exchangeVarEdit = new ExchangeVar();
        this.exchangeVarEdit.date = new Date();
        this.edit();
        return this.exchangeVarEdit;
    }
    handleFromCostCenterChange(id){
       
        console.log('cost ==',this.CostCenters)
         this.CostCenters.forEach(element =>{
             if(element.id==this.exchangeVarEdit.costCenterId){
              
                
             this.CostItem=element
          
             this.itemUnits=element.itemUnitBranches
            //  console.log('element==>',this.CostItem, this.CostItem.item.nameAr,
            //  'e=',element.item.nameAr)
             }
         })
         console.log(this.itemUnits)

    }
    exportAsPDFDocumnent() {
        //this.printable.code = this.exchangeVarEdit.code;
        this.printable.notes = this.exchangeVarEdit.notes;
        this.printable.date = this.exchangeVarEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
        this.printable.fromName = this.exchangeVarEdit.fromBranch.name;
        this.printable.toName = this.exchangeVarEdit.toBranch.name;
        this.pdfService.createPDF(this.printable,this.isSales, this.whatToLoad.printerLabel, this.printerHeader).subscribe(res => {
            console.log('ehyyyy')
            let blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, `reciept-docs-${new Date().toLocaleString()}.pdf`);
        });
    }

    editDailyDocument(exchangeVar: ExchangeVarInterface) {
        if (exchangeVar) {
            if(this.isCC){
                console.log('id===',exchangeVar.branchId,exchangeVar.fromBranchId)
            
                this.ccService.GetCostCenter(exchangeVar.branchId).subscribe({
                next:(costcenters)=>{
                    console.log('cc',costcenters)
                    this.CostCenters=costcenters
                    console.log(this.CostCenters)
                    this.handleFromCostCenterChange(exchangeVar.costCenterId)
                }
            })
        }
            
            console.log("edit =",exchangeVar,this.itemUnits)
            this.isNewDailyDocument = false;
            this.exchangeVar = new ExchangeVar();
            this.exchangeVarEdit = new ExchangeVar();
            Object.assign(this.exchangeVar, exchangeVar);
            Object.assign(this.exchangeVarEdit, exchangeVar);
            console.log("ffff" + this.exchangeVarEdit);
            this.itemUnits = this.exchangeVarEdit.itemUnits;
            this.edit();
            return this.exchangeVarEdit;
        } else {
            this.exchangeVar = new ExchangeVar();
            this.exchangeVarEdit = new ExchangeVar();
            return this.newDailyDocument();
        }
    }

    displayDailyDocument(exchangeVar: ExchangeVarInterface) {
        if (exchangeVar) {
            this.objectToEdit=exchangeVar
            console.log("editing mode ..");
            this.isNewDailyDocument = false;
            this.exchangeVar = new ExchangeVar();
            this.exchangeVarEdit = new ExchangeVar();
            console.log(exchangeVar);
            Object.assign(this.exchangeVar, exchangeVar);
            Object.assign(this.exchangeVarEdit, exchangeVar);
            this.isEditMode = false;
           if(!this.isCC){
               this.branches.forEach(e => {
                e["fromIsSelected"] = this.exchangeVarEdit.fromBranch.id == e.id;
                e["toIsSelected"] = this.exchangeVarEdit.toBranch.id == e.id;
            });
            this.exchangeVar.fromBranchId = this.exchangeVarEdit.fromBranchId = this.exchangeVarEdit.fromBranch.id;
            this.exchangeVarEdit.toBranchId = this.exchangeVarEdit.toBranchId = this.exchangeVarEdit.toBranch.id;
           
           }
             console.log("eeee" + this.exchangeVarEdit);
            this.itemUnits = this.exchangeVarEdit.itemUnits;
        } else {
            this.exchangeVar = new ExchangeVar();
            this.exchangeVarEdit = new ExchangeVar();
            this.isEditMode = false;
        }
        console.log(this.exchangeVar);
    }

    private edit() {
        if (!this.exchangeVarEdit) this.exchangeVarEdit = new ExchangeVar();
        this.isEditMode = true;
        this.showValidationErrors = true;
        this.ccService.GetCostCenter(this.exchangeVarEdit.branchId).subscribe({
            next:(costcenters)=>{
                console.log('cc',costcenters)
                this.CostCenters=costcenters
                console.log(this.CostCenters)
                this.handleFromCostCenterChange(this.exchangeVar.costCenterId)
            }
        })
    }

    deleteDocAdvanced(doc) {
        const index = this.exchangeVarAdvanced.indexOf(doc);
        this.exchangeVarAdvanced.splice(index, 1);
    }

    saveWithoutPrint() {
        this.isSaving = true;
        //this.exchangeVar.code = this.exchangeVarEdit.code = this.automatedCode;
        console.log(this.exchangeVarEdit);
       this.isCC? this.exchangeVarEdit.itemId=this.CostItem.item.id:''
            if (this.isNewDailyDocument) {
                console.log("added is ", this.exchangeVarEdit);
                this.isCC?
                this.exchangeVarService
                .newExchangeVarforCC(this.exchangeVarEdit)
                .subscribe(
                    res => this.saveSuccessHelper(res, false),
                    err => this.saveFailedHelper(err)
                )
                :this.exchangeVarService
                    .newExchangeVar(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    );
            } else {
                this.isCC?
                (this.exchangeVarService
                    .updateExchangeVarCC(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    ),console.log(this.exchangeVarEdit))
                :
                this.exchangeVarService
                    .updateExchangeVar(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    );
            }
            console.log(this.exchangeVar);
        
    }

    private save() {
        this.isSaving = true;
        //this.exchangeVar.code = this.exchangeVarEdit.code = this.automatedCode;
        console.log(this.exchangeVarEdit);

            if (this.isNewDailyDocument) {
               
                console.log("added is ", this.exchangeVarEdit);
                this.isCC?
                this.exchangeVarService
                .newExchangeVarforCC(this.exchangeVarEdit)
                .subscribe(
                    res => this.saveSuccessHelper(res, false),
                    err => this.saveFailedHelper(err)
                )
                :
                this.exchangeVarService
                    .newExchangeVar(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, true),
                        err => this.saveFailedHelper(err)
                    );
            } else {
                this.isCC?
                (this.exchangeVarService
                    .updateExchangeVarCC(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, false),
                        err => this.saveFailedHelper(err)
                    ),console.log(this.exchangeVarEdit))
                :
                this.exchangeVarService
                    .updateExchangeVar(this.exchangeVarEdit)
                    .subscribe(
                        res => this.saveSuccessHelper(res, true),
                        err => this.saveFailedHelper(err)
                    );
            }
            console.log(this.exchangeVar);
        
    }

    printDocumnent() {
        if(this.isCC)
        {
            console.log('cc************',this.exchangeVarEdit,this.exchangeVar)
            if(this.isNewDailyDocument&&this.exchangeVarEdit){
               
                this.printable.notes = this.exchangeVarEdit.notes;
                this.printable.itemName = this.CostItem.item.nameAr
                this.printable.itemUnitName=this.CostItem.itemUnitBranches.find(    
                            e => e.itemUnitId == this.exchangeVarEdit["itemUnitId"]
                ).itemUnitName;
                this.printable.date=this.exchangeVarEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
                this.printable.fromCostCenter=this.CostItem.nameAr
                this.printable.branch=this.CostItem.branch.name
            }else{
            this.printable.notes = this.exchangeVarEdit.notes;
            this.printable.itemName = this.exchangeVarEdit.item
            this.printable.itemUnitName=this.exchangeVarEdit.itemUnit
            this.printable.date=this.exchangeVarEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
            this.printable.fromCostCenter=this.exchangeVarEdit.fromCostCenter
            this.printable.branch=this.exchangeVarEdit.branch
            }
            
            
        }else{
        if (this.exchangeVarEdit) {
        //this.printable.code = this.exchangeVarEdit.code;
            this.printable.notes = this.exchangeVarEdit.notes;
            this.printable.itemName = this.items.find(
                e => e.id == this.exchangeVarEdit["itemId"]
            ).nameAr;
            this.printable.itemUnitName = this.itemUnits.find(
                e => e.id == this.exchangeVarEdit["itemUnitId"]
            ).name;
        this.printable.date = this.exchangeVarEdit.date.toLocaleDateString("ar-EG", this.dateOptions);
        }
        if (!this.fromValueChanged) {
            this.printable.fromName = this.exchangeVarEdit.fromBranch? this.exchangeVarEdit.fromBranch.name: '' ;
        }
        if (!this.toValueChanged) {
            this.printable.toName = this.exchangeVarEdit.toBranch? this.exchangeVarEdit.toBranch.name: '';
        }
    }
    console.log('print')
        this.printer.printDocument(this.printable, this.isSales, this.whatToLoad.printerLabel, this.printerHeader);
    }


    isPrintable() {
        if (this.isAdvanced && this.isEditMode) return false;
        else return true;
    }


    private  mapDocToPrint(exchangeVar: ExchangeVar) {
        const fromBranch = this.branches.find(e => e.id == exchangeVar.fromBranchId);
        const toBranch = this.branches.find(e => e.id == exchangeVar.toBranchId);
        const result = {fromBranch, toBranch, date: exchangeVar.date};
        return result;
    }

    handleFromBranchChange(id) {
        console.log('changed to', id,this.exchangeVarEdit.fromBranchId,this.exchangeVarEdit.branchId);

        const branch = this.branches.find(e => e.id == id);
        this.fromValueChanged = true;
        if (branch) {
            this.printable.fromName = branch['name'];
        }
        console.log('prinatable', this.printable);
        if(this.isCC)
        this.ccService.GetCostCenter(id).subscribe({
            next:(costcenters)=>{
                console.log('cc',costcenters)
                this.CostCenters=costcenters
                this.exchangeVarEdit.costCenterId=null
                this.CostItem=null
                this.exchangeVarEdit.itemUnits=null
                console.log(this.CostCenters)
            }
        })

    }

    handleToBranchChange(id) {
        console.log('changed to', id);
        const branch = this.branches.find(e => e.id == id);
        this.toValueChanged = true;
        console.log('branch is', branch);
        if (branch) {
            console.log('person');
            this.printable.toName = branch['name'];
        }
        console.log('prinatable', this.printable);
    }

    handleBranchChange(e: MouseEvent) {
        if (this.isSales) return;
        console.log(this.exchangeVarEdit.toBranchId);
        const id = this.exchangeVarEdit.toBranchId;
        const branch = this.branches.find(e => e.id == id);
        if(branch) {
            console.log('branch now is', branch)
            //this.personDebt = this.exchangeVarService.getPersonBalance(branch['personId'])
            //.subscribe(res => {
            //    console.log('person has', res);
            //    this.personDebt = res;
            //    this.showPersonDebt = typeof(this.personDebt) == "number";

            //});
        }
    }

    handleItemChange(e: any) {
        this.exchangeVarEdit.itemUnitId=null
        this.exchangeVarService.getItemUnits(e.target["value"]).subscribe(res => {
            console.log("dddd"+res);
            this.itemUnits = res;
        });
    }

    handleFromAccChange(e: MouseEvent) {
        console.log('sales moode');
        if (!this.isSales) return;
        console.log(this.exchangeVarEdit.toBranchId);
        const id = e.target['value'];
        const branch = this.branches.find(e => e.id == id);
    }

    handleAmountChange(e) {
        if (this.personDebt) {
            this.personDebt -= +e.target['value'];
            this.printable.quantity = e.target.value;
            this.printable.quantity = +e.target['value'];
        }
    }

    handleDateChanging(e) {
        console.log('date changed to', e);
        if (e) {
        this.printable.date = e.toLocaleDateString("ar-EG", this.dateOptions);
        }
        console.log(this.printable)
    }

    private saveSuccessHelper(exchangeVar: ExchangeVarInterface, printable) {
        if(printable) {
        setTimeout(() => {
            //this.printable.code = exchangeVar.code;
            this.printable.notes = exchangeVar.notes;
            console.log('result is', this.printable);
            this.printer.printDocument( this.printable, this.isSales, this.whatToLoad.printerLabel, this.printerHeader);
        }, 0);
    }
        Object.assign(this.exchangeVarEdit, exchangeVar);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        console.log(exchangeVar)

        Object.assign(this.exchangeVar, this.exchangeVarEdit);

        this.exchangeVarEdit = new ExchangeVar();
        this.resetForm();

        // if (this.isNewDailyDocument)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //             " " +
        //             this.exchangeVar.id +
        //             " " +
        //             this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //             " " +
        //             this.exchangeVar.id +
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
        this.exchangeVarEdit = this.exchangeVar = new ExchangeVar();
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


    saveEdited(e ) {
        this.editingDoc = { editing: false, target: null };
        this.hasClickedEdit = false;
        this.exchangeVarEdit = new ExchangeVar();
        this.exchangeVarEdit.fromBranchId = this.exchangeVarEdit.toBranchId = null;
    }


    editDoc(adv) {
        this.exchangeVarEdit = adv;
        this.editingDoc = { editing: true, target: adv["id"] };
        this.hasClickedEdit = true;
        console.log(this.editingDoc);
    }
    private close() {
        this.exchangeVarEdit = this.exchangeVar = new ExchangeVar();
        this.personDebt = '';
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
        itemCategories: ExchangeVarInterface[]
    ) {
        this.alertService.stopLoadingMessage();
        console.error(itemCategories);
    }

    private onCurrentUserDataLoadFailed(error: any) {
     /*   this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.exchangeVar;
    }
}
