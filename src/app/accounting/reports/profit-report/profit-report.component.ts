import { ExcelService } from '../../../services/excel.service';
import { Component } from "@angular/core";
import * as XLSX from "xlsx";
import {
    VatReport,
    VatReportPurch,
    VatReportReceipt,
    VatReportBills
} from "../models/vat-report.model";


import { AbstractBill, AbstractReport } from "../../accounting/models/abstract-model";
import { SaleVatReport, SaleBill } from "../../accounting/models/sales-report.model";
import { PurchVatReport, PurchBill } from "../../accounting/models/purch-model";

import { AppTranslationService } from "../../../services/app-translation.service";
import { VatReportService } from '../services/vat-report.service';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { Router } from '@angular/router';
import { from } from 'rxjs/observable/from';
import { map } from 'rxjs/operators';
import { BillService } from '../../definitions/services/bill.service';
import { SBillService } from '../../shared/services/sbill.service';

@Component({
    selector: "profit-report",
    templateUrl: "./profit-report.component.html",
    styleUrls: ["./profit-report.component.css"]
})
export class ProfitReportComponent {
    gT = (key: string) => this.translationService.getTranslation(key);
    rows: any[];
    isLoading = false;
    serachModel: any = {
        from: new Date().toLocaleDateString(),
        to: new Date().toLocaleDateString()
    };
    filterData: FilterData = {
        selectedBillType: 'SALE',
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel:{from:null,to:null}
    };
    isVatSummary: boolean = false;
    isPurch: boolean = false;
    isReciept: boolean = false;
    isRecieptBills = false;
    isProfit: boolean = true;
    isCC:boolean=false;
    isBranch:boolean=false
    vatSummarySales: VatReport[];
    vatSummaryPurch: VatReport[];
    vatSummaryCurrent: VatReport[];
    purchReportsP: VatReportPurch[];
    purchReportsC: VatReportPurch[];
    recieptSalesReports: VatReportReceipt[];
    recieptBillReports: VatReportBills[];



    salesReports: SaleVatReport[];
    profitReports: any;
    purchReports: PurchVatReport[];
    abstractReports: AbstractReport[];
    showExcelButton: boolean = false;
    excelLabel: string = 'Profit Report';
    headers;
    setType(url){
       switch (url) {
              case '/reports/profit-reports':{
                  this.isProfit=true
            break; 
            }
              case '/reports/profit-cc-reports':{
                   this.isProfit=false;
                   this.isCC=true
            break;
            }
            case '/reports/profit-branch-reports':{
                this.isProfit=false
                this.isBranch=true
                break;
            }
       }
    }
    constructor(private billservice:SBillService, private service: VatReportService,private router:Router, private translationService: AppTranslationService, private excelService: ExcelService) {}

    ngOnInit() {
        this.setType(this.router.url)
        this.loadData();
    }

