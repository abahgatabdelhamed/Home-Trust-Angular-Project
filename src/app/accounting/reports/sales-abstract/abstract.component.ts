import { Component, OnInit } from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import * as XLSX from "xlsx";
import { element } from "protractor";
import { SBillService } from "../../sales/services/sbill.service";
import { BillSummary } from "../../sales/models/sbill-summary";
import { SaleBillSummary, SaleBillNet } from "../../sales/models/sale-bill-summary";
import { ActivatedRoute } from "@angular/router";
import { FilterData } from "../../shared/models/branch-cc-filter.model";
import { CheckPermissionsService } from "../../../services/check-permissions.service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { PrintAbstractService } from "../services/print-abstruct.print.service";

@Component({
    selector: "app-abstract",
    templateUrl: "./abstract.component.html",
    styleUrls: ["./abstract.component.css"]
})
export class SaleAbstractComponent implements OnInit {
    // serachModel: any = {
    //     from: new Date(),
    //     to: new Date()
    // };
    filterData: FilterData = {
        selectedBillType: '',
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel:{from:null,to:null}
    };
    view=false
    CCPermissions:boolean=false
    now: Date = new Date();
    fromTime: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(),0,0,0);
    toTime: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 23, 59, 59);
    editingName: { nameAr: string };
    columns: any[] = [];
    excelLabel: string = 'Summary Report';

    billSummary: SaleBillSummary = new SaleBillSummary();
    exportedItems;
    NetResult: SaleBillNet = new SaleBillNet();
    loadingIndicator: boolean;
    branchId=0;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        label: {
            title: '',
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        eCash: {
            title:'',
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        eBank: {
            title: '',
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        eDept: {
            title: '',
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        eNetwork: {
            title: '',
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        evat: {
            title:'',
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        ewithoutVat: {
            title: '',
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        ewithVat: {
            title: '',
            order: 8,
            excel_cell_header: "H1",
            isVis: true
        }
    };

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private sbillService: SBillService,
        private excelService: ExportExcelService,
        private route: ActivatedRoute,
        private checkPermissions:CheckPermissionsService   ,  
        private printService :PrintAbstractService   
        ) { }
        ngOnInit() {
            this.CCPermissions=this.checkPermissions.checkGroup(6,11)
      
        this.route.queryParams
        .subscribe(params =>{
             this.branchId=+params['branch']
            console.log('branchId',this.branchId);
        }
           
        )
    }

    handleSubmit() {
      //  this.serachModel.from = new Date(this.serachModel.from.getFullYear(), this.serachModel.from.getMonth(), this.serachModel.from.getDate(), this.fromTime.getHours(), this.fromTime.getMinutes());
        //this.serachModel.to = new Date(this.serachModel.to.getFullYear(), this.serachModel.to.getMonth(), this.serachModel.to.getDate(), this.toTime.getHours(), this.toTime.getMinutes());
     //   console.log(this.serachModel);
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
            this.sbillService
            .getSalesBillSummary(this.filterData.serachModel,this.filterData.selectedBranch,this.filterData.selectedCC)
            .subscribe(
                
                res => this.onDataLoadSuccessful(res),
                err => this.onDataLoadFailed(err)
            );    
    }

    onDataLoadSuccessful(items: SaleBillSummary) {
        this.view=true
        console.log(items);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        items.stotal = +items.sDept + +items.sBank + +items.sCash + +items.sNetwork;
        items.rtotal = +items.rDept + +items.rBank + +items.rCash + +items.rNetwork
        items.rtotalWithVat = +items.rtotal + +items.rVat;
        items.stotalWithVat = items.stotal + items.sVat;

        this.NetResult.nbank = items.sBank - items.rBank;
        this.NetResult.ndebt = items.sDept - items.rDept;
        this.NetResult.nnetwork = items.sNetwork - items.rNetwork;
        this.NetResult.ncash = items.sCash - items.rCash;
        this.NetResult.ntotal = items.sWithoutVAt - items.rsWithoutVAt;
        this.NetResult.ntotalWithVat = items.sWithVAt - items.rsWithVAt;
        this.NetResult.nvat = items.sVat - items.rVat;
        const exportedRefunds = {eBank: items.rBank, eDept: items.rDept, eCash: items.rCash, eNetwork: items.rNetwork, evat: items.rVat, ewithoutVat: items.rsWithoutVAt, ewithVat: items.rsWithVAt, label:this.gT('refund')};
        const exportedSales = {eBank: items.sBank, eDept: items.sDept, eCash: items.sCash, eNetwork: items.sNetwork, evat: items.sVat, ewithoutVat: items.sWithoutVAt, ewithVat: items.sWithVAt, label:this.gT('sales')};
        const exportedNetResults = {eBank: this.NetResult.nbank, eDept: this.NetResult.ndebt, eCash: this.NetResult.ncash, eNetwork: this.NetResult.nnetwork, evat: this.NetResult.nvat, ewithoutVat:  items.sWithoutVAt- items.rsWithoutVAt, ewithVat: items.sWithVAt-items.rsWithVAt, label: this.gT('net')};
        this.billSummary = {...items};
        this.exportedItems = [{...exportedSales}, {...exportedRefunds}, {...exportedNetResults}];
        console.log('excel is', this.exportedItems);
          }
    filter(filterData){
        console.log(filterData)

    this.filterData=filterData
       console.log(filterData,this.filterData)
       this.handleSubmit()
       
    }
    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        /*this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
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
    getRemovedHeadersArray() {
        let list: string[] = [];
        for (var key in this.headers) {
            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }
        return list;
    }

    exportAsXLSX() {
        let exportedRows: any[] = [];
        Object.assign(exportedRows, this.exportedItems);
        let e=[]
        let filters=0
        if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
            e.push({
                label: this.filterData.serachModel.from.toLocaleString(),
                
                eNetwork: this.gT("shared.from"),
            },
            {   label:this.filterData.serachModel.to.toLocaleString(),
                
    
                eNetwork: this.gT("shared.to"),
                })
                filters+=2
        }
        if(this.filterData.selectedBranch){
            console.log(this.filterData)
            e.push({  
                label:  this.filterData.branchName,
                eNetwork:this.gT("shared.branch"),
               
             })
      filters++          
        }
         if(this.filterData.selectedCC){
            e.push({  
                label:  this.filterData.costCenterName,
                eNetwork:this.gT("shared.costCenter"),
               
             })
         filters++  
         }
      
           
             e.push({},{   
                eCash:  this.gT("shared.cash"),
                  
                eBank: this.gT("shared.bank"),
                  
                eDept:  this.gT("shared.debt"),
                   
                eNetwork: this.gT("shared.network"),
                 
                evat: this.gT("shared.vat"),
                 
                ewithoutVat: this.gT("shared.withoutVat"),
                 
                ewithVat:  this.gT("shared.withVat"),
                  
               
    })
         exportedRows=e.concat(exportedRows)
        
      /*  let removedKeyArr: string[] = this.getRemovedHeadersArray();
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
        */this.excelService.ExportExcel(exportedRows,this.headers,this.excelLabel,filters,7);
    }
    printDocumnent(){
        this.printService.printDocument(this.billSummary,this.NetResult,this.filterData,'الملخص','ff',true)

    }
    print(){
        this.printService.printDocument(this.billSummary,this.NetResult,this.filterData,'الملخص','ff',false)

    }
}
