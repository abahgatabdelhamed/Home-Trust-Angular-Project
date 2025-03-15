
import { Component } from "@angular/core";
import * as XLSX from "xlsx";
import {
    VatReport,
    VatReportPurch,
    VatReportReceipt,
    VatReportBills
} from "../models/vat-report.model";




import { AppTranslationService } from "../../../services/app-translation.service";
import { VatReportService } from '../services/vat-report.service';
import { ExcelService } from "../../../services/excel.service";
import { AbstractReport } from "../../accounting/models/abstract-model";
import { PurchVatReport } from "../../accounting/models/purch-model";
import { SaleVatReport } from "../../accounting/models/sales-report.model";
import { FilterData } from "../../shared/models/branch-cc-filter.model";
import { CheckPermissionsService } from "../../../services/check-permissions.service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { Router } from "@angular/router";
import { ConfigurationService } from "../../../services/configuration.service";

@Component({
    selector: "vat-report",
    templateUrl: "./vat-report.component.html",
    styleUrls: ["./vat-report.component.css"]
})
export class VatReportComponent {
    gT = (key: string) => this.translationService.getTranslation(key);
    rows: any[];
    isLoading = false;
  /*  serachModel: any = {
        from: new Date().toLocaleDateString(),
        to: new Date().toLocaleDateString()
    };*/
    CCPermissions:boolean=false
    isVatSummary: boolean = true;
    isPurch: boolean = false;
    isReciept: boolean = false;
    isRecieptBills = false;
    vatSummarySales: VatReport[];
    vatSummaryPurch: VatReport[];
    vatSummaryCurrent: VatReport[];
    purchReportsP: VatReportPurch[];
    purchReportsC: VatReportPurch[];
    recieptSalesReports: VatReportReceipt[];
    recieptBillReports: VatReportBills[];
    isTobaccoReport:boolean=false
    filterData: FilterData = {
        selectedBillType: '',
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel:{from:null,to:null}
    };

   view=false
    salesReports: SaleVatReport[];
    purchReports: PurchVatReport[];
    abstractReports: AbstractReport[];
    showExcelButton: boolean = true;
    excelLabel: string = 'Vat Report';
    headers;
    constructor(private service: VatReportService,
         private translationService: AppTranslationService,
          private exportExcelService: ExportExcelService,
          private excelService: ExcelService
          ,public checkPermissions:CheckPermissionsService  ,
          private router:Router   ,
          public config:ConfigurationService    
          ) { }
          ngOnInit() {
            this.router.url.includes('abstract')?this.isTobaccoReport=true:this.isTobaccoReport=false
              this.CCPermissions=this.checkPermissions.checkGroup(6,11)
              console.log(this.checkPermissions.checkGroup(6,11),this.CCPermissions)
       
        this.loadData();
    }

    loadData() {
        if(this.router.url.includes('vat-reports-purch'))
        this.switchToPurch(null)
        else if(this.router.url.includes('vat-reports-sales'))
        this.switchToCurrentBills(null)
        else
        this.switchToSales()
    }

    handleSubmit() {
        this.showExcelButton = true;
        this.isLoading = true;
        if (this.isPurch) {
            this.service.getVatReportPurches(this.filterData.serachModel).subscribe(res => {
                this.purchReports = res;
                this.rows = res;
                this.view=true
                console.log('rows are', this.rows)
                this.purchReports.forEach(report => {
                    report.bills.forEach(e => e['index'] = report.bills.indexOf(e) + 1)
                })
                this.isLoading = false;
            })
        }
        else if (this.isVatSummary) {
            this.isTobaccoReport?
            this.service.getAbstractTobaco(this.filterData.serachModel,this.filterData.selectedBranch,this.filterData.selectedCC).subscribe(res => { this.onDataLoadSuccess(res); this.isLoading = false;   this.view=true}, err => this.onDataLoadError(err))
            :this.service.getVatReportAbstract(this.filterData.serachModel,this.filterData.selectedBranch,this.filterData.selectedCC).subscribe(res => { this.onDataLoadSuccess(res); this.isLoading = false;   this.view=true}, err => this.onDataLoadError(err))
        }
        else if (this.isRecieptBills) {
            this.service.getVatReportSales(this.filterData.serachModel).subscribe(res => {
                this.salesReports = res;
                this.rows = res;
                this.view=true
                console.log('rows are', this.rows)
                this.salesReports.forEach(report => {
                    report.bills.forEach(e => e['index'] = report.bills.indexOf(e) + 1)
                });
                this.isLoading = false;
            });
        }
    }

