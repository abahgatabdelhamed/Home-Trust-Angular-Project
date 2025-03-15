import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    ChangeDetectorRef,
    AfterContentInit,
    Input,
    Output,
    EventEmitter,
    DoCheck,
    OnChanges,
    SimpleChanges
} from "@angular/core";
import {
    AlertService,
    DialogType,
} from "../../../services/alert.service";
import * as XLSX from "xlsx";
import { AppTranslationService } from "../../../services/app-translation.service";
import { SBillService } from "../../shared/services/sbill.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { AccountService } from "../../../services/account.service";
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import Page from '../../shared/models/page.model';
import { environment } from "../../../../environments/environment";
import { CostCenterService } from "../../definitions/services/cost-center.service";
import { Pagination } from "../../shared/models/pagination.model";
import { BillPost } from "../../shared/models/bill-post.model";
import { map } from "rxjs/operators";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { EmitterVisitorContext } from "@angular/compiler";
import { CheckPermissionsService } from "../../../services/check-permissions.service";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: "bills",
    templateUrl: "./bills.component.html",
    styleUrls: ["./bills.component.css"]
})
export class BillsComponent implements OnInit ,AfterContentInit ,OnChanges{
@Input() rows1:any
@Output() page1= new EventEmitter()
    ChangeDeliveryStatus:boolean=false
    rows: any = [];
    excelLabel = '';
    columns: any[] = [];
    loadingIndicator: boolean;
    isSuperAdmin = false;
    withUsers:boolean=false
    filterData: FilterData = {
        selectedBillType: null,
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel :{
            from:null,
            to:null
        }
    };
    isCustomerReporst:any=false
    view=false
    searchQuery = '';
    page: Page = new Page(environment.pagination.size, environment.pagination.offset, 0);
    isCostCenterEnabled: boolean = false;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {};
    CCPermissions:boolean=false
    
    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("isDeliveredTemplate")
    isDeliveredTemplate: TemplateRef<any>;

    @ViewChild("sbillTypeTemplate")
    sbillTypeTemplate: TemplateRef<any>;

    @ViewChild("sbillDateTemplate")
    sbillDateTemplate: TemplateRef<any>;

