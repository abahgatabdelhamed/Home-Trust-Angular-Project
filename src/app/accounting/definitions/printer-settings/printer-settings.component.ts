import { AlertService } from "./../../../services/alert.service";
import {
    PrinterSettings,
    ThermalPrinterSettings
} from "./../models/printer-settings";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
    PrinterSettingsInterface,
    ThermalPrinterSettingsInterface
} from "../models/printer-settings";
import { Utilities } from "../../../services/utilities";
import { PrinterSettingsService } from "../services/printer-settings.service";

@Component({
    selector: "printer-settings",
    templateUrl: "./printer-settings.component.html",
    styleUrls: ["./printer-settings.component.css"]
})
export class PrinterSettingsComponent {
    public isEditMode = false;
    public isEditThermalMode = false;
    public isSaving = false;
    public uniqueId: string = Utilities.uniqueId();
    public showValidationErrors = false;
    public formResetToggle = true;
    public printerSettings: PrinterSettings = new PrinterSettings();
    public printerSettingsEdit: PrinterSettings = new PrinterSettings();
    public thermalPrinterSettings: ThermalPrinterSettings = new ThermalPrinterSettings();
    public thermalPrinterSettingsEdit: ThermalPrinterSettings = new ThermalPrinterSettings();

    constructor(
        private printerSettingsService: PrinterSettingsService,
        private alerService: AlertService
    ) {}
    ngOnInit() {
        const isDefault = localStorage.getItem('printerType');
        this.printerSettingsService.getPrinterSettings().subscribe(res => {
            console.log("res is", res);
            this.printerSettings = this.printerSettingsEdit = res['normalPrinter'];
            this.printerSettings.defaultPrinter = this.printerSettingsEdit.defaultPrinter = isDefault == 'normal';
            this.printerSettings.defaultPrinterDisplay = this.printerSettingsEdit.defaultPrinterDisplay = isDefault == 'normal' ? 'نعم': 'لا';
            if(this.printerSettingsEdit.tobaccoTrade==null?this.printerSettingsEdit.tobaccoTrade=false:'')
            console.log('settings are', this.printerSettingsEdit);
            this.thermalPrinterSettings = this.thermalPrinterSettingsEdit = res['thermalPrinter'];
            this.thermalPrinterSettings.defaultThermalPrinter = this.thermalPrinterSettingsEdit.defaultThermalPrinter = isDefault == 'thermal';
            this.thermalPrinterSettings.defaultThermalPrinterDisplay = this.thermalPrinterSettingsEdit.defaultThermalPrinterDisplay = isDefault == 'thermal'? 'نعم': 'لا';
            if(this.thermalPrinterSettingsEdit.tobaccoTrade==null?this.thermalPrinterSettingsEdit.tobaccoTrade=false:'')
            console.log('thermal settings are', this.thermalPrinterSettings);
        })
    }
    save(e: MouseEvent) {
        if (e.target["name"] === "thermal-save") {
            const objectToSend = {
                NormalPrinter: this.printerSettingsEdit,
                ThermalPrinter: this.thermalPrinterSettingsEdit
            };
            console.log("sending ..", objectToSend);
            this.printerSettingsService.updateThermalPrinterSettings(objectToSend)
                .subscribe(res => this.indecateSuccess(res));
        } else {
            const objectToSend = {
                NormalPrinter: this.printerSettingsEdit,
                ThermalPrinter: this.thermalPrinterSettingsEdit
            };
            console.log("sending ..", objectToSend);
            console.log(this.printerSettingsEdit);
            this.printerSettingsService.updatePrinterSettings(objectToSend)
                .subscribe(res => this.indecateSuccess(res));
        }
    }

    edit(e: MouseEvent) {
        console.log(e.target["name"]);
        if (e.target["name"] == "edit-thermal") {
            this.isEditThermalMode = true;
        } else {
            this.isEditMode = true;
        }
    }

    cancel(e: MouseEvent) {
        if (e.target["name"] == "cancel-thermal")
            this.isEditThermalMode = false;
        else this.isEditMode = false;
    }

    indecateSuccess(res) {
        console.log('is it thermal', this.thermalPrinterSettingsEdit.defaultThermalPrinter);
        console.log('is it normal', this.printerSettingsEdit.defaultPrinter);
        this.printerSettingsEdit.defaultPrinter = !this.thermalPrinterSettings.defaultThermalPrinter;
        if (this.printerSettingsEdit.defaultPrinter) {
            this.thermalPrinterSettingsEdit.defaultThermalPrinter = false;
            this.thermalPrinterSettingsEdit.defaultThermalPrinterDisplay = 'لا';
            localStorage.setItem('printerType', 'normal');
            this.printerSettingsEdit.defaultPrinter = true;
            this.printerSettingsEdit.defaultPrinterDisplay = 'نعم';
        } else if (this.thermalPrinterSettingsEdit.defaultThermalPrinter) {
            this.printerSettingsEdit.defaultPrinter = false;
            this.printerSettingsEdit.defaultPrinterDisplay = 'لا';
            this.thermalPrinterSettingsEdit.defaultThermalPrinter = true;
            this.thermalPrinterSettingsEdit.defaultThermalPrinterDisplay = 'نعم';
            localStorage.setItem('printerType', 'thermal');
        }
        this.isEditMode = this.isEditThermalMode = false;
        //this.alerService.showStickyMessage("تمت العملية بنجاح");
    }


    handleNormalDefaultChange(e) {
        console.log('is', e);
        this.printerSettingsEdit.defaultPrinter = true;
        this.printerSettingsEdit.defaultPrinterDisplay = 'نعم';
        this.thermalPrinterSettingsEdit.defaultThermalPrinter = false;
        this.thermalPrinterSettingsEdit.defaultThermalPrinterDisplay = 'لا';
        localStorage.setItem('printerType', 'normal');
    }

    handleThermalDefaultChange(e) {
        this.printerSettingsEdit.defaultPrinter = false;
        this.printerSettingsEdit.defaultPrinterDisplay = 'لا';
        this.thermalPrinterSettingsEdit.defaultThermalPrinter = true;
        this.thermalPrinterSettingsEdit.defaultThermalPrinterDisplay = 'نعم';
        localStorage.setItem('printerType', 'thermal');
    }
    handleThermaltobaccoTradeChange(e){
     
        
        this.thermalPrinterSettingsEdit.tobaccoTrade = e;
       // localStorage.setItem('printerType', 'thermal');
    }
    handleNormaltobaccoTradeChange(e) {
       
        this.printerSettingsEdit.tobaccoTrade = e;
        
    }
}
