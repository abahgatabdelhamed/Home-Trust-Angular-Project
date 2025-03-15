import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import { AccountService } from "../../../services/account.service";
import { AlertService, DialogType } from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { SettingsService } from "../../../services/settings.service";
import Page from "../../definitions/models/page.model";
import { Supplier } from "../../definitions/models/supplier.model";
import { PrinterSettingsService } from "../../definitions/services/printer-settings.service";
import { PrintSupDocsService } from "../../definitions/services/supplier.print.service";
import { SupplierService } from "../../definitions/services/supplier.service";

@Component({
    selector: "supplier-info",
    templateUrl: "./supplier-info.component.html",
    styleUrls: ["./supplier-info.component.css"]
})
export class SupplierInfoComponent implements OnInit {
    serachModel: any = {
        from: new Date(),
        to: new Date()
    };
    isSupplierMode: boolean = true;
    editingName: { nameAr: string };
    sourceSupplier: Supplier;
    editedSupplier: Supplier;
    rows: Supplier[] = [];
    rowsCache: Supplier[] = [];
    columns: any[] = [];
    suppId: number;
    report;
    reportLo=null;
    loadingIndicator: boolean;
    supplierSelected;
    sups=[]
    isviewbills:boolean=false
    //
    page:Page = new Page(1, 0);
    query = ''




    //
    gT = (key: string) => this.translationService.getTranslation(key);
    excelLabel: string;
    printerHeader: any;
    printerFooter: any;
    bills: any;
    
    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private supplierService: SupplierService,
        private router: Router,
        private settingService:PrinterSettingsService,
        private printer: PrintSupDocsService,
        private ch:ChangeDetectorRef
    ) {}

    ngOnInit() {
        
        this.serachModel.from.setHours(0, 0, 0, 0)
        this.serachModel.to.setHours(23, 59, 59, 999)
        if (this.router.url == "/reports/supplier-info") {
            this.isSupplierMode = true;
            console.log("supplier mode is activated");
        } else {
            this.isSupplierMode = false;
            console.log("customer mode is activated");
        }
        this.settingService.getPrinterSettings().subscribe(res => {
            console.log('ress is', res);
            this.printerHeader = res.thermalPrinter.header;
            this.printerFooter=res.thermalPrinter.footer
        });
        this.excelLabel =  this.isSupplierMode? 'Supplier' : 'Customer'
        this.loadData();
    }

    handleSubmit(e) {
        console.log(this.serachModel);

        this.supplierService.reportSupplier(this.serachModel,this.page.offset,this.page.size, this.suppId).subscribe(
            results => {
                console.log(results);
                this.report = results;
                
               /* this.bills=null
                 this.report.bills.forEach(element => {
                    this.bills.push(element)
                 });
                 */                  
                console.log(this.bills)
           //     let items:any[]=[{date:this.formatDate(new Date()),time:'',code:'',type:'',amount:'',total:'5'},{date:this.formatDate(new Date()),time:'',code:'',type:'',amount:'',total:'6'},{date:this.formatDate(new Date()),time:'',code:'',type:'',amount:'',total:'7'}]
               //  this.report.items=[{date: new Date(),time:55,code:'',type:0,amount:'',total:'5'},{date:new Date(),time:'',code:'',type:77,amount:'',total:'6'},{date:new Date(),time:'',code:'',type:89,amount:'',total:'6'},{date:new Date(),time:'',code:'',type:99,amount:'',total:'7'}]
                 this.report.items.sort((y, x) => +new Date(x.date) - +new Date(y.date));
                let typeindex=0

                this.report.items.forEach(element => {
                    let temparray:any[]=[]
                    if(element.type==0){
                      //  console.log('e=',element)
                       temparray[0]=element

                       this.report.items.splice(typeindex,1);
                       temparray=temparray.concat(this.report.items) 
                      
                       this.report.items=temparray
                       temparray=[]
                       
                    }
                    
                      typeindex++;
                      let str:string
                     str= element.time
                     element.time=str.substring(0,5)
                     console.log(str)

                });
                console.log('items=',this.report.items)
                if(e==2){
                    console.log('eeeeeeee')
                    this.printer.printDocumentReport(this.report, this.gT("shared.AccountStatement"),this.printerHeader,this.printerFooter,this.isviewbills);

                }
            }
        );
    }
 



    loadData() {
       // this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        const whatToLoad = this.isSupplierMode ? "suppliers" : "customers";

        this.supplierService.getSupplier(whatToLoad, this.query,
            this.page.offset + 1,-1).subscribe(
            sups => {
                console.log("log suppliers get supp parametre ",this.query,
                    this.page.offset + 1, -1);

                this.onDataLoadSuccessful(sups),
                 console.log("supllier ",sups);

            },
            err => this.onDataLoadFailed(err)
        );
    }

    // Supplier[]
    onDataLoadSuccessful(sups: any) {
        console.log("from server  on data load success ");
        console.log(sups);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        
        
            this.sups=sups.content
         
        

    }

    onDataLoadFailed(error: any) {
     //   this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

     /*   this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

  searchFromAPI(value){
    const whatToLoad = this.isSupplierMode ? "suppliers" : "customers";
    return this.supplierService.getSupplier(whatToLoad, value, 1,10)
    .toPromise().then(st =>{
        // st['content']
        console.log("st promise data",st['content'])
        return st
    });
  }
// 
   

   
   
    

    
    
setpage(e){
    console.log(e)
this.page.offset=e.offset+1
this.page.size=e.size

this.handleSubmit(e)
}
    printDocumnent() {
        if(this.isviewbills){
            this.page.size=-1
            this.page.offset=-1
            this.handleSubmit(2)
        }
       else
        this.printer.printDocumentReport(this.report, this.gT("shared.AccountStatement"),this.printerHeader,this.printerFooter,this.isviewbills);
      }





    // get all supplier data
    getAllDataToExport(){
        // this.supplierService.getSupplier(whatToLoad, this.query,
        //     this.page.offset + 1, this.page.size)
        const whatToLoad = this.isSupplierMode ? "suppliers" : "customers";
        // if you need get all data should you set -1 , -1 =>1,50
        return this.supplierService.getSupplier(whatToLoad, '', -1,-1)
            .toPromise().then(st =>{
                console.log("st promise data",st['content'])
                return st['content']
            });
    }

    async   exportAsXLSX() {
        let exportedRows: any[] = [];
        exportedRows = await this.getAllDataToExport()
        console.log("here export to Ex this.row",  exportedRows);
 //     this.ExportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel)
        this.loadData();
    }
}