    @ViewChild("amount")
    amount: TemplateRef<any>;
    
    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private sbillService: SBillService,
        private excelService: ExcelService,
        private exportExcelService:ExportExcelService,
        public router: Router,
        private costCenterService: CostCenterService,
        private activeRout: ActivatedRoute,
        private accountService: AccountService,
        private checkPermissions:CheckPermissionsService ,
        private authService:AuthService,
        private change:ChangeDetectorRef
        
    ) { }

    ngAfterContentInit(): void {
       
    }

     ngOnChanges(changes: SimpleChanges): void {
         console.log(this.rows1.bills)
         if(this.isCustomerReporst){
            this.rows1.bills.content.forEach((val,idx) => {
        
          
                val.index = idx + 1;
                val.branchName = val.branch ? val.branch.name : '';
                val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
                val.billItems.forEach(element => {
                    val.discount+=element.discount
                });
                val.billServices.forEach(element => {
                    val.discount+=element.discount
                });
            
        
       });
            console.log(this.rows,this.rows1)
            this.view=true
            this.loadingIndicator = false;
            this.rows = this.rows1.bills.content;
            this.page.count = this.rows1.bills.totalCount;
            this.page.offset = this.rows1.bills.currentPageNumber - 1 ;
            console.log(this.isCustomerReporst)
            console.log(this.rows,this.rows1.bills)
           
         }
     }   
    
    ngOnInit() {
        this.withUsers=this.router.url.includes('bills')
        this.isSuperAdmin=this.authService.userInStorage.value.roles.includes('superadmin')
        this.CCPermissions=this.checkPermissions.checkGroup(6,11)
        this.ChangeDeliveryStatus=this.checkPermissions.checkGroup(5,18)
        this.intializeCoulmsHeaders();
        this.isCostCenterEnabled = this.checkCostCenterEnabled();
       
        if(this.router.url.includes('info')){
          
            console.log(this.router.url.includes('customer-info'),this.router.url)
            
            this.isCustomerReporst=true
        }
        this.change.detectChanges()
      //  this.loadData();

    }

    setExcelLable() {
        let billType = this.filterData.selectedBillType;
        if (billType) {
            switch (billType) {
                case "SALE": {
                    this.excelLabel = "Sales Report";
                    break;
                }
                case "RSALE": {
                    this.excelLabel = "Sales Refund Report";
                    break;
                }
                case "QUATE": {
                    this.excelLabel = "Quotations Report";
                    break;
                }
                case "PURCH": {
                    this.excelLabel = "Purchases Report";
                    break;
                }
                case "EXCHANGE": {
                    this.excelLabel = "Damaged Items Report";
                    break;
                }
                case "RPURCH": {
                    this.excelLabel = "Purchases Refund Items Report";
                    break;
                }
                default: {
                    this.goNotFound();
                    break;
                }
            }
        }
    }

    filter(filterData) {
        console.log(filterData)
        this.page.offset = 0;
        this.filterData=filterData
        this.intializeCoulmsHeaders();
        this.loadData();
    }


    goNotFound() {
        this.router.navigate(["/notFound"]);
    }

    showBill(row) {
        let billType = this.filterData.selectedBillType;
        switch (billType) {
            case 'SALE':
                this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/sale'+'/'+ row.id, '_blank'); });
               // this.router.navigate(['/reports/bills', 'bill', 'sale', row.id]);
                break;

            case 'RSALE':
                this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/rsale'+'/'+ row.id, '_blank'); });
              //  this.router.navigate(['/reports/bills', 'bill', 'rsale', row.id]);
                break;

            case 'QUATE':
                this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/quate'+'/'+ row.id, '_blank'); });
              //  this.router.navigate(['/reports/bills', 'bill', 'quate', row.id]);
                break;

            case 'EXCHANGE':

            this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/exchange'+'/'+ row.id, '_blank'); });
               // this.router.navigate(['/reports/bills', 'bill', 'exchange', row.id]);
                break;

            case 'PURCH':
                this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/purch'+'/'+ row.id, '_blank'); });
              //  this.router.navigate(['/reports/bills', 'bill', 'purch', row.id]);
                break;

            case 'RPURCH':
                this.router.navigate([]).then(result => {  window.open('/reports/bills/bill/rpurch'+'/'+ row.id, '_blank'); });
                //this.router.navigate(['/reports/bills', 'bill', 'rpurch', row.id]);
                break;
        }
    }


    loadData() {
        this.loadingIndicator = true;
        if(this.isCustomerReporst){
       this.rows1.bills.content.forEach((val,idx) => {
        
          
                val.index = idx + 1;
                val.branchName = val.branch ? val.branch.name : '';
                val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
                  
            
        
       });
            console.log(this.rows,this.rows1)
            this.view=true
            this.loadingIndicator = false;
            this.rows = this.rows1.bills.content;
            this.page.count = this.rows1.bills.totalCount;
            this.page.offset = this.rows1.bills.currentPageNumber - 1 ;
            console.log(this.isCustomerReporst)
            console.log(this.rows,this.rows1.bills)
            this.change.detectChanges()
        }else
        this.sbillService.getSBills(this.filterData.serachModel,
            this.filterData.selectedBillType, this.searchQuery, this.filterData.selectedBranch,
            this.filterData.selectedCC, this.page.size, this.page.offset + 1
       ,this.filterData.userSelected ).pipe(
            map(res => {
                res.content = res.content.map(
                    (val, idx) => {
                        val.index = idx + 1;
                        val.branchName = val.branch ? val.branch.name : '';
                        val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
                          return val;
                    }
                );
                return res;
            })).subscribe(
                (data: Pagination<BillPost>) => {
                    this.view=true
                    this.loadingIndicator = false;
                    this.rows = data.content;
                    this.page.count = data.totalCount;
                    this.page.offset = data.currentPageNumber - 1 ;

                },
                (error: any) => {
                    this.loadingIndicator = false;
                }
            )

    }


    onSearchChanged(value: string) {
        this.searchQuery = value;
        this.page.offset = 0;
        this.loadData();
    }

    setPage(pageInfo) {
        console.log(pageInfo)
        this.page.offset = pageInfo.offset;

        this.page1.emit(this.page)
        this.loadData();
    }





    changeStatus(row) {
        this.loadingIndicator = true;
        this.sbillService.changeStatus(row.id, row.isDelivered).subscribe(
            (data: any) => {
                this.loadingIndicator = false;
            },
            error => { this.loadingIndicator = false; }
        );
    }




    checkCostCenterEnabled() {
        return this.costCenterService.checkCostCenterEnabled();
    }



    intializeCoulmsHeaders() {
        let billType = this.filterData.selectedBillType;
        this.headers = {
            id: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            index: {
                title: "",
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
            discount: {
                title: '',
                order: 3,
                excel_cell_header: "C1",
                isVis: true
            },
            totalPriceAfterVat: {
                title: '',
                order: 4,
                excel_cell_header: "D1",
                isVis: true
            },
            branchName: {
                title:'',
                order: 5,
                excel_cell_header: "E1",
                isVis: true
            },
            costCenterName: {
                title: '',
                order: 6,
                excel_cell_header: "F1",
                isVis: true
            },
            isDelivered: {
                title: '',
                order: 7,
                excel_cell_header: "G1",
                isVis: true
            },
            date: {
                title: '',
                order: 8,
                excel_cell_header: "H1",
                isVis: true
            },
            personName: {
                title: '',
                order: 9,
                excel_cell_header: "I1",
                isVis: true
            },
            cash: {
                title: '',
                order: 10,
                excel_cell_header: "J1",
                isVis: true
            },
            bank: {
                title: '',
                order: 11,
                excel_cell_header: "K1",
                isVis: true
            },
            mada: {
                title: '',
                order: 12,
                excel_cell_header: "L1",
                isVis: true
            },
            dept: {
                title: '',
                order: 13,
                excel_cell_header: "M1",
                isVis: true
            },
            deliveryApps: {
                title: '',
                order: 14,
                excel_cell_header: "N1",
                isVis: true
            },
           
            notes: {
                title: "",
                order: 15,
                excel_cell_header: "O1",
                isVis: true
            },
            personMobile: {
                title: "",
                order: 16,
                excel_cell_header: "P1",
                isVis: true
            },
            totalCost: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            
            accountId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            accountType: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            accountTypeId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billAccounts: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billAddress: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billItems: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billMobileNumber: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billPendingCode: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billReceivedDate: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billServices: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billType: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billTypeCode: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billTypeId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billTypeName: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            billsBranchesCostCenters: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            branch: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            branchId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
          
            code: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            costCenter: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            costCenterId: {
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
            createdDate: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            driverName: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            exchangeReason: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            fromAccountId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            person: {
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
            personId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
           
            isPending: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            personVatNumber: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            staffId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
           
            personPhone: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            receiptDocumentBills: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            staff: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            staffName: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            statements: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            tableNumber: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            toAccountId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            /*totalPriceAfterVat: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },*/
            totalPriceBeforeVat: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            totalVat: {
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
            userCreaterName:{
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            totalVatTwo:{  
             title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false},
            paymentMethods:{
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            standardVatTaxableAmout:{
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            notSubjectToVatTaxableAmout:{
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            },
            isOldBillTemplate:{
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis: false
            }
        };

     this.columns = [];

        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 40,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            { prop: "receiptCode", name: this.gT("shared.billCode"), width: 80, },
            {
                prop: "totalPriceAfterVat",
                name: this.gT("shared.total"),
                cellTemplate: this.amount,
                width: 80,

            },
            {
                prop: "discount",
                name: this.gT("shared.discount"),
                cellTemplate: this.amount,
                width: 80,
            },
            {
                prop: "date",
                name: this.gT("shared.offerDate"),
                cellTemplate: this.sbillDateTemplate,
                width: 80,
            },
            {
                prop: "branchName",
                name: this.gT("shared.branch"),
                width: 100,
            },
            

        ];

        if (this.isCostCenterEnabled) {
            this.columns.push.apply(this.columns, [
                {
                    prop: "costCenterName",
                    name: this.gT("shared.costCenter"),
                    width: 100,
                },
            ])

            for (let key in this.headers) {
                if (key === 'costCenterName') {
                    this.headers[key].isVis = true;
                    break;
                }
            }

        }

        (billType == 'SALE' ||
            billType == 'PURCH' ||
            billType == 'RSALE' ||
            billType == 'RPURCH') ? this.columns.push({
                prop: "personName",
                name: this.gT("shared.customerName"),
                width: 120,
            }) : '';


        this.columns.push({
            name: this.gT("shared.isDelivered"),
            prop: "isDelivered",
            width: 100,
            cellTemplate: this.isDeliveredTemplate,
        });

        this.columns.push({
            name: "",
            cellTemplate: this.actionsTemplate,
            resizeable: false,
            canAutoResize: false,
            sortable: false,
            draggable: false
        });

    }
    getAllDataToExport() {

        return this.sbillService
        .getSBills(this.filterData.serachModel, this.filterData.selectedBillType, this.searchQuery, this.filterData.selectedBranch,
            this.filterData.selectedCC, -1, -1
     )
        .toPromise().then(st => st.content.map((val:any, idx) => {
            val.index = idx + 1;
            val.branchName = val.branch ? val.branch.name : '';
            val.costCenterName = val.costCenter ? val.costCenter.nameAr : '';
            val.isDelivered= val.isDelivered?this.gT("shared.yes"):this.gT("shared.no")
            val.cash=this.getPaymentMethod(val.paymentMethods,2)
            val.bank=this.getPaymentMethod(val.paymentMethods,3)
            val.mada=this.getPaymentMethod(val.paymentMethods,5)
            val.dept=this.getPaymentMethod(val.paymentMethods,4)
            val.deliveryApps=this.getPaymentMethod(val.paymentMethods,6)
             return val;
            }
        ));

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
    
    async exportAsXLSX() {
        let filters=0
        let exportedRows = []
        this.loadingIndicator = true;
        exportedRows = await this.getAllDataToExport();
        if (!exportedRows) {
            exportedRows = [];
        }
        let e=[]
       if( this.filterData.selectedBillType){
        e.push({
            index: this.filterData.selectedBillType,
              
            isDelivered:  this.gT("shared.billsType"),
            })
       filters++    
       }
        if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
            e.push({
                index:  this.formatDate(this.filterData.serachModel.from),
                
                personName: this.gT("shared.from"),
            },
            {   index:this.formatDate(this.filterData.serachModel.to),
                
    
                personName: this.gT("shared.to"),
                })
                filters+=2
        }
        if(this.filterData.selectedBranch){
            e.push({  
                index:  this.filterData.branchName,
                personName:this.gT("shared.branch"),
               
             })
      filters++          
        }
         if(this.filterData.selectedCC){
            e.push({  
                index:  this.filterData.costCenterName,
                personName:this.gT("shared.costCenter"),
               
             })
         filters++  
         }
         e.push({},{   index:  this.gT("shared.Index"),
            

         receiptCode: this.gT("shared.billCode"),
       
         discount:  this.gT("shared.discount"),
             
         totalPriceAfterVat: this.gT("shared.total"),
            
         isDelivered: this.gT("shared.isDelivered"),
           
         date:  this.gT("shared.date"),
            
         personName:  this.gT("shared.customerName"),
         branchName:this.gT("shared.branch"),
         costCenterName: this.gT("shared.costCenter"),
        
         cash:this.gT('shared.cash'),
         bank:this.gT('shared.bank'),
         dept:this.gT('shared.debt'),
         mada:this.gT('shared.network'),
         deliveryApps:this.gT('shared.deliveryApps'),
         notes: this.gT("shared.notes"),
         personMobile:this.gT('shared.mobile'),
      })
        /*[{
            index:  this.formatDate(this.filterData.serachModel.from),
            
            costCenterName: this.gT("shared.from"),
        },
        {   index:this.formatDate(this.filterData.serachModel.to),
            

            costCenterName: this.gT("shared.to"),
            },{
        index: this.filterData.selectedBillType,
          
        costCenterName:  this.gT("shared.billsType"),
        },{  
        index:  this.filterData.selectedBranch,
        costCenterName:this.gT("shared.branch"),
       
     },{  
        index:  this.filterData.selectedCC,
        costCenterName:this.gT("shared.costCenter"),
       
     },{},{   index:  this.gT("shared.Index"),
            

        receiptCode: this.gT("shared.billCode"),
      
        discount:  this.gT("shared.discount"),
            
        totalPriceAfterVat: this.gT("shared.total"),
           
        isDelivered: this.gT("shared.isDelivered"),
          
        date:  this.gT("shared.date"),
           
        personName:  this.gT("shared.customerName"),
        branchName:this.gT("shared.branch"),
        costCenterName: this.gT("shared.costCenter"),
     }]*/
     exportedRows=e.concat(exportedRows)
        this.loadingIndicator = false;
        console.log(exportedRows)
        this.excelLabel='Bills Report'
        this.exportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel,filters,15)
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
    

formatDate(date: Date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}
getPaymentMethod(val:{name:string,accountTypeId: number, accountId: number, amount: number}[],accountTypeId){
 let amount =0
    val.forEach(p=>{
        if(p.accountTypeId==accountTypeId)
        amount=p.amount
    })
    return amount

}
}
