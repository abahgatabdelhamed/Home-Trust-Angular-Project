import { ExportExcelService } from './../../shared/services/export-excel.service';
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef,
    Input
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { ItemCatService } from "../services/itemcat.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { PrintSupDocsService } from '../services/supplier.print.service';
import * as XLSX from "xlsx";
import { SupplierInfoComponent } from "./modal/supplier-info.component";
import { SupplierService } from "../services/supplier.service";
import { Supplier } from "../models/supplier.model";
import { Router } from "@angular/router";
import Page from "../models/page.model";
import { SettingsService } from '../../../services/settings.service';
import { PrinterSettingsService } from '../services/printer-settings.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: "supplier",
    templateUrl: "./supplier.component.html",
    styleUrls: ["./supplier.component.css"]
})
export class SupplierComponent implements OnInit, AfterViewInit {
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
    //
    page:Page = new Page(0, 0);
    query = ''




    //
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },

        index: {
            title: this.gT("shared.Index"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        nameAr: {
            title: this.gT("shared.NameAr"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        nameEn: {
            title: this.gT("shared.nameEn"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        fax: {
            title: this.gT("shared.fax"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        mobile: {
            title: this.gT("shared.mobile"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        phone: {
            title: this.gT("shared.phone"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        canLoanDisplay: {
            title: this.gT("shared.canLoanDisplay"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        loanValue: {
            title: this.gT("shared.loanValue"),
            order: 8,
            excel_cell_header: "H1",
            isVis: true
        },
        vatNumber: {
            title: this.gT("shared.vatNumber"),
            order: 9,
            excel_cell_header: "I1",
            isVis: true
        },
        code: {
            title: this.gT("shared.code"),
            order: 10,
            excel_cell_header: "J1",
            isVis: true
        },
        identificationNumber: {
            title: this.gT("shared.identificationNumber"),
            order: 11,
            excel_cell_header: "K1",
            isVis: true
        },
        accounts: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        area: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        bills: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        city: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        createdDate: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        email: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemPeople: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        loanLimit: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        neighborhood: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        personType: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        personTypeId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },

        updatedDate: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },

        updatedBy: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        notes: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },

        createdBy: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        canLoan: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },

        expensesBills: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        
        
    };

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("reportModal")
    reportModal: ModalDirective;


    @ViewChild("supplierEditor")
    supplierEditor: SupplierInfoComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;
    excelLabel: string;
    printerHeader: any;
    printerFooter: any;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private supplierService: SupplierService,
        private ExportExcelService:ExportExcelService
        ,
        private settingService:PrinterSettingsService,
        private router: Router,
        private printer: PrintSupDocsService
    ) {}

    ngOnInit() {

        if (this.router.url == "/definitions/supplier") {
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
        this.columns = this.isSupplierMode? [
            {
                prop: "index",
                name: "#",
                width: 60,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            {
                prop: "code",
                name: this.gT("shared.code"),
                width: 70
            },
            { prop: "nameAr", name: this.gT("shared.nameAr"), width: 70 },
            { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },

            {
                prop: "identificationNumber",
                name: this.gT("shared.identificationNumber"),
                width: 70
            },
            {
                prop: "mobile",
                name: this.gT("shared.mobile"),
                width: 70
            },
            {
                prop: "phone",
                name: this.gT("shared.phone"),
                width: 70
            },
           
            {
                prop: "canLoanDisplay",
                name: this.gT("shared.canLoan"),
                width: 70
            },
            {
                prop: "vatNumber",
                name: this.gT("shared.vatNumber"),
                width: 70
            }
        ] : [
                {
                    prop: "index",
                    name: "#",
                    width: 60,
                    cellTemplate: this.indexTemplate,
                    canAutoResize: false
                },
                
            {
                prop: "code",
                name: this.gT("shared.code"),
                width: 70
            },

                { prop: "nameAr", name: this.gT("shared.nameAr"), width: 70 },
                { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
                
            {
                prop: "identificationNumber",
                name: this.gT("shared.identificationNumber"),
                width: 70
            },
                {
                    prop: "mobile",
                    name: this.gT("shared.mobile"),
                    width: 70
                },
                {
                    prop: "phone",
                    name: this.gT("shared.phone"),
                    width: 70
                },
                {
                    prop: "canLoanDisplay",
                    name: this.gT("shared.canLoan"),
                    width: 70
                },
                {
                    prop: "loanValue",
                    name: this.gT("shared.loanValue"),
                    width: 70
                },
                {
                    prop: "vatNumber",
                    name: this.gT("shared.vatNumber"),
                    width: 70
                }
            ];
        if (this.canManageSupplier) {
            this.columns.push({
                name: "",
                width: 300,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false
            });
        }
        this.loadData();
    }

    handleSubmit(e) {
        console.log(this.serachModel);

        this.supplierService.reportSupplier(this.serachModel,this.page.offset,this.page.size, this.suppId).subscribe(
            results => {
                console.log(results);
                this.report = results;
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
                     
                       
                    }
                      typeindex++;
                });
                console.log('items=',this.report.items)
            }
        );
    }



    ngAfterViewInit() {
        this.supplierEditor.changesSavedCallback = () => {
            this.addNewSupplier();
            this.editorModal.hide();
            this.loadData();
        };

        this.supplierEditor.changesCancelledCallback = () => {
            // this.editSupplier = null;
            this.sourceSupplier = null;
            this.editorModal.hide();
        };
    }

    setPage(pageInfo:any){
        console.log(pageInfo)
        this.page.offset = pageInfo.offset;
        this.loadData();
    }

    loadData() {
       // this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        const whatToLoad = this.isSupplierMode ? "suppliers" : "customers";

        this.supplierService.getSupplier(whatToLoad, this.query,
            this.page.offset + 1, this.page.size).subscribe(
            sups => {
                console.log("log suppliers get supp parametre ",this.query,
                    this.page.offset + 1, this.page.size);

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
         this.page.count = sups.totalCount;

        sups.content.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            // for change id # colum table
            // (<any>bt)['date'] = new Date(bt.date);
            bt.canLoanDisplay = bt.canLoan ?  this.gT("shared.yes")
            : this.gT("shared.no");
        });
        if(this.router.url == "/definitions/supplier"){
            sups.content.forEach((bt, index, sup) => {
                (<any>bt).index = index + 1;
                // for change id # colum table
                // (<any>bt)['date'] = new Date(bt.date);
                bt.canLoanDisplay = bt.canLoan ?  this.gT("shared.yes")
                : this.gT("shared.no");
            });
            this.rowsCache = [...sups.content];
            this.rows = sups.content;
        }else{
            sups.content.forEach((bt, index, sup) => {
                (<any>bt).index = index + 1;
                // for change id # colum table
                // (<any>bt)['date'] = new Date(bt.date);
                bt.canLoanDisplay = bt.canLoan ?   this.gT("shared.yes")
                : this.gT("shared.no");
            });
            this.rowsCache = [...sups.content];
            this.rows = sups.content;
        }

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
//  async
   onSearchChanged(value: string) {

    this.query = value
    this.page.offset = 0;
    this.loadData()

    // let result
    // // result = await this.searchFromAPI(value)
    // console.log("here result search ",  result);
    // // this.onDataLoadSuccessful(result)
    // result['content'].forEach((bt, index, sup) => {
    //     (<any>bt).index = index + 1;
    //     // for change id # colum table
    //     // (<any>bt)['date'] = new Date(bt.date);
    //     bt.canLoanDisplay = bt.canLoan ? "نعم" : "لا";
    // });
    //  this.rows = result['content']
    //  this.page.count = result.totalCount;

        // this.rows = this.rowsCache.filter(r =>
        //     Utilities.searchArray(value, false, r.nameAr, r.nameEn, r.phone, r.mobile)
        // );
    }

    addNewSupplier() {
        if (this.sourceSupplier) {
            Object.assign(this.sourceSupplier, this.editSupplier);
            this.rows = [...this.rows];
            // this.editSupplier = null;
            this.sourceSupplier = null;
        } else {
            let itemcat = new Supplier();
            Object.assign(itemcat, this.editSupplier);
            // this.editSupplier = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>itemcat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, itemcat);
            this.rows.splice(0, 0, itemcat);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.supplierEditor.resetForm(true);
    }

    newSupplier() {
        this.editingName = null;
        this.sourceSupplier = null;
        this.editedSupplier = this.supplierEditor.newSupplier();
        this.showModal();
    }

    editSupplier(row: Supplier) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceSupplier = row;
        this.editedSupplier = this.supplierEditor.editSupplier(row);
        this.editedSupplier = this.supplierEditor.editSupplier(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceSupplier = row;
        this.supplierEditor.displaySupplier(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    reportSupplier(row) {
        this.suppId = row.id;
        this.reportModal.show();
    }

    deleteSupplier(row: Supplier) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.nameAr}`,
            DialogType.confirm,
            () => this.deleteSupplierHelper(row)
        );
    }

    deleteSupplierHelper(row: Supplier) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.supplierService.deleteSupplier(row.id).subscribe(
            results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(sup => sup !== row);
                this.rows = this.rows.filter(sup => sup !== row);
            },
            error => {
                //this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                /*this.alertService.showStickyMessage(
                    this.gT("messages.deleteError"),
                    `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }

    get canManageSupplier() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.supplierEditor.allSupplieregoryParent,
            this.rowsCache
        );
    }

    printDocumnent() {
      //  this.report.items[0].date='2/2/2010'

        this.printer.printDocumentReport(this.report, this.gT("shared.AccountStatement"),this.printerHeader,this.printerFooter,false);
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
        exportedRows.forEach((e,index)=>{
            e.index=index+1
        })
        console.log("here export to Ex this.row",  exportedRows);
      this.ExportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel)
        this.loadData();
    }
}