    loadData() {
    }
    collectCost(){
        this.billservice.CollectCostForCostCenter().subscribe(val => console.log(val))
    }
    handleSubmit() {
        this.isLoading = true;
        if (this.isPurch) {
            this.service.getVatReportPurches(this.serachModel).subscribe(res => {
                this.purchReports = res;
                this.rows = res;
                
        this.showExcelButton = true;
                console.log('rows are', this.rows)
                this.purchReports.forEach(report => {
                    report.bills.forEach(e => e['index'] = report.bills.indexOf(e) + 1)
                })
                this.isLoading = false;
            })
        }
        else if (this.isVatSummary) {
            this.service.getVatReportAbstract(this.serachModel).subscribe(res => { 
                
        this.showExcelButton = true;
                this.onDataLoadSuccess(res); this.isLoading = false; }, err => this.onDataLoadError(err))
        }
        else if (this.isRecieptBills) {
            this.service.getVatReportSales(this.serachModel).subscribe(res => {
                
        this.showExcelButton = true;
                this.salesReports = res;
                this.rows = res;
                console.log('rows are', this.rows)
                this.salesReports.forEach(report => {
                    report.bills.forEach(e => e['index'] = report.bills.indexOf(e) + 1)
                });
                this.isLoading = false;
            });
        } else if(this.isProfit){
            this.service.getVatReportProfit(this.filterData.serachModel).subscribe(res => {
                
        this.showExcelButton = true;
                this.profitReports = res;
                this.rows = res;
                console.log('rows are', this.rows)
                this.profitReports.rows.forEach(e => e['index'] = this.profitReports.rows.indexOf(e) + 1)
                
                this.isLoading = false;
            });
        }else if(this.isCC){
            this.service.getTrialBalanceForCC(this.filterData.selectedCC,this.filterData.serachModel).subscribe(
                {
                    next:(res:any)=>{
                        
        this.showExcelButton = true;
                        this.profitReports = res;
                        this.rows = res;
                        console.log('rows are', this.rows)
                        this.profitReports.rows.forEach(e => e['index'] = this.profitReports.rows.indexOf(e) + 1)
                        
                        this.isLoading = false;
                    }
                }
            )
        }
        else if(this.isBranch){
            this.service.getTrialBalanceForBranch(this.filterData.selectedBranch,this.filterData.serachModel).subscribe(
                {
                    next:(res:any)=>{
                        
        this.showExcelButton = true;
                        this.profitReports = res;
                        this.rows = res;
                        console.log('rows are', this.rows)
                        this.profitReports.rows.forEach(e => e['index'] = this.profitReports.rows.indexOf(e) + 1)
                        
                        this.isLoading = false;
                    }
                }
            )
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
        const profit = document.querySelector(".profit");
        if (currentTab == "sales") {
            sales.classList.add("current");
            purch.classList.remove("current");
            bill.classList.remove("current");
            profit.classList.remove("current");
        } else if (currentTab == "purch") {
            purch.classList.add("current");
            sales.classList.remove("current");
            bill.classList.remove("current");
            profit.classList.remove("current");
        } else if (currentTab == "bill") {
            purch.classList.remove("current");
            sales.classList.remove("current");
            bill.classList.add("current");
            profit.classList.remove("current");
        } else if (currentTab == "profit") {
            purch.classList.remove("current");
            sales.classList.remove("current");
            bill.classList.remove("current");
            profit.classList.add("current");
        }
                else {
            sales.classList.remove("current");
            purch.classList.remove("current");
            bill.classList.remove("current");
            profit.classList.remove("current");
        }
    }

    switchToSales() {
        this.isRecieptBills = false;
        this.isVatSummary = true;
        this.isReciept = false;
        this.isPurch = false;
        this.isProfit = false;
        this.setBackgroundColor("sales");
    }
    switchToCurrentBills(e) {
        this.isPurch = false;
        this.isReciept = false;
        this.isVatSummary = false;
        this.isRecieptBills = true;
        this.isProfit = false;
        this.setBackgroundColor("bill");

    }
    switchToCurrent() {
        this.isVatSummary = false;
        this.isReciept = true;
        this.isPurch = false;
        this.isRecieptBills = false;
        this.isProfit = false;
        this.setBackgroundColor("current");
    }
    switchToPurch(e) {
        console.log("switch");
        this.isPurch = true;
        this.isReciept = false;
        this.isRecieptBills = false;
        this.isVatSummary = false;
        this.isProfit = false;
        this.setBackgroundColor("purch");

    }

switchToProfit(e){
    this.isPurch = false;
    this.isReciept = false;
    this.isRecieptBills = false;
    this.isVatSummary = false;
    this.isProfit = true;
    this.setBackgroundColor("profit");
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
        if (this.isProfit || this.isCC || this.isBranch) {
            this.excelLabel = "Profit Report";
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
                type: {
                    title: '',
                    order: 2,
                    excel_cell_header: "B1",
                    isVis: true
                },
                category: {
                    title: '',
                    order: 3,
                    excel_cell_header: "C1",
                    isVis: true
                },
                account: {
                    title: '',
                    order: 4,
                    excel_cell_header: "D1",
                    isVis: true
                },
                initialBalance: {
                    title: '',
                    order: 5,
                    excel_cell_header: "E1",
                    isVis: true
                }, income: {
                    title: '',
                    order: 6,
                    excel_cell_header: "F1",
                    isVis: true
                }, outcome: {
                    title: '',
                    order: 7,
                    excel_cell_header: "G1",
                    isVis: true
                }, balance: {
                    title: '',
                    order: 8,
                    excel_cell_header: "H1",
                    isVis: true
                },
                
            };
           // this.profitReports.expensesDetails=[{'type':"مصاريف",'balance':"any thing","category":"any"},{'type':"مصاريف",'balance':"any thing","category":"any",'account':'any account'},{'type':"مصاريف",'balance':"any thing","category":"any",'account':'any account'}]
            this.profitReports.abstractRows.forEach(e => {
                var ob = new Object();
                if(e.category=='0' && this.isCC){
                ob["type"] ="تفاصيل مجموع المصاريف";
                }
                else{
                    ob["type"] = e.type;
                    ob["balance"] = e.balance;
                }
                this.profitReports.rows.push(ob)
                if(e.category=='0' && this.isCC){
                    var ob = new Object();
                    ob["category"] = this.gT("shared.category");
                    ob["account"]=this.gT("shared.account")
                   ob["balance"] = this.gT("shared.balance")
                   this.profitReports.rows.push(ob)
                    this.profitReports.expensesDetails.forEach(e1 =>{
                        var ob = new Object();
                        ob["balance"] = e1.balance;
                        ob["account"]=e1.account;
                        ob["category"]=e1.category
                        this.profitReports.rows.push(ob)
                    })
                    var ob = new Object();
                    ob["type"] = e.type;
                    ob["balance"] = e.balance;
                this.profitReports.rows.push(ob)
                  
                }
                
            });
        }
        else if (!this.isPurch) {
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

    } else if (this.isProfit) {

        Object.assign(exportedRows, this.profitReports.rows);    
    }
    else if(this.isCC){
        Object.assign(exportedRows, this.profitReports.rows);
    }
    else if(this.isBranch){
        Object.assign(exportedRows, this.profitReports.rows);
    }
    let e=[]
    let filters=0
    let col=0;
    if(this.filterData.selectedBranch ){
        if(this.isBranch || this.isCC){
           
             e.push({  
                index:  this.filterData.branchName,
                income:this.gT("shared.branch"),
               
             })
             
             filters++    
        }
        
        
    }
     if(this.filterData.selectedCC){
        if(this.isCC){
             e.push({  
                index: this.filterData.costCenterName,
                income:this.gT("shared.costCenter"),
               
             })
             filters++  
        }
 
     }
        if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
            
      
                 e.push({  
                    index: this.filterData.serachModel.from.toLocaleString(),
                    income:this.gT("shared.from"),
                   
                 },{  
                    index: this.filterData.serachModel.to.toLocaleString(),
                    income:this.gT("shared.to"),
                   
                 })
               
    filters+=2
        
    }
           if(this.isProfit||this.isBranch||this.isCC){
            e.push({},{ 
                index:  this.gT("shared.indexx"),
               
            type:  this.gT("shared.type"),
              
            category:this.gT("shared.category"),
             
            account:  this.gT("shared.account"),
              
            initialBalance:this.gT("shared.initialBalanceReport"),
                 income: this.gT("shared.income"),
            
             outcome:this.gT("shared.outcome"),
                 balance:  this.gT("shared.balance"),
               
           })
           col =8
           }
       
              
        exportedRows=e.concat(exportedRows)
    
    console.log(exportedRows);
    let j=[0,0,0,0,0,0,0]
    for(let i=0;i<=filters+1;i++){
  j[i]=i
    }
    
   // worksheet= XLSX.utils.sheet_add_json(worksheet, [["this is afilter", 1, 2, 3]], {origin: "A0"});
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
        console.error(worksheet);
        if(this.isBranch)
        this.excelLabel='Profit for branch Report'
        if(this.isCC)
        this.excelLabel='Profit for Cost Center Report'
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
    }
    filter(filterData){
        console.log(filterData)
    //     this.filterData.selectedBranch = filterData.selectedBranch;
    //     this.filterData.selectedCC = filterData.selectedCC;
    //     this.filterData.selectedBillType = filterData.selectedBillType;
    //    this.filterData.serachModel=filterData.searchModel
        this.filterData=filterData
       console.log(filterData,this.filterData)
        this.handleSubmit();
    }
}