    onDataLoadSuccess(res) {
        // this.vatSummaryCurrent = res;
        this.abstractReports = res;
        this.rows = res;
        console.log('rows are', this.rows);
        this.abstractReports.forEach(report => {
            report.bills.forEach(e => e['index'] = report.bills.indexOf(e) + 1)
        })
    }

    onDataLoadError(err) {}

    setBackgroundColor(currentTab) {
        const sales = document.querySelector(".sales");
        const purch = document.querySelector(".purch");
        const bill = document.querySelector(".bill");
        
        if (currentTab == "sales") {
            sales.classList.add("current");
            purch.classList.remove("current");
            bill.classList.remove("current");
        } else if (currentTab == "purch") {
            purch.classList.add("current");
            sales.classList.remove("current");
            bill.classList.remove("current");
        } else if (currentTab == "bill") {
            purch.classList.remove("current");
            sales.classList.remove("current");
            bill.classList.add("current");
        } 
                else {
            sales.classList.remove("current");
            purch.classList.remove("current");
            bill.classList.remove("current");
            
        }
    }

    switchToSales() {
        this.view=false
        this.isRecieptBills = false;
        this.isVatSummary = true;
        this.isReciept = false;
        this.isPurch = false;
      //  this.setBackgroundColor("sales");
    }
    switchToCurrentBills(e) {
        this.view=false
        this.isPurch = false;
        this.isReciept = false;
        this.isVatSummary = false;
        this.isRecieptBills = true;
      //  this.setBackgroundColor("bill");

    }
    switchToCurrent() {
        this.view=false
        this.isVatSummary = false;
        this.isReciept = true;
        this.isPurch = false;
        this.isRecieptBills = false;
        //this.setBackgroundColor("current");
    }
    switchToPurch(e) {
        this.view=false
        console.log("switch");
        this.isPurch = true;
        this.isReciept = false;
        this.isRecieptBills = false;
        this.isVatSummary = false;
        //this.setBackgroundColor("purch");

    }




    getRemovedHeadersArray() {

        let list: string[] = [];
        for (var key in this.headers) {

            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }

        for(var keyRow in this.rows[0]){
            for(var keyHeader in this.headers){
                if(keyRow === keyHeader ){
                    break
                }
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
                    if (this.headers[key].isVis == true) {
                        list.push(key);
                    }
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
        if (this.isVatSummary) {
            this.headers = {
                id: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                index: {
                    title:'',
                    order: 1,
                    excel_cell_header: "A1",
                    isVis: true
                },
                receiptCode: {
                    title: '',
                    order: 2,
                    excel_cell_header: "B1",
                    isVis: true
                },
                priceBeforeVat: {
                    title: '',
                    order: 3,
                    excel_cell_header: "C1",
                    isVis: true
                },
                vat: {
                    title: '',
                    order: 4,
                    excel_cell_header: "D1",
                    isVis: true
                },

                priceAfterVat: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },

                personCode: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                tag: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                date: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                personName: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                personNumber: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                vatType: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                vatNumber: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                accountName: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
                accountNumber: {
                    title: "",
                    order: 0,
                    excel_cell_header: "",
                    isVis: false
                },
            };
        } else {
            if(this.isPurch){
                this.headers = {
                    id: {
                        title: "",
                        order: 0,
                        excel_cell_header: "",
                        isVis: false
                    },
                    index: {
                        title:'',
                        order: 1,
                        excel_cell_header: "A1",
                        isVis: true
                    },
                    receiptCode: {
                        title: '',
                        order: 2,
                        excel_cell_header: "B1",
                        isVis: true
                    },
                    priceBeforeVat: {
                        title: '',
                        order: 3,
                        excel_cell_header: "C1",
                        isVis: true
                    },
                    vat: {
                        title: '',
                        order: 4,
                        excel_cell_header: "D1",
                        isVis: true
                    },
    
                    priceAfterVat: {
                        title: '',
                        order: 5,
                        excel_cell_header: "E1",
                        isVis: true
                    },
    
                    personCode: {
                        title: '',
                        order: 6,
                        excel_cell_header: "F1",
                        isVis: true
                    },
                    date: {
                        title: '',
                        order: 7,
                        excel_cell_header: "G1",
                        isVis: true
                    },
                    personName: {
                        title: '',
                        order: 8,
                        excel_cell_header: "H1",
                        isVis: true
                    },
                    vatType: {
                        title: '',
                        order: 9,
                        excel_cell_header: "I1",
                        isVis: true
                    },
                    vatNumber: {
                        title: '',
                        order: 10,
                        excel_cell_header: "J1",
                        isVis: true
                    },
                    accountName: {
                        title: '',
                        order: 11,
                        excel_cell_header: "K1",
                        isVis: true
                    },
                    accountNumber: {
                        title: '',
                        order: 12,
                        excel_cell_header: "L1",
                        isVis: true
                    },
                };
            }
            else{
                //headers for sales reciepts 
                this.headers = {
                    id: {
                        title: "",
                        order: 0,
                        excel_cell_header: "",
                        isVis: false
                    },
                    index: {
                        title: '',
                        order: 1,
                        excel_cell_header: "A1",
                        isVis: true
                    },
                    receiptCode: {
                        title: '',
                        order: 2,
                        excel_cell_header: "B1",
                        isVis: true
                    },
                    personName: {
                        title: '',
                        order: 3,
                        excel_cell_header: "C1",
                        isVis: true
                    },
                    vatNumber: {
                        title: '',
                        order: 4,
                        excel_cell_header: "D1",
                        isVis: true
                    },
    
                    vatType: {
                        title: '',
                        order: 5,
                        excel_cell_header: "E1",
                        isVis: true
                    },
    
                    date: {
                        title: '',
                        order: 6,
                        excel_cell_header: "F1",
                        isVis: true
                    },
                    priceBeforeVat: {
                        title: '',
                        order: 7,
                        excel_cell_header: "G1",
                        isVis: true
                    },
                    vat: {
                        title: '',
                        order: 8,
                        excel_cell_header: "H1",
                        isVis: true
                    },
                    priceAfterVat: {
                        title: '',
                        order: 9,
                        excel_cell_header: "I1",
                        isVis: true
                    },
                    tag: {
                        title: '',
                        order: 10,
                        excel_cell_header: "J1",
                        isVis: true
                    },
                    accountName: {
                        title: '',
                        order: 11,
                        excel_cell_header: "K1",
                        isVis: false
                    },
                    accountNumber: {
                        title: '',
                        order: 12,
                        excel_cell_header: "L1",
                        isVis: false
                    },
                    personNumber: {
                        title: '',
                        order: 13,
                        excel_cell_header: "K1",
                        isVis: false
                    },
                    personCode: {
                        title: '',
                        order: 14,
                        excel_cell_header: "L1",
                        isVis: false
                    },
                };
            }
        }
        let exportedRows: any[] = [];
    if(this.isPurch) {
        const nestedArrays = this.purchReports.map(e => e.bills);
        exportedRows = [...nestedArrays[0], ...nestedArrays[1], ...nestedArrays[2]];

    }
    else if (this.isVatSummary) {
        Object.assign(exportedRows, this.abstractReports);
        const nestedArrays = this.abstractReports.map(e => e.bills);
        exportedRows = [...nestedArrays[0], ...nestedArrays[1], ...nestedArrays[2]];
    }
    else if (this.isRecieptBills) {
        Object.assign(exportedRows, this.abstractReports);
        const nestedArrays = this.salesReports.map(e => e.bills);
        exportedRows = [...nestedArrays[0], ...nestedArrays[1], ...nestedArrays[2]];

    }


    let e=[]
    let filters=0
    let col=0
    if(this.filterData.selectedBranch){
        if(this.isVatSummary){
            e.push({  
                index:  this.filterData.branchName,
                priceBeforeVat:this.gT("shared.branch"),
               
             })
             filters++    
        }else{
            if(this.isPurch){
                
            }else{
               
            }
        }
        
        
    }
     if(this.filterData.selectedCC){
        if(this.isVatSummary){
            e.push({  
                index: this.filterData.costCenterName,
                priceBeforeVat:this.gT("shared.costCenter"),
               
             })
             filters++  
        }else{
            if(this.isPurch){
              }else{
               
            }
        
        }
 
     }
        if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
            
            if(this.isVatSummary){
                e.push({  
                    index: this.filterData.serachModel.from.toLocaleString(),
                    priceBeforeVat:this.gT("shared.from"),
                   
                 },{  
                    index: this.filterData.serachModel.to.toLocaleString(),
                    priceBeforeVat:this.gT("shared.to"),
                   
                 })
            }else{
                if(this.isPurch){
                    e.push({  
                        index: this.filterData.serachModel.from.toLocaleString(),
                        personName:this.gT("shared.from"),
                       
                     },{  
                        index: this.filterData.serachModel.to.toLocaleString(),
                        personName:this.gT("shared.to"),
                       
                     })
                }else{
                    e.push({  
                        index:  this.filterData.serachModel.from.toLocaleString(),
                        priceBeforeVat:this.gT("shared.from"),
                       
                     },{  
                        index:  this.filterData.serachModel.to.toLocaleString(),
                        priceBeforeVat:this.gT("shared.to"),
                       
                     })
                }
            }
    filters+=2
        
    }
        if (this.isVatSummary) {
            e.push({},{     
            index:this.gT("shared.Index"),
               
            receiptCode:this.gT("shared.code"),
               
            priceBeforeVat: this.gT("shared.priceBeforeVat"),
               
            vat:this.gT("shared.vat"),
              

             })
           col=3
        } else {
            if(this.isPurch){
               e.push({},{ 
                    index: this.gT("shared.Index"),
                    receiptCode: this.gT("shared.billCode"),
                   
                priceBeforeVat:  this.gT("shared.priceBeforeVat"),
                   
                vat:  this.gT("shared.vat"),
                  
        
                priceAfterVat:  this.gT("shared.priceAfterVat"),
                    
        
                personCode: this.gT("shared.supplierCode"),
                  
                date:  this.gT("shared.date"),
                   
                personName: this.gT("shared.supplierName"),
                 
                vatType:  this.gT("shared.vatType"),
                 
                vatNumber: this.gT("shared.vatNumber"),
                  
                accountName: this.gT("shared.account"),
                    
                accountNumber:this.gT("shared.accountNumber"),
                 })
                 col=12
                }
            else{
                //headers for sales reciepts 
                e.push({},{
                    index:  this.gT("shared.Index"),
                       
                    receiptCode: this.gT("shared.billCode"),
                     
                    personName: this.gT("shared.customerName"),
                      
                    vatNumber:  this.gT("shared.vatNumber"),
                      
    
                    vatType: this.gT("shared.vatCat"),
                       
    
                    date: this.gT("shared.date"),
                       
                    priceBeforeVat:  this.gT("shared.salesValue"),
                       
                    vat: this.gT("shared.vat"),
                      
                    priceAfterVat:this.gT("shared.priceAfterVat"),
                      
                    tag:  this.gT("shared.tag"),
                      
                    accountName:this.gT("shared.account"),
                      
                    accountNumber: this.gT("shared.accountNumber"),
                       
                    personNumber:  this.gT("shared.account"),
                       
                    personCode: this.gT("shared.accountNumber"),
                        
                })
               col=10
            }
       
        }      
        exportedRows=e.concat(exportedRows)
        console.log(exportedRows)
       //  this.exportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel,filters,col)
    
    console.log(exportedRows);
        let removedKeyArr: string[] = this.getRemovedHeadersArray();
        for (var removedKey of removedKeyArr) {
            for (var row of exportedRows) {
                if (row)
                    delete row[removedKey];
            }
        }
        let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            exportedRows.filter(x => x != null),
            { header: orderedKeyArr }
        );

        let j=[0,0,0,0,0,0,0]
        for(let i=0;i<=filters;i++){
      j[i]=i
        }
        
       // worksheet= XLSX.utils.sheet_add_json(worksheet, [["this is afilter", 1, 2, 3]], {origin: "A0"});
       if(filters>0){
          if(!worksheet['!merges']) 
          worksheet['!merges'] = [];
          switch(filters){
            case 1:{
                worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}});
                break
          }
          case 2:{
            worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}});
            break
          }
          case 3:{
            worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}});
      
            break
          }
          case 4:{
            worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[4],c:0},e:{r:j[4],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}},{s:{r:j[4],c:(col/2)+1},e:{r:j[4],c:col}});
      
            break
          }
          case 5:{
            worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[4],c:0},e:{r:j[4],c:col/2}},{s:{r:j[5],c:0},e:{r:j[5],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}},{s:{r:j[4],c:(col/2)+1},e:{r:j[4],c:col}},{s:{r:j[5],c:(col/2)+1},e:{r:j[5],c:col}});
      
            break
          }
          

          }
          
       
       }
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
        //console.error(worksheet);
        if(this.isVatSummary)
        this.excelLabel=this.isTobaccoReport?'Tobacco Tax Summery':'Tax Summary'
        else{
            if(this.isPurch)
        this.excelLabel='Vat Report'
        else
        this.excelLabel='Vat on invoices Report'
        }
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
    }
    filter(filterData){
        console.log(filterData)

    this.filterData=filterData
       console.log(filterData,this.filterData)
       this.handleSubmit()
       
    }

}
