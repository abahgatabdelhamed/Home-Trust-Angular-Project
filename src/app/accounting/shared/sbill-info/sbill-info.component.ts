import { saveAs } from 'file-saver';
import { PrinterSettingsService } from "./../../definitions/services/printer-settings.service";
import { ThermalPrintService } from "./../services/thermal-print.service";
import { Component, OnInit, ViewChild, TemplateRef, NgZone, ChangeDetectorRef, OnDestroy, OnChanges, AfterContentInit } from "@angular/core";
import {
    AlertService,
    MessageSeverity,
    DialogType
} from "../../../services/alert.service";
import { Calc } from 'calc-js';
import { SBillService } from "../services/sbill.service";
import { Utilities } from "../../../services/utilities";
import { SBill } from "../models/sbill.model";
import { AppTranslationService } from "../../../services/app-translation.service";
import { AccountType } from "../../definitions/models/account-type.model";
import { Account } from "../../definitions/models/account.model";
import { Branch } from "../../definitions/models/brach.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { BillItem } from "../models/bill-item.model";
import { ItemSearchService } from "../services/item-search.service";
import { ServiceSearchService } from "../services/service-search.service";
import { NavigationStart, Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Subject, Observable, Subscription } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { CostCenterService } from '../../definitions/services/cost-center.service';
import { CostCenterModel } from '../models/cost-center.model';
import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap,
    catchError,
    count
} from "rxjs/operators";
import { BillPost } from "../models/bill-post.model";
import { BillItemPost } from "../models/bill-item-post.model";
import { PrintService } from "../services/print.service";
import { FileService } from "../services/file.service";
import { BillServicePost } from "../models/bill-service-post.model";
import { PeopleSearchService } from "../services/people-search.service";
import { AccountService } from "../../../services/account.service";
import { Permission } from '../../../models/permission.model';
import { e } from "@angular/core/src/render3";
import { SbillPDFService } from '../services/sbill.pdf.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { basename } from 'path';
import { SettingsService } from '../../../services/settings.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../../services/auth.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { ServiceType } from '../../sales/models/service-type.model';
import { ServiceTypeService } from '../../definitions/services/service-type.service';
import { debug } from 'console';
import { ConfigurationService } from '../../../services/configuration.service';
import { NewBillService } from '../services/NewBillprint.service';
import { AccountSearchService } from '../services/account-search.service';

@Component({
    selector: "sbill-info-component",
    templateUrl: "./sbill-info.component.html",
    styleUrls: ["./sbill-info.component.css"]
})
export class SBillInfoComponent implements OnInit, OnDestroy, OnChanges,AfterContentInit {
    normalprinterLabel: string;
    thermalprinterLabel: string;
    isCCPermission: boolean = false
    defaultLabel = '';
    printOptions: any = {
        printTypes: 0,
        setCurrentAsDefault: false
    };
    
    allPaymentMethods: number = 0
    serverPrintOptions: any;
    public isNewSBill = false;
    public isEditMode = true;
    public printerHeader = '';
    public loadIsDone = false;
    public isMultiPaymentMethods:boolean=false
    paymentMethods?: {
        accountTypeId?: number,
        accountId?: number,
        amount?: number,
        name?: string

    }[

    ] = []
    currentBalance: number;
    flag = true;
    public isSaving = false;
    public showValidationErrors = false;
    public isRsale: boolean = false;
    public isSale: boolean = false;
    public isNewRsale: boolean = false;
    public isQuate: boolean = false;
    public isPurch: boolean = false;
    public isNewRpurch: boolean = false;
    public isRpurch: boolean = false;
    public isExchange: boolean = false;
    public formResetToggle = true;
    public accounts = [];
    public iconPath = null;
    public TotalAfterdicountRefund:any=0
    public TotalAfterdicountRefundService:any=0
    public sbill: SBill = new SBill();
    public uniqueId: string = Utilities.uniqueId();
    public sbillEdit: SBill = new SBill();
    public billPost: BillPost;
    public allBillItem: any[] = [];
    public allRsaleItem: any[] = [];
    public allBillService: any[] = [];
    public allRsaleService: any[] = []

    public item3$: Observable<any[]>;
    public items: any[];
    public isBarcodeReader = true;
    public item3input$ = new Subject<string>();
    public item3Loading: boolean = false;

    public service3$: Observable<any[]>;
    public service3input$ = new Subject<string>();
    public service3Loading: boolean = false;

    public people3$: Observable<any[]>;
    public people3input$ = new Subject<string>();
    public people3Loading: boolean = false;

    public account$: Observable<any[]>;
    public accountinput$ = new Subject<string>();
    public accountLoading: boolean = false;
    public accountTo$: Observable<any[]>;
    public accountinputTo$ = new Subject<string>();
    public accountLoadingTo: boolean = false;
    public URL:string=''

    itemNameDetails: { itemName: string, branchName: string, costCenterName: string } = null;


    //all data that is required for sbill
    public allAccountType: AccountType[] = [];
    public allAccount: Account[] = [];
    public allBranches: Branch[] = [];
    public sbillType: string;
    public sbillId: number;
    public accountTypeId: any;
    public rsallbill: any;
    public selectedService: any;
    public selectedItem: any;
    public selectedPeople: any;
    public lockSumbitEvent:boolean=false
    public initialDataParam: any;
    public getByIdDataParam: any;
    public costCenterList: CostCenterModel[] = [];
    public selectedCostCenter: any = null;
    confirm: boolean=true;
    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("wizard")
    wizard: TemplateRef<HTMLElement>;

    @ViewChild('myInput') selectFocus: NgSelectComponent;

    @ViewChild("codeTemplate")
    codeTemplate: TemplateRef<any>;

    @ViewChild("quantityTemplate")
    quantityTemplate: TemplateRef<any>;

    @ViewChild("priceTemplate")
    priceTemplate: TemplateRef<any>;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("f")
    private form;
    subscription: Subscription
    loadingIndicator: boolean;
    isVatEnable: boolean;
    discountLimit: number;
    logoPath: string;
    isSuperAdmin = false;
    tobacco: any;
    tobaccoView: boolean = false
    amount: number=0;
    fromAccount: any;
    toAccount: any;
    constructor(
        private ref: ChangeDetectorRef,
        private itemSearchService: ItemSearchService,
        private serviceSearchService: ServiceSearchService,
        private alertService: AlertService,
        private sbillService: SBillService,
        private translationService: AppTranslationService,
        private printService: PrintService,
        private fileService: FileService,
        private thermalPrintService: ThermalPrintService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private peopleSearchService: PeopleSearchService,
        private printerSettings: PrinterSettingsService,
        private accountService: AccountService,
        private pdfService: SbillPDFService,
        private settingsService: SettingsService,
        private costCenterService: CostCenterService,
        private authService:AuthService,
        private typeService:ServiceTypeService,
        private checkPermissions:CheckPermissionsService, 
        public config:ConfigurationService,
        private printNewBill:NewBillService,
        private accountSearchService:AccountSearchService) { }
        
        ngAfterContentInit(): void {
            console.log(this.isNewSBill)
        }
    ngOnDestroy(): void {
        this.item3input$.next()
        this.item3input$.complete()
        this.isSaving=false
        this.isNewSBill=true
        
        
    }
    ngOnChanges(): void {
        if (this.subscription) this.subscription.unsubscribe()
        this.loadItem3 = null
    //    this.ref.detectChanges()
    }
    
    currentLang: string;
    servicePlaceholder: string;
    clientPlaceholder: string;
    onChangedAccountTypeID($event) {
      console.log(this.sbillEdit.isDept)
        this.sbillEdit.accountTypeId = parseInt(this.accountTypeId)
        if (this.sbillEdit.accountTypeId === 2) {
            this.sbillEdit.accountType = "نقد";
        } else if (this.sbillEdit.accountTypeId === 3) {
            this.sbillEdit.accountType = "بنك";
        } else if (this.sbillEdit.accountTypeId === 4) {
            this.sbillEdit.accountType = "آجل";
        } else if (this.sbillEdit.accountTypeId === 5) {
            this.sbillEdit.accountType = "شبكة";
        }
        if (this.sbillEdit.accountTypeId == 4) {
            this.sbillEdit.isDept = true;
            return;
        }
        if(!this.isMultiPaymentMethods)
        this.sbillEdit.isDept = false;
        console.log(this.allAccountType)
        for (var accountType of this.allAccountType) {
            if (accountType.id === this.sbillEdit.accountTypeId) {
                Object.assign(this.allAccount, accountType.accounts);
                this.allAccount = [...accountType.accounts]
                console.log(this.allAccount, '*****************************')
                for (let account of this.allAccount) {
                    if (account.isDefault) {
                        this.sbillEdit.accountId = account.id;
                        break;
                    }
                }
            }
        }


    }

    onCostCenterChanged() {
        if (this.sbillType != "sale" && this.allBillItem.length > 0) {
            this.alertService.showDialog(
                this.gT("shared.costCenterChangeConfirm"),
                DialogType.confirm,
                () => {
                    this.allBillItem = [];
                     this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
                }
            );

        }
    }

    onChangedBranchID($event) {
        this.getCCByBranch();
        if (this.sbillType != "sale" && this.allBillItem.length > 0) {
            this.alertService.showDialog(
                this.gT("shared.branchChangeConfirm"),
                DialogType.confirm,
                () => {
                    this.allBillItem = [];
                     this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
                }
            );

        }
        // this.sbillService.getSBillInitCode(this.sbillEdit.branchId, this.initialDataParam["BillTypeCode"]).subscribe(
        //     (data: any) => {
        //         this.sbillEdit.receiptCode = this.sbillEdit.receiptCode.split("-")[0] + "-" + data;
        //     },
        //     (error: any) => {
        //         console.error(error);
        //     }
        // );

    }
    getTotal(){
       
        let total
       (this.isNewRpurch||this.isNewRsale)?(!this.rsallbill?0:
       total=Math.round(this.rsallbill.TotalAfterDiscount*100)/100):
       //(this.TotalAfterdicountRefund+this.TotalAfterdicountRefundService)-((this.sbillEdit.discount/(this.allBillItem.length+this.allBillService.length))*(this.allRsaleItem.length+this.allRsaleService.length)):
      total= this.sbillEdit.totalAfterDiscount;
      return total

    }
    roundAmount(){
        console.log('kkk')
      this.amount=  Math.round(this.amount*100)/100
    }
    addpaymentMethod(isAll: boolean) {
        console.log(this.getTotal())
        if(this.sbillEdit.accountTypeId==4)
        this.sbillEdit.accountId=null
        if (isAll)
            this.amount =Math.round ((new Calc(this.getTotal()).minus(this.allPaymentMethods).finish())*100)/100
            console.log(this.getTotal(),'-',this.allPaymentMethods,'=',this.amount)
        if (!this.sbillEdit.paymentMethods)
            this.sbillEdit.paymentMethods = []
        let isExist: boolean = false
        this.sbillEdit.isDept=false
        this.sbillEdit.paymentMethods.forEach(e => {
            console.log(e.accountId ,'==', this.sbillEdit.accountId)
            if (e.accountId == this.sbillEdit.accountId) {
                e.amount =new Calc (e.amount).sum(this.amount).finish()
                isExist = true
            }
            if(e.accountTypeId==4)
            this.sbillEdit.isDept=true

        })
        if (!isExist)
            this.sbillEdit.paymentMethods.push({ accountTypeId: this.sbillEdit.accountTypeId, accountId:this.sbillEdit.accountTypeId==4?1200:this.sbillEdit.accountId , amount: this.amount })
       if(this.sbillEdit.accountTypeId==4)
       this.sbillEdit.isDept=true
        console.log(this.sbillEdit.paymentMethods)
        console.log('1---',this.allPaymentMethods)
        this.allPaymentMethods += this.amount
        this.allPaymentMethods=Math.round( this.allPaymentMethods*100)/100
        console.log('2---',this.allPaymentMethods,this.getTotal())
        this.amount = 0
    }
    exportAsPDFDocumnent() {

        console.log("normalprinterLabel", this.normalprinterLabel);
        var object = this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
        object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
        object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
        object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
        object.totalVatRounded = this.round(object.totalVat, 2);
        object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);
        if (this.printOptions.printTypes == 0) {
            this.pdfService.createPDF(object, this.normalprinterLabel, this.isVatEnable, this.logoPath).subscribe(res => {
                let blob = new Blob([res], { type: 'application/pdf' });
                saveAs(blob, `sbill-docs-${new Date().toLocaleString()}.pdf`);
            });
        }
        else {
            let isPrinted = false;
            var object =this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
            object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
            object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
            object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
            object.totalVatRounded = this.round(object.totalVat, 2);
            object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);

            this.thermalPrintService.createPdfBillInfo(object, this.serverPrintOptions['thermalPrinter'], this.thermalprinterLabel, this.isVatEnable, this.logoPath).subscribe(res => {
                let blob = new Blob([res], { type: 'application/pdf' });
                saveAs(blob, `sbill-docs-${new Date().toLocaleString()}.pdf`);
            });
            isPrinted = true;
            console.log("thermal print", this.serverPrintOptions['thermalPrinter']);

        }
    }



    setType(url: string) {
console.log(url)
        if (url.includes('purch')) {
            console.log('purch!!');
            this.normalprinterLabel = 'فاتورة مشتريات ';
            this.thermalprinterLabel = 'فاتورة مشتريات مبسطة'
            return;
        }

        if (url.includes('rpurch')) {
            console.log('rpurch!!');
            this.normalprinterLabel = 'فاتورةرجيع مشتريات ';
            this.thermalprinterLabel = 'فاتورة رجيع مشتريات مبسطة'
            return;
        }

        if (url.includes('quate')) {
            this.normalprinterLabel = 'عرض أسعار';
            this.thermalprinterLabel = 'عرض أسعار مبسط'
            return;
        }

        if (url.includes('exchange')) {
            this.normalprinterLabel = 'فاتورة صرف أصناف';
            this.thermalprinterLabel = 'فاتورة صرف أصناف مبسطة'
            return;
        }

        if (url.includes('rsale')) {
            if (this.isVatEnable) {
                this.normalprinterLabel = 'مرتجع فاتورة ضريبية';
                this.thermalprinterLabel = 'مرتجع فاتورة ضريبة مبسطة'
            }
            else {
                this.normalprinterLabel = 'مرتجع فاتورة مبيعات'
                this.thermalprinterLabel = 'مرتجع فاتورة مبيعات مبسطة'
            }
            return;
        }

        if (this.isVatEnable) {
            this.normalprinterLabel = 'فاتورة ضريبة'
            this.thermalprinterLabel = 'فاتورة ضريبية مبسطة'
        }
        else {
            this.normalprinterLabel = 'فاتورة مبيعات'
            this.thermalprinterLabel = 'فاتورة مبيعات مبسطة'
        }


    }

    deletepayment(id) {
        let isDept=false
        this.sbillEdit.paymentMethods.forEach((e, i) => {
            if (e.accountId == id) {
                this.sbillEdit.paymentMethods.splice(i, 1);
                this.allPaymentMethods -= e.amount

            }
            if(e.accountId==id && e.accountTypeId==4){
                this.sbillEdit.isDept=false
            }
        })
    }
 
    ngOnInit(): void {
        // this.router.events.subscribe(event =>{
        //     if (event instanceof NavigationStart){
        //        console.log(event.url)

        //    this.setType(event.url);
        //     }
        //  })
    
        this.allPaymentMethods = 0
        this.amount=0
        this.isMultiPaymentMethods=false
        this.isNewSBill=true
        /* this.typeService.getVatTypesByID(1013).subscribe(res =>{
            billItem.vatTypeTwoDefaultValue=res.defaultValue
            console.log('*****************',res)
         })*/
         
        this.isCCPermission = this.checkPermissions.checkGroup(6, 11)
      
        this.setType(this.router.url)
        
        console.log(this.router.url)
        this.ref.detectChanges()
        this.settingsService.getSetting().subscribe(res => {
            this.isVatEnable = res.isVatEnable;
            //   this.discountLimit = res.discountLimit;
            this.logoPath = res.logoPath;

           // this.setType(this.router.url);
        }
        )
        this.isSuperAdmin = this.authService.userInStorage.value.roles.includes('superadmin')
        this.discountLimit = this.authService.userInStorage.value.discountLimitValue
        console.log('************', this.discountLimit, this.authService.userInStorage.value)
        this.currentLang = this.translationService.getCurrentLanguage();
        this.servicePlaceholder = this.gT("Sales.placeholders.items search")
        this.clientPlaceholder = this.gT("Sales.placeholders.clients search")

        if (localStorage.getItem('printerType').toString() == 'normal') {
            this.printOptions.printTypes = 0;
            this.defaultLabel = 'الطابعة الافتراضية: ضريبية'
        }
        else if (localStorage.getItem('printerType').toString() == 'thermal') {
            this.printOptions.printTypes = 1;
            this.defaultLabel = 'الطابعة الافتراضية: مبسطة'
        }
        this.sbillService.getInitial().subscribe(res => {
            console.log(res)
            this.accounts = res["accounts"];
            this.loadIsDone = true;
        });
        this.fileService.getJSON().subscribe(e => console.log(e));

        this.loadService3();
        this.loadPeople3();
        this.loadAccounts3();
        this.loadAccountsTo3();

        this.printerSettings.getPrinterSettings().subscribe(res => {
            this.serverPrintOptions = res;
            localStorage.setItem("serverPrintOptions", JSON.stringify(this.serverPrintOptions));
            this.printerHeader = res.normalPrinter.header;
        });

        this.activatedRoute.params.subscribe(params => {
            this.itemNameDetails = { itemName: '', branchName: '', costCenterName: '' };
            this.currentBalance = 0;
            this.selectedItem = null;
            this.billPost = new BillPost();
            this.sbillEdit = new SBill();
            this.sbillEdit.totalAfterDiscount = 0;
            this.sbillEdit.totalBeforeDiscount = 0;
            this.sbillEdit.isDept = false;
            this.sbillEdit.accountType = "نقد";
            this.sbill = new SBill();

            this.sbillType = params["type"];
            console.log(this.sbillType ,params["type"],this.isNewSBill)
            //check if new SBILL
            if (params["id"] === "new") {
                //make initial data
                this.isNewSBill = true;
                this.allBillItem = [];
                this.allBillService = [];
                // this.resetForm();
                this.sbillEdit.date = new Date();
                this.sbillEdit.isDept = false;
                this.sbillEdit.accountType = "نقد";
                this.sbillEdit.costCenterId = null;
                this.amount=0
                console.log(this.sbillType ,params["type"],this.isNewSBill)
            } else {
                this.isNewSBill = false;
                this.sbillId = +params["id"];
            }
            //get data from server
            if (
                this.sbillType === "sale" ||
                this.sbillType === "rsale" ||
                this.sbillType === "quate" ||
                this.sbillType === "purch" ||
                this.sbillType === "rpurch" ||
                this.sbillType === "n-rpurch" ||
                this.sbillType === "exchange" ||
                this.sbillType === "n-rsale" // new rsale, this will be maintained like new sale
            ) {
                this.getByIdDataParam = { id: this.sbillId };
                switch (this.sbillType) {
                    case "n-rsale": {
                        this.initialDataParam = { BillTypeCode: "SALE" };
                        this.isSale = false;
                        this.isNewRsale = true;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "sale": {
                        this.initialDataParam = { BillTypeCode: "SALE" };
                        this.isSale = true;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "rsale": {
                        this.initialDataParam = { BillTypeCode: "RSALE" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = true;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "quate": {
                        this.initialDataParam = { BillTypeCode: "QUATE" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = true;
                        this.isExchange = false;
                        break;
                    }
                    case "purch": {
                        this.initialDataParam = { BillTypeCode: "PURCH" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = true;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "rpurch": {
                        this.initialDataParam = { BillTypeCode: "RPURCH" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = true;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "n-rpurch": {
                        this.initialDataParam = { BillTypeCode: "PURCH" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = true;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = false;
                        break;
                    }
                    case "exchange": {
                        this.initialDataParam = { BillTypeCode: "EXCHANGE" };
                        this.isSale = false;
                        this.isNewRsale = false;
                        this.isRsale = false;
                        this.isPurch = false;
                        this.isNewRpurch = false;
                        this.isRpurch = false;
                        this.isQuate = false;
                        this.isExchange = true;
                        break;
                    }
                    default: {
                        this.goNotFound();
                        break;
                    }
                }
                if (!this.isNewSBill) {
                    this.getSBillByID();
                }
                else {
                    this.loadData();
                }
            } else {
                this.goNotFound();
            }

            this.loadItem3();
        });
        this.item3$.subscribe(
            (items) => {
                this.items = items;
                this.items.map(i => {
                    if (this.currentLang == '"en"' || this.currentLang == 'en') {
                        i.name = i.nameEn
                    }
                    if (this.currentLang == '"ar"' || this.currentLang == 'ar') {
                        i.name = i.nameAr
                    }
                    else {
                        i.name = i.nameEn
                    }
                })
                if (items.length == 1 && this.isBarcodeReader && !items[0].isService) {
                    this.selectedItem = items[0]
                    this.SearchSelected()
                }
            }
        )
        this.ref.detectChanges()
    }

    async getSBillByID() {
      
       let m= await this.sbillService.getSBillInit(this.initialDataParam).toPromise()
       console.log(m.accountTypes)
       this.allAccountType=m.accountTypes
        this.sbillService
            .getSBillById(this.getByIdDataParam)
            .subscribe((sbill: SBill) => {
                if(this.isNewRsale||this.isNewRpurch)
                sbill.paymentMethods=[]
                Object.assign(this.sbillEdit, sbill);
                Object.assign(this.sbill, sbill);
                console.log(this.sbillEdit.isOldBillTemplate)
                this.selectedPeople = {
                    nameAr: this.sbillEdit.personName
                };
               
               let index=this.accounts.findIndex(val=>val.id==this.sbillEdit.fromAccountId)
               this.fromAccount=this.accounts[index]?this.accounts[index].name:null
               let index1=this.accounts.findIndex(val=>val.id==this.sbillEdit.toAccountId)
               this.toAccount=this.accounts[index1]?this.accounts[index1].name:null
                console.log(this.account$)
                //[{name:this.allAccountType.findIndex[this.sbillEdit.fromAccountId].name}]
                if(this.sbillEdit.paymentMethods.length>0)
                this.isMultiPaymentMethods=true
                //this.accountTypeId = this.sbillEdit.accountTypeId;
               
                for (let accountType of this.allAccountType) {
                    if (accountType.isDefault) {
                        this.sbillEdit.accountTypeId = accountType.id;
                        this.accountTypeId = accountType.id;
                        Object.assign(this.allAccount, accountType.accounts);
                        this.allAccount=[]
                        this.allAccount=[... accountType.accounts]
                        for (let account of this.allAccount) {
                            if (account.isDefault) {
                                this.sbillEdit.accountId = account.id;
                                break;
                            }
                        }
                        break;
                    }
                }
                this.allPaymentMethods=0
                this.sbillEdit.paymentMethods.forEach(p=>{
                    this.allPaymentMethods+=p.amount
                })
                
                this.sbillEdit.date = new Date(sbill.date);
                if (this.sbillEdit.accountTypeId === 4) {
                    this.sbillEdit.isDept = true
                }
                if (this.sbillEdit.accountTypeId === 2) {
                    this.sbillEdit.accountType = "نقد";
                } else if (this.sbillEdit.accountTypeId === 3) {
                    this.sbillEdit.accountType = "بنك";
                } else if (this.sbillEdit.accountTypeId === 4) {
                    this.sbillEdit.accountType = "آجل";
                } else if (this.sbillEdit.accountTypeId === 5) {
                    this.sbillEdit.accountType = "شبكة";
                }


                if (sbill.billItems) {
                    this.allBillItem = sbill.billItems;
                    for (let billItem of this.allBillItem) {
                        if(!this.sbillEdit.isOldBillTemplate){
                           
                            if(billItem.actualVatTwo>0)
                            billItem.vatTypeTwoDefaultValue = +(billItem.actualVatTwo / (billItem.quantity * billItem.price -
                                billItem.discount))
                            else
                            billItem.vatTypeTwoDefaultValue=0


                            billItem.vatTypeDefaultValue =
                                this.round(billItem.actualVat / ((billItem.quantity * billItem.price -
                                    billItem.discount) + billItem.actualVatTwo), 2);
                                    !billItem.vatTypeDefaultValue?billItem.vatTypeDefaultValue=0:''
                                    console.log(billItem.vatTypeDefaultValue ,billItem.vatTypeTwoDefaultValue)
                           
                                    this.calTotalForNewBills(billItem)
    
    
                               
                        }else{
                            if (billItem.actualVatTwo > 0) {
                                this.tobaccoView = true
                                billItem.vatTypeTwoDefaultValue = +(billItem.actualVatTwo / (billItem.quantity * billItem.price -
                                    billItem.discount))
    
    
                                billItem.vatTypeDefaultValue =
                                    this.round(billItem.actualVat / ((billItem.quantity * billItem.price -
                                        billItem.discount) + billItem.actualVatTwo), 2);
                                billItem.priceWithVat =
                                    billItem.actualVat + billItem.price + billItem.actualVatTwo;
                                billItem.totalPrice = +
                                    (billItem.quantity * billItem.price -
                                        billItem.discount) + billItem.actualVat + billItem.actualVatTwo;
                                console.log(billItem.vatTypeDefaultValue, billItem.totalPrice, '99999999999999')
    
    
                            } else {
                                billItem.vatTypeTwoDefaultValue = 0
    
    
                                billItem.vatTypeDefaultValue =
                                    this.round(billItem.actualVat / (billItem.price * billItem.quantity - billItem.discount), 2);
                                billItem.priceWithVat =
                                    billItem.actualVat + billItem.price;
                                billItem.totalPrice =
                                    billItem.quantity * billItem.price -
                                    billItem.discount + billItem.actualVat;
                            }
    
                        }
                      
                    }
                }

                if (sbill.billServices) {
                    this.allBillService = sbill.billServices;
                    console.log(this.allBillService)
                    for (let billService of this.allBillService) {
                        billService.vatTypeDefaultValue =
                            this.round(billService.actualVat / (billService.price * billService.quantity - billService.discount), 2);
                        billService.priceWithVat =
                            billService.actualVat + billService.price;
                        billService.totalPrice =
                            billService.quantity * billService.price -
                            billService.discount + billService.actualVat;
                    }
                }
                 this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
                this.loadData();
            });
    }

    resetSearch() {

        this.selectedItem = null;
        this.item3$ = new Observable<any[]>()
        this.item3input$ = new Subject<string>()
        this.flag = false;
        setTimeout(() => {
            this.loadItem3();
            this.item3$.subscribe(
                (items) => {
                    this.items = items;
                    this.items.map(i => {
                        if (this.currentLang == '"en"' || this.currentLang == 'en') {
                            i.name = i.nameEn
                        }
                        if (this.currentLang == '"ar"' || this.currentLang == 'ar') {
                            i.name = i.nameAr
                        }
                        else {
                            i.name = i.nameEn
                        }
                    })
                    if (items.length == 1 && this.isBarcodeReader && !items[0].isService) {
                        this.selectedItem = items[0]

                        this.SearchSelected()
                    }
                }
            )
            this.flag = true;
            setTimeout(() => {
                this.selectFocus.filterInput.nativeElement.focus();
            })

        })
    }

    SearchSelected() {
        console.log('8888888888888')
        //Get All item Details
        if (this.selectedItem)
            if (this.selectedItem.isService) {
                this.serviceSearchSelected(this.selectedItem.serviceType, this.selectedItem.branchCCName)
            }
            else {
                let searchId = this.selectedItem.item.id;
                this.itemSearchService.getSearchItemByIdEndPoint(searchId, this.selectedItem.branchId,
                    this.selectedItem.costCenterId).subscribe(
                        (data: any) => {
                            this.selectedItem = null;
                            this.itemSearchSelected(data.item, data.branchCCName)
                        }
                    )
            }
        this.resetSearch();
    }

    itemSearchSelected(item, branchCCName) {
        console.log(item);
        console.log(item);
        let index = this.allBillItem.findIndex(val =>(val.id==item.id &&val.itemUnits && val.itemUnits.length==1))
       
        if(index>=0){
            this.allBillItem[index].quantity++
             this.onQuantityChanged(this.allBillItem[index])
        }else{

        if (item) {
            if (item.imagePath == null || item.imagePath == "")
                this.iconPath = null;
            else
                this.iconPath = item.imagePath;
            item.itemUnitId = null
            item.quantity = 1;
            item.discount = 0;
            item.notes = "";
            item.branchCCName = branchCCName;
           // item.id = 0;
            console.log('--------1----------')
            for (let itemUnit of item.itemUnits) {
                console.log('--------2----------')
                if ((itemUnit.isDefaultSale && (this.sbillType == "sale" ||
                    this.sbillType == "rsale") || this.sbillType == "quate" || this.sbillType == "exchange") ||
                    (itemUnit.isDefaultPurc && this.sbillType == "purch")) {
                    item.price = ((this.sbillType == "purch") && itemUnit.cost) ? itemUnit.cost : itemUnit.price;
                    item.itemUnitId = itemUnit.id;
                    item.itemUnitBranchId = itemUnit.itemUnitBranchId;
                    this.currentBalance = itemUnit.currentBalance;
                    console.log(this.isVatEnable)
                    if (!this.isVatEnable)
                        item.vatTypeDefaultValue = 0
                    console.log('--------3----------')
                    if(!this.sbillEdit.isOldBillTemplate){
                        if (this.checkPermissions.checkGroup(7, 5) && (item.vatTypeTwoId || (item.actualVatTwo > 0 && !!item.actualVatTwo)))
                        this.tobaccoView = true
                               this.calTotalForNewBills(item)
                    }else{

                        if (this.checkPermissions.checkGroup(7, 5) && (item.vatTypeTwoId || (item.actualVatTwo > 0 && !!item.actualVatTwo))) {
                            this.tobaccoView = true
                            item.actualVatTwo = ((item.price * item.quantity - item.discount) * item.vatTypeTwoDefaultValue)
                            item.actualVat = (((item.price * item.quantity - item.discount)) + item.actualVatTwo) * item.vatTypeDefaultValue;
                            console.log(item.vatTypeDefaultValue)
                            item.priceWithVat = item.actualVat + item.price;
                            item.totalPrice =
                                (item.quantity * item.price -
                                    item.discount) + (item.actualVatTwo) + item.actualVat;
                        }
                        else {
                            item.actualVat = (item.price * item.quantity - item.discount) * item.vatTypeDefaultValue;
                            //
                            item.priceWithVat = item.actualVat + item.price;
                            item.totalPrice =
                                item.quantity * item.price -
                                item.discount + item.actualVat;;
                            console.log('--------4----------')
                        }
                    }
                    console.log('--------5----------')

                    break;
                }
            }
            if (!item.itemUnitId && item.itemUnits.length > 0) {
                item.itemUnitId = item.itemUnits[0].id
                this.changeItemUnit(item, item.itemUnits[0].id)

            }

            this.allBillItem.push(item);
             this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
        }
    }
        console.log('isSaving ====>',this.isSaving)
    }

    parseNameDetails(billItem) {
        this.itemNameDetails = { itemName: '', branchName: '', costCenterName: '' };
        if (billItem.branchCCName) {
            let splitList = billItem.branchCCName.split('-');
            this.itemNameDetails.itemName = splitList.length > 0 ? splitList[0] : '';
            this.itemNameDetails.branchName = splitList.length > 1 ? splitList[1] : '';
            this.itemNameDetails.costCenterName = splitList.length > 2 ? splitList[2] : '';
        }
    }

    parseServiceNameDetails(billService) {
        this.itemNameDetails = { itemName: '', branchName: '', costCenterName: '' };
        if (billService.branchCCName) {
            let splitList = billService.branchCCName.split('-');
            this.itemNameDetails.itemName = splitList.length > 1 ? splitList[1] : '';
            this.itemNameDetails.branchName = splitList.length > 2 ? splitList[2] : '';
        }
    }

    changeItemUnit(billItem, selectedItemUnitId) {
    
        for (let itemUnit of billItem.itemUnits) {
            if (itemUnit.id == selectedItemUnitId) {
                billItem.price = ((this.sbillType == "purch") && itemUnit.cost) ? itemUnit.cost : itemUnit.price;
                billItem.itemUnitBranchId = itemUnit.itemUnitBranchId;
                this.currentBalance = itemUnit.currentBalance
                this.onPriceChanged(billItem);
                if( !this.sbillEdit.isOldBillTemplate)
                 this.calTotalForNewBills(billItem);
                 else
                 this.calTotal()
            }
        }
    
        
    }

    openWizard(e) {
        if (e.target["name"] === "printer") {
            const a = <HTMLElement>document.querySelector(".wizard");
            a.style.display = "flex";
        } else {
            const a = <HTMLElement>document.querySelector(".thermal-wizard");
            a.style.display = "flex";
        }
    }

    closeWizard(e) {
        const a = <HTMLElement>document.querySelector(".wizard");
        a.style.display = "none";
    }

    //edit the object for normal printing
    // print(e) {
    //     console.log(this.sbillEdit);
    //     console.log(this.sbill);
    //     if(this.printOptions.setCurrentAsDefault) {
    //         if (this.printOptions.printTypes == 0) {
    //             localStorage.setItem('printerType', 'normal');
    //         }
    //         else {
    //             localStorage.setItem('printerType', 'thermal');
    //         }
    //     }
    //     else {
    //         if (this.printOptions.printTypes == 0) {
    //             console.log("normal print");
    //             //pass data
    //             this.printService.printBillInfo(this.mapSBillToPrint(), undefined);
    //         }
    //         else {
    //             //pass data
    //             this.thermalPrintService.printBillInfo(this.mapSBillToPrint(), undefined);
    //             console.log("thermal print");
    //         }
    //     }
    //     if (localStorage.getItem('printerType').toString()  == 'normal') {
    //         console.log("normal print");
    //         this.printService.printBillInfo(this.sbill, undefined);
    //     } else if (localStorage.getItem('printerType').toString() == 'thermal'){
    //         this.thermalPrintService.printBillInfo(this.sbill, undefined);
    //         console.log("thermal print");
    //     }
    //     // this.printService.printBillInfo(this.sbill, this.printOptions);
    // }





    print(e) {
        let isPrinted = false;
        this.setType(this.router.url);
        if (this.printOptions.setCurrentAsDefault) {
            if (this.printOptions.printTypes == 0) {
                localStorage.setItem('printerType', 'normal');
            }
            else {
                localStorage.setItem('printerType', 'thermal');
            }
        }
        else {
            if (this.printOptions.printTypes == 0) {
                console.log("normal print1");
                //pass data
                var object =this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()

                object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
                object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
                object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
                object.totalVatRounded = this.round(object.totalVat, 2);
                object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);
               this.sbillEdit.isOldBillTemplate? this.printService.printBillInfo(object, {
                    ...this.serverPrintOptions['normalPrinter'],
                    'shopName': this.serverPrintOptions['thermalPrinter']['shopName'], 'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber'],}
                    , this.normalprinterLabel, this.isVatEnable, this.logoPath)
                    :
                    this.printNewBill.printBillInfo(object, {
                        ...this.serverPrintOptions['normalPrinter'],
                        'shopName': this.serverPrintOptions['thermalPrinter']['shopName'], 'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber']
                    }
                        , this.normalprinterLabel, this.isVatEnable, this.logoPath)

                isPrinted = true;
            }
            else {
                //pass data
                var object = this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
                object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
                object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
                object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
                object.totalVatRounded = this.round(object.totalVat, 2);
                object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);

                this.thermalPrintService.printBillInfo(object, this.serverPrintOptions['thermalPrinter'], this.thermalprinterLabel, this.isVatEnable, this.logoPath,this.sbillEdit.isOldBillTemplate);
                isPrinted = true;
                console.log("thermal print", this.serverPrintOptions['thermalPrinter']);
            }
        }
        if (localStorage.getItem('printerType').toString() == 'normal' && !isPrinted) {
            console.log("normal print2");
            var object = this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
            object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
            object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
            object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
            object.totalVatRounded = this.round(object.totalVat, 2);
            object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);
           this.sbillEdit.isOldBillTemplate?
            this.printService.printBillInfo(object,
                {
                    ...this.serverPrintOptions['normalPrinter'],
                    'shopName': this.serverPrintOptions['thermalPrinter']['shopName'],
                    'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber']
                }
                , this.normalprinterLabel, this.isVatEnable, this.logoPath)
                :
                this.printNewBill.printBillInfo(object,
                    {
                        ...this.serverPrintOptions['normalPrinter'],
                        'shopName': this.serverPrintOptions['thermalPrinter']['shopName'],
                        'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber']
                    }
                    , this.normalprinterLabel, this.isVatEnable, this.logoPath)
        } else if (localStorage.getItem('printerType').toString() == 'thermal' && !isPrinted) {
            var object = this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
            object.totalAfterDiscountRounded = this.round(object.totalAfterDiscount, 2);
            object.totalBeforeDiscountRounded = this.round(object.totalBeforeDiscount, 2);
            object.itemTotalWithoutVatRounded = this.round(object.itemTotalWithoutVat, 2);
            object.totalVatRounded = this.round(object.totalVat, 2);
            object.serviceTotalWithVatRounded = this.round(object.serviceTotalWithVat, 2);
            this.thermalPrintService.printBillInfo(object, this.serverPrintOptions['thermalPrinter'], this.thermalprinterLabel, this.isVatEnable, this.logoPath,this.sbillEdit.isOldBillTemplate);
            console.log("thermal print");
        }

        // this.printService.printBillInfo(this.sbill, this.printOptions);
    }

    //items logic
    onPriceChanged(billItem) {
        if(!this.sbillEdit.isOldBillTemplate)
        this.calTotalForNewBills(billItem)
        else{
            billItem.price = +billItem.price;
            if (this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {
                this.tobaccoView = true
                billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeTwoDefaultValue)
                  let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish()
                billItem.actualVat = (((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo) * billItem.vatTypeDefaultValue;
                //
                billItem.priceWithVat = billItem.actualVat + billItem.price;
                billItem.totalPrice =
                    (billItem.quantity * billItem.price -
                        billItem.discount) + (billItem.actualVatTwo) + billItem.actualVat;
    
            } else {
    
                billItem.actualVat = (billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeDefaultValue;
    
                billItem.priceWithVat = billItem.actualVat + +billItem.price;
                billItem.totalPrice =
                    billItem.quantity * billItem.price -
                    billItem.discount + billItem.actualVat;
            }
    
              this.calTotal();
        }
        
    }


    onActualVatChanged(billItem) {
        if( !this.sbillEdit.isOldBillTemplate)
        this.calTotalForNewBills(billItem);
        else{
            billItem.vatTypeDefaultValue = this.round(billItem.actualVat / (billItem.price * billItem.quantity - billItem.discount), 2);
            billItem.priceWithVat = billItem.actualVat + billItem.price;
            billItem.totalPrice =
                billItem.quantity * billItem.price -
                billItem.discount + billItem.actualVat;
             this.calTotal()
        }
       
    }

    onDiscountItemChanged(billItem) {
        if (this.discountLimit && billItem.discount > 0) {
            this.sbillEdit.discount = 0;
        }
        if (this.discountLimit && billItem.discount > billItem.price * billItem.quantity * this.discountLimit / 100) {
            alert("لا يمكن الخصم أكثر من " + this.discountLimit + " بالمئة");
            billItem.discount = billItem.price * billItem.quantity * this.discountLimit / 100;
        }
           billItem.discount=Math.round(billItem.discount*100)/100
        if(!this.sbillEdit.isOldBillTemplate){
            this.calTotalForNewBills(billItem);
        }else{

            if (this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {

                billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeTwoDefaultValue)
                  let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish()
                billItem.actualVat = (((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo) * billItem.vatTypeDefaultValue;
                //
                billItem.priceWithVat = billItem.actualVat + billItem.price;
                billItem.totalPrice =
                    (billItem.quantity * billItem.price -
                        billItem.discount) + (billItem.actualVatTwo) + billItem.actualVat;
            } else {
                billItem.actualVat = (billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeDefaultValue;
                billItem.totalPrice =
                    billItem.quantity * billItem.price -
                    billItem.discount + billItem.actualVat;
            }
    
              this.calTotal()
        }
    }

    onDiscountServiceChanged(billService) {
        if (this.discountLimit && billService.discount > 0) {
            this.sbillEdit.discount = 0;
        }
        if (this.discountLimit && billService.discount > billService.price * billService.quantity * this.discountLimit / 100) {
            alert("لا يمكن الخصم أكثر من " + this.discountLimit + " بالمئة");
            billService.discount = billService.price * billService.quantity * this.discountLimit / 100;
        }
        billService.discount=Math.round(billService.discount*100)/100
        if(!this.sbillEdit.isOldBillTemplate)
        this.calTotalForNewBills(billService);
        else{
            billService.actualVat = (billService.price * billService.quantity - billService.discount) * billService.vatTypeDefaultValue;
            billService.totalPrice =
                billService.price * billService.quantity -
                billService.discount + billService.actualVat;
              this.calTotal()
        }
    }

   
    onChangeDiscount(v) {
        this.sbillEdit.discount=Math.round(v*100)/100
        v=Math.round(v*100)/100
        this.confirm=false
        if (this.discountLimit && this.sbillEdit.discount > this.sbillEdit.totalBeforeDiscount * this.discountLimit / 100) {
            alert("لا يمكن الخصم أكثر من " + this.discountLimit + " بالمئة");
            this.sbillEdit.discount = this.sbillEdit.totalBeforeDiscount * this.discountLimit / 100;
            v=this.sbillEdit.totalBeforeDiscount * this.discountLimit / 100;
        }
        if(!this.sbillEdit.isOldBillTemplate){
            this.alertService.showDialog(
               'هل انت متأكد من خصم المبلغ   ' + v +' من اجمالي الفاتورة ؟' ,
                  DialogType.confirm,
                  () => {this.calTotalForNewBills(null,v),this.confirm=true},
                 ()=> this.confirm=true
              );

        }
       
       
        else{
            this.sbillEdit.totalAfterDiscount =
            this.sbillEdit.totalBeforeDiscount - this.sbillEdit.discount;
            this.calTotal()
        }
        
    }

    onQuantityChanged(billItem) {
        if(!this.sbillEdit.isOldBillTemplate)
        this.calTotalForNewBills(billItem);
        else{
            if (this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {

                billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeTwoDefaultValue)
                  let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish()
                billItem.actualVat = (((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo) * billItem.vatTypeDefaultValue;
                //
                billItem.priceWithVat = billItem.actualVat + billItem.price;
                billItem.totalPrice =
                    (billItem.quantity * billItem.price -
                        billItem.discount) + (billItem.actualVatTwo) + billItem.actualVat;
                console.log('c', billItem.actualVatTwo)
            }
            else {
                billItem.actualVat = (billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeDefaultValue;
                billItem.totalPrice =
                    billItem.quantity * billItem.price -
                    billItem.discount + billItem.actualVat;
            }
    
    
    
             this.calTotal()
        }
        
    }


    onServiceQuantityChanged(billService) {
        if(!this.sbillEdit.isOldBillTemplate)
        this.calTotalForNewBills(billService);
        else{

            billService.actualVat = (billService.price * billService.quantity - billService.discount) * billService.vatTypeDefaultValue;
            billService.totalPrice =
                billService.quantity * billService.price -
                billService.discount + billService.actualVat;
              this.calTotal()
        }
    }

    ///people logic
    peopleSearchSelected(person) {

        if (person) {
            console.log(person)
            this.selectedPeople = person;
            this.sbillEdit.personId = person.id;
            this.sbillEdit.personName = person.nameAr;
            this.sbillEdit.personCode = person.code;
            this.sbillEdit.personVatNumber = person.vatNumber;
            this.sbillEdit.personMobile = person.mobile;
            this.sbillEdit.billAddress = (person.city ? person.city : "") + " " + (person.neighborhood ? person.neighborhood : "");
        } else {
            this.selectedPeople = null;
            this.sbillEdit.personId = null;
            this.sbillEdit.personName = null;
            this.sbillEdit.personCode = null;
            this.sbillEdit.personVatNumber = null;
            this.sbillEdit.personMobile = null;
            this.sbillEdit.billAddress = null;

        }
    }
    toAccountSearchSelected(e){
        console.log(e)
       if(e)
       this.sbillEdit.toAccountId=e.id
    }
    fromAccountSearchSelected(e){
        console.log(e)
        if(e)
        this.sbillEdit.fromAccountId=e.id
    }
    ////services logic

    serviceSearchSelected(service, branchCCName) {
        let index = this.allBillService.findIndex(val =>(val.id==service.id &&val.itemUnits&& val.itemUnits.length==1))
        if(index>=0){
            this.allBillService[index].quantity++
             this.onQuantityChanged(this.allBillService[index])
        }else{

        if(!this.sbillEdit.isOldBillTemplate){
            
            service.serviceTypeId = service.id;
            service.branchCCName = branchCCName;
          //  service.id = 0;
            service.quantity = 1;
            service.discount = 0;
            service.price = service.defaultCost;
           
            this.allBillService.push(service);
        this.calTotalForNewBills(service)
        }
        else{
            if (service) {
                if (!this.isVatEnable)
                    service.vatTypeDefaultValue = 0
                service.serviceTypeId = service.id;
                service.branchCCName = branchCCName;
               // service.id = 0;
                service.quantity = 1;
                service.discount = 0;
                service.price = service.defaultCost;
                service.actualVat = (service.price * service.quantity - service.discount) * service.vatTypeDefaultValue;
                service.priceWithVat = service.actualVat + service.price;
                service.totalPrice = service.price * service.quantity -
                    service.discount + service.actualVat;
                this.allBillService.push(service);
                 this.calTotal()
        }
      
        }
    }
    }
    onPriceServiceChanged(billService) {
        if(!this.sbillEdit.isOldBillTemplate){
            this.calTotalForNewBills(billService);
        }else{

            billService.actualVat =
            (billService.price * billService.quantity - billService.discount) * billService.vatTypeDefaultValue;
        billService.priceWithVat = billService.actualVat + billService.price;
        billService.totalPrice = billService.price * billService.quantity -
            billService.discount + billService.actualVat;
          this.calTotal()
        }
    }

    onVatTypeDefaultValueServiceChanged(billService) {
        if(!this.sbillEdit.isOldBillTemplate){
            this.calTotalForNewBills(billService);
        }else{
        billService.actualVat =
            billService.vatTypeDefaultValue * (billService.price - billService.discount);
        billService.priceWithVat = billService.actualVat + billService.price;
        billService.totalPrice =
            billService.price -
            billService.discount + billService.actualVat;
        this.calTotal()
        }
    }

    onActualVatServiceChanged(billService) {
        if(!this.sbillEdit.isOldBillTemplate){
            this.calTotalForNewBills(billService);
        }else{
        billService.vatTypeDefaultValue =
            this.round(billService.actualVat / (billService.price - billService.discount), 2);
        billService.priceWithVat = billService.actualVat + billService.price;
        billService.totalPrice =
            billService.price -
            billService.discount + billService.actualVat;
            this.calTotal()
        }
    }



    onQuantityServiceChanged(billService) {
        if(!this.sbillEdit.isOldBillTemplate){
            this.calTotalForNewBills(billService);
        }else{
        billService.totalPrice =
            billService.price -
            billService.discount + billService.actualVat;
         this.calTotal()
        }
    }

    calTotalForNewBills(billItem,DiscountBill?) {

        if(DiscountBill){
            //  console.log(this.sbillEdit.discount,tempDiscount)
           this.calcDiscount(DiscountBill)
          }else{
            let tempDiscount=0
            /* console.log('newwwwwwwwwwwwwwww',billItem)
             this.sbillEdit.discount=0
     
             */if(billItem){
                 
             let Iprice=String(billItem.price) ,
             discount=String(billItem.discount),
             quantity=String(billItem.quantity),
             actualVatTwo=billItem.actualTwoVat,
             actualVat=billItem.actualVat
                 let price=0,p
                 if (!billItem.isService &&  this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {
                    let p1,p2,p3;
                    p1=new Calc(+Iprice).multiply(+quantity).finish()
                    p2=new Calc (p1).minus(+discount).finish()
                    p3=new Calc (p2) .multiply(billItem.vatTypeTwoDefaultValue).finish()
                    let temp = p3/+quantity
                    billItem.actualVatTwo=temp>=25?p3:new Calc(25).multiply(+quantity).finish()
                 
                    // p= Math.round(new Calc (+Iprice).multiply(+quantity).minus(+discount).finish()*100)/100
                     price =  Math.round(new Calc  (p2).sum(billItem.actualVatTwo).finish()*100)/100
                     billItem.actualVat = Math.round((new Calc (price).multiply(billItem.vatTypeDefaultValue).finish())*100)/100;
                     //
                     billItem.priceWithVat =new Calc (billItem.actualVat).sum(price).finish();
                     billItem.totalPrice =new Calc(price).sum(billItem.actualVat).finish();
                     //billItem.discount+=(discount*billItem.vatTypeTwoDefaultValue)
                    console.log('************',billItem.discount)
                 }
                 else {
                     billItem.actualVatTwo=0
                     p = new Calc (new Calc(+Iprice).multiply(+quantity).finish()).minus(+discount).finish()
                     price= Math.round(p*100)/100
                     billItem.actualVat =Math.round(( new Calc (price).multiply(billItem.vatTypeDefaultValue).finish())*100)/100;
                     billItem.totalPrice = new Calc(price).sum(billItem.actualVat).finish();
                 }
             console.log('actual =====>',billItem.actualVat)
                
             }
             for(let billItem of this.allBillItem){
                if(billItem.vatTypeTwoDefaultValue>0)
                this.tobaccoView=true
                console.log('tobaccooooo')
                
             }
             let sum = 0, sumBeforeVat=0,sumBeforeVatTow=0,vat=0
             for (let billItem of this.allBillItem) {
                 let Iprice=String(billItem.price) ,
                 discount=String(billItem.discount),
                 quantity=String(billItem.quantity),
                 actualVatTwo=billItem.actualTwoVat,
                 actualVat=billItem.actualVat
                 if (billItem.vatTypeDefaultValue==0) {
                     debugger
                     sum = new Calc (sum).sum(Math.round(new Calc(new Calc (+Iprice ).multiply(+quantity).minus(+discount).finish()).sum(billItem.actualVatTwo).finish()*100)/100).finish();
                     
                 }else if(billItem.vatTypeDefaultValue>0){
                     
                     vat==0?vat=billItem.vatTypeDefaultValue:''
                     sumBeforeVat=new Calc (sumBeforeVat).sum(Math.round(new Calc(new Calc (+Iprice ).multiply(+quantity).minus(+discount).finish()).sum(billItem.actualVatTwo).finish()*100)/100).finish();
                 }
                 if(billItem.vatTypeTwoDefaultValue){
                    this.tobaccoView=true
                    sumBeforeVatTow= new Calc (sumBeforeVatTow).sum(new Calc (+Iprice).multiply(+quantity).minus(+discount).finish()).finish();
               
                 }
                  tempDiscount=new Calc (tempDiscount).sum(+discount).finish()
                 
             }
     
             for (let billService of this.allBillService) {
                 let Iprice=String(billService.price) ,
                 discount=String(billService.discount),
                 quantity=String(billService.quantity),
                 actualVatTwo=String(billService.actualTwoVat),
                 actualVat=String(billService.actualVat)
                 if (billService.vatTypeDefaultValue==0) {
                     sum =  new Calc (sum).sum(Math.round(new Calc(+Iprice).multiply(+quantity).minus(+discount).finish()*100)/100).finish();
                     
                 }else if(billService.vatTypeDefaultValue>0){
                     sumBeforeVat= new Calc (sumBeforeVat).sum(Math.round(new Calc(+Iprice).multiply(+quantity).minus(+discount).finish()*100)/100).finish();
                 }
                 tempDiscount=new Calc (tempDiscount).sum(+discount).finish()
             }
         
        
             this.sbillEdit.StandardVatTaxableAmount = Math.round(sumBeforeVat* 100) / 100;
             this.sbillEdit.NotSubjectToVatTaxableAmount = Math.round(sum* 100) / 100;
             this.sbillEdit.totalVat=Math.round((new Calc (sumBeforeVat).multiply(vat).finish())*100)/100
             console.log('totalssss', this.sbillEdit.StandardVatTaxableAmount,
             this.sbillEdit.NotSubjectToVatTaxableAmount ,this.sbillEdit.totalVat)
             this.sbillEdit.totalBeforeDiscount =  Math.round((new Calc (this.sbillEdit.StandardVatTaxableAmount).sum(this.sbillEdit.NotSubjectToVatTaxableAmount).finish())*100)/100;
             this.sbillEdit.totalAfterDiscount = Math.round((new Calc (this.sbillEdit.totalBeforeDiscount).sum(this.sbillEdit.totalVat).finish())*100)/100
     
            
             
          }
             
    }
    calTotal() {
        let sum = 0;
        for (let billItem of this.allBillItem) {
            if (billItem.totalPrice) {
                sum = sum + billItem.totalPrice;
            }
        }

        for (let billService of this.allBillService) {
            if (billService.totalPrice) {
                sum = sum + billService.totalPrice;
            }
        }
        this.sbillEdit.totalBeforeDiscount = Math.round(sum* 100) / 100;
        this.sbillEdit.totalAfterDiscount =
            this.sbillEdit.totalBeforeDiscount - this.sbillEdit.discount;
     console.log( this.sbillEdit.totalAfterDiscount)       
    }

    ///We have to fix the permissions
    get canManageSBill() {
        /* let  perm = this.accountService.userHasPermission(
            Permission.manageSBillPermission
        );
        return perm*/
        return true;
    }

    canChangeBillDate() {
        return this.accountService.userHasPermission(Permission.manageChangeBillDatePermission)
    }

    canDiscount() {
        return this.accountService.userHasPermission(Permission.canDiscountPermission)
    }

    canDiscountWithoutLimit() {
        return this.accountService.userHasPermission(Permission.canDiscountWithoutLimitPermission);
    }

    get isThereAnyItemDiscount() {
        if (this.allBillItem) {
            for (let billItem of this.allBillItem) {
                if (billItem.discount) {
                    return true;
                }
            }
        }

        if (this.allBillService) {
            for (let billService of this.allBillService) {
                if (billService.discount) {
                    return true;
                }
            }
        }

        return false;
    }

    deleteItem(row: BillItem) {
        //this.parseNameDetails(row);

        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.nameAr + '"?',
            DialogType.confirm,
            () => this.deleteItemHelper(row)
        );
    }

    deleteItemHelper(row: BillItem) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allBillItem = this.allBillItem.filter(item => item !== row);
         this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
        this.tobaccoView = false
        this.allBillItem.forEach(e => {
            if (e.vatTypeTwoId)
                this.tobaccoView = true
        })
    }

    refundService(row, refundForm) {
        if (row.refundQuantity + refundForm.value.refundServiceQuantity > row.quantity) {
            row.refundQuantity = row.quantity;
        }
        else {
            row.refundQuantity += refundForm.value.refundServiceQuantity
        }

        //adding item to allrefund items
        let isExist = false;
        for (let i = 0; i < this.allRsaleService.length; i++) {
            if (this.allRsaleService[i].id === row['id']) {
                this.allRsaleService[i].quantity += refundForm.value.refundServiceQuantity
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            let serviceToRefund = { ...row }
            serviceToRefund.originalQuantity = serviceToRefund.quantity;
            serviceToRefund.quantity = refundForm.value.refundServiceQuantity;
            serviceToRefund.originalDiscount = serviceToRefund.discount;
            serviceToRefund.discount = 0;
            this.allRsaleService.push(serviceToRefund);
        }
        //recalculate for sale bill
        this.TotalAfterdicountRefundService=0
        this.allRsaleService.forEach(b =>
            this.TotalAfterdicountRefundService+=(b.price*b.quantity))
            
        refundForm.controls['refundServiceQuantity'].setValue(0);
        this.onServiceQuantityChanged(row)
        this.mapSBillToPost()
        this.gettotalRefund()
    }

    refundItem(row, refundForm) {
        if (row.refundQuantity + refundForm.value.refundQuantity > row.quantity) {
            row.refundQuantity = row.quantity;
        }
        else {
            row.refundQuantity += refundForm.value.refundQuantity
        }

        //adding item to allrefund items
        let isExist = false;
        for (let i = 0; i < this.allRsaleItem.length; i++) {
            if (this.allRsaleItem[i].id === row['id']) {
                this.allRsaleItem[i].quantity += refundForm.value.refundQuantity
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            let itemToRefund = { ...row }
            itemToRefund.originalQuantity = itemToRefund.quantity;
            itemToRefund.quantity = refundForm.value.refundQuantity;
            itemToRefund.originalDiscount = itemToRefund.discount;
            itemToRefund.discount = 0;
            this.allRsaleItem.push(itemToRefund);
        }
        console.log(this.allRsaleItem)
        this.TotalAfterdicountRefund=0
        this.allRsaleItem.forEach(b =>
            this.TotalAfterdicountRefund+=(b.price*b.quantity))
        //recalculate for sale bill
        refundForm.controls['refundQuantity'].setValue(0);
        this.onQuantityChanged(row)
        this.mapSBillToPost()
        this.gettotalRefund()
    }
    gettotalRefund(){
        let rBillPost = { ...this.billPost }
       
        rBillPost.BillItems = []
        rBillPost.BillServices = []

        rBillPost.Date = new Date()

        //request new code for resale
      
        //calcualte all rsall bill items 
        for (let billItem of this.allRsaleItem) {
            billItem.discount = billItem.quantity / billItem.originalQuantity * billItem.originalDiscount;
            billItem.discount = Math.round((billItem.discount + Number.EPSILON) * 100) / 100;
            if (this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {

                billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * (billItem.vatTypeTwoDefaultValue))
                  let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish() 
                billItem.actualVat = (((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo) * billItem.vatTypeDefaultValue
                billItem.totalPrice = ((billItem.quantity * billItem.price -
                    billItem.discount) + billItem.actualVatTwo) + billItem.actualVat
            } else {
                billItem.actualVatTwo = 0
                billItem.actualVat = (billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeDefaultValue;
                billItem.totalPrice =
                    billItem.quantity * billItem.price -
                    billItem.discount + billItem.actualVat;
            }



        }

        for (let billService of this.allRsaleService) {
            billService.discount = billService.quantity / billService.originalQuantity * billService.originalDiscount;
            billService.discount = Math.round((billService.discount + Number.EPSILON) * 100) / 100;

            billService.actualVat = (billService.price * billService.quantity - billService.discount) * billService.vatTypeDefaultValue;
            billService.totalPrice =
                billService.quantity * billService.price -
                billService.discount + billService.actualVat;

        }

        let sum = 0;
        for (let billItem of this.allRsaleItem) {
            if (billItem.totalPrice) {
                sum = sum + billItem.totalPrice;
            }
        }

        for (let billService of this.allRsaleService) {
            if (billService.totalPrice) {
                sum = sum + billService.totalPrice;
            }
        }

        rBillPost.TotalBeforeDiscount = sum;
        //ReCalculate Discount
        rBillPost.Discount = (rBillPost.TotalBeforeDiscount / this.billPost.TotalBeforeDiscount) * this.billPost.Discount;
        rBillPost.Discount = Math.round((rBillPost.Discount + Number.EPSILON) * 100) / 100;
        rBillPost.TotalAfterDiscount =
            rBillPost.TotalBeforeDiscount - rBillPost.Discount;
        for (let item of this.allRsaleItem) {
            let billItemPost: BillItemPost = new BillItemPost();
            billItemPost.ActualVat = item.actualVat;
            billItemPost.actualVatTwo = item.actualVatTwo
            billItemPost.Price = item.price;
            billItemPost.serialNo = item.serialNo;
            billItemPost.Quantity = item.quantity;
            billItemPost.discount = item.discount;
            billItemPost.ItemUnitId = item.itemUnitId;
            billItemPost.itemUnitBranchId = item.itemUnitBranchId;
            billItemPost.Notes = item.notes;
            billItemPost.totalPrice = item.totalPrice;
            billItemPost.RefundBillItemId = item.id;
            rBillPost.BillItems.push(billItemPost);

        }

        for (let service of this.allRsaleService) {
            let billServicePost: BillServicePost = new BillServicePost();
            billServicePost.ActualVat = service.actualVat;
            billServicePost.Price = service.price;
            billServicePost.Quantity = service.quantity;
            billServicePost.discount = service.discount;
            billServicePost.BranchId = service.branchId;
            billServicePost.ServiceTypeId = service.serviceTypeId
            billServicePost.RefundBillServiceId = service.id;
            rBillPost.BillServices.push(billServicePost);

        }
        console.error(rBillPost);
        this.rsallbill=rBillPost
        console.log( this.rsallbill,'=',rBillPost)
       
    }
    deleteService(row) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.nameAr + '"?',
            DialogType.confirm,
            () => this.deleteServiceHelper(row)
        );
    }

    deleteServiceHelper(row) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allBillService = this.allBillService.filter(
            service => service !== row
        );
         this.sbillEdit.isOldBillTemplate? this.calTotal():this.calTotalForNewBills(null);
    }

    //end of modal staff

    gT = (key: string) => this.translationService.getTranslation(key);

    //load all initial data
    loadData() {
        this.sbillService.getSBillInit(this.initialDataParam).subscribe(
            (data: any) => {
                this.isSaving=false
                console.log('saving ====>',this.isSaving)
               // 
               if (this.router.url.includes("new")) {
                this.isNewSBill=true
                this.ref.detectChanges()
            }
                //make initial data
               
                console.log(this.isNewSBill)
                this.mapInitialData(data);
            },
            (error: any) => {
                console.error(error);
            }
        );

        console.log(this.sbillEdit);
        console.log(this.sbill);
        console.log('url is', this.router.url);
    }

    //add allpeople
    mapInitialData(initailData) {

        if (this.isNewSBill) {
            this.sbillEdit.receiptCode = initailData.receiptCode;
        }
        this.sbillEdit.staffId = initailData.staffId;
        this.sbillEdit.staffName = initailData.staffName;
        Object.assign(this.allAccountType, initailData.accountTypes);
        this.allAccountType = [...this.allAccountType];



        Object.assign(this.allBranches, initailData.branches);
        this.allBranches = [...this.allBranches];


        if (this.sbillEdit.accountTypeId && !this.isNewSBill) {
            for (let accountType of this.allAccountType) {
                if (accountType.id === this.sbillEdit.accountTypeId) {
                    Object.assign(this.allAccount, accountType.accounts);
                    console.log(accountType)
                    break;
                }
            }
        }


        if (!this.sbillEdit.accountTypeId && this.isNewSBill ||((this.isNewRpurch||this.isNewRsale))) {
            for (let accountType of this.allAccountType) {
                if (accountType.isDefault) {
                    this.sbillEdit.accountTypeId = accountType.id;
                    this.accountTypeId = accountType.id;
                    Object.assign(this.allAccount, accountType.accounts);
                    this.allAccount=[]
                    this.allAccount=[... accountType.accounts]
                    for (let account of this.allAccount) {
                        if (account.isDefault) {
                            this.sbillEdit.accountId = account.id;
                            break;
                        }
                    }
                    break;
                }
            }
            console.log( this.sbillEdit.accountId,this.allAccount)
          //  this.ref.detectChanges()
        }

        if (!this.sbillEdit.branchId && this.isNewSBill) {
            for (let branch of this.allBranches) {
                if (branch.isDefault) {
                    this.sbillEdit.branchId = branch.id;
                    break;
                }
            }
        }
        this.getCCByBranch();

    }

    getCCByBranch() {
        this.costCenterList = [];
        if (this.sbillEdit.branchId)
            this.costCenterService.getAllByBranch(this.sbillEdit.branchId).subscribe(
                (data: CostCenterModel[]) => {
                    this.costCenterList = [...data];

                },
                (error: any) => console.error(error)
            )
    }

    // mapSBillToPrint(){
    //     let sbillPrint:any = {}
    //     sbillPrint.receiptCode = this.sbillEdit.receiptCode;
    //     sbillPrint.personCode = this.sbillEdit.personId;
    //     sbillPrint.date = this.sbillEdit.date;
    //     sbillPrint.personName = this.sbillEdit.personName;
    //     sbillPrint.isDept = this.sbillEdit.isDept;
    //     sbillPrint.staffId = this.sbillEdit.staffId;
    //     sbillPrint.staffName = this.sbillEdit.staffName;
    //     sbillPrint.vatNumber = this.sbillEdit.personVatNumber;
    //     sbillPrint.totalBeforeDiscount = this.sbillEdit.totalBeforeDiscount;
    //     sbillPrint.totalAfterDiscount = this.sbillEdit.totalAfterDiscount;
    //     sbillPrint.membershipId = this.sbillEdit.personId;
    //     sbillPrint.billItems = this.allBillItem;
    //     for(var accountType of this.allAccountType){
    //         if(accountType.id === this.sbillEdit.accountTypeId){
    //             sbillPrint.paymentMethod = accountType.name;
    //         }
    //     }
    //     sbillPrint.itemTotalWithVat = 0;
    //     sbillPrint.itemTotalWithoutVat = 0;
    //     sbillPrint.itemTotalActualVat = 0;

    //     for(var item of this.allBillItem){
    //         sbillPrint.itemTotalWithVat += item.priceWithVat;
    //         sbillPrint.itemTotalWithoutVat += item.priceWithoutVat;
    //         sbillPrint.itemTotalActualVat += item.actualVat;

    //     }

    //     sbillPrint.serviceTotalWithVat = 0;
    //     sbillPrint.serviceTotalWithoutVat = 0;
    //     sbillPrint.serviceTotalActualVat = 0;


    //     for(var service of this.allBillService){
    //         sbillPrint.serviceTotalWithVat += service.priceWithVat;
    //         sbillPrint.serviceTotalWithoutVat += service.priceWithoutVat;
    //         sbillPrint.serviceTotalActualVat += service.actualVat;


    //     }

    //     sbillPrint.billService = this.allBillService;
    //     return sbillPrint
    // }

    mapSBillToPrint() {
        // this.allBillItem.map(val => val.id=0)
        // this.allBillService.map(val =>val.id=0)
        let sbillPrint: any = {}

        sbillPrint.receiptCode = this.sbillEdit.receiptCode;
        sbillPrint.personCode = this.sbillEdit.personId;
        sbillPrint.date = this.sbillEdit.date;
        sbillPrint.personName = this.sbillEdit.personName;
        sbillPrint.personMobile = this.sbillEdit.personMobile;
        sbillPrint.isDebt = this.sbillEdit.isDept;
        sbillPrint.accountType = this.sbillEdit.accountType;
        sbillPrint.staffId = this.sbillEdit.staffId;
        sbillPrint.staffName = this.sbillEdit.staffName;
        sbillPrint.vatNumber = this.sbillEdit.personVatNumber;
        sbillPrint.address = this.sbillEdit.billAddress;
        sbillPrint.totalBeforeDiscount = this.sbillEdit.totalBeforeDiscount;
        sbillPrint.discount = this.sbillEdit.discount;
        sbillPrint.totalAfterDiscount = this.sbillEdit.totalAfterDiscount;
        sbillPrint.membershipId = this.sbillEdit.personId;
        sbillPrint.userCreaterName = this.sbillEdit.userCreaterName
        sbillPrint.billItems = this.allBillItem;
        if (this.sbillEdit.notes == null || this.sbillEdit.notes == undefined || this.sbillEdit.notes == "undefined")
            this.sbillEdit.notes = "";
        sbillPrint.notes = this.sbillEdit.notes;
        sbillPrint.exchangeReason = this.sbillEdit.exchangeReason;
        sbillPrint.code = this.sbillEdit.code;
        sbillPrint.fromAccountId = this.sbillEdit.fromAccountId;
        if (sbillPrint.fromAccountId != null)
            sbillPrint.fromAccountName = this.accounts.find(e => e.id == sbillPrint.fromAccountId).name;
        sbillPrint.toAccountId = this.sbillEdit.toAccountId;
        if (sbillPrint.toAccountId != null)
            sbillPrint.toAccountName = this.accounts.find(e => e.id == sbillPrint.toAccountId).name;
        sbillPrint.code = this.sbillEdit.code;
        console.log("note is", sbillPrint.notes)
        for (var accountType of this.allAccountType) {
            if (accountType.id === this.sbillEdit.accountTypeId) {
                sbillPrint.paymentMethod = accountType.name;
            }
        }
        sbillPrint.itemTotalWithVat = 0;
        sbillPrint.itemTotalWithoutVat = 0;
        sbillPrint.itemTotalActualVat = 0;

        sbillPrint.totalVat = 0;
        sbillPrint.itemsDiscount = 0;
        for (var item of sbillPrint.billItems) {
            //sbillPrint.itemTotalWithVat += item.priceWithVat * item.quantity - item.discount;
            for (var itemUnit of item.itemUnits) {
                if (itemUnit.id == item.itemUnitId) {
                    item.itemUnitName = itemUnit.name;
                    break;
                }
            }

            sbillPrint.itemTotalWithVat += item.totalPrice;
            sbillPrint.itemTotalWithoutVat += item.price * item.quantity;
            sbillPrint.itemTotalActualVat += item.actualVat * item.quantity;
            sbillPrint.totalVat += item.actualVat;
            //item.totalPrice = item.priceWithVat * item.quantity - item.discount;
            sbillPrint.itemsDiscount += +item.discount;

        }

        sbillPrint.serviceTotalWithVat = sbillPrint.itemTotalWithVat;
        sbillPrint.serviceTotalWithoutVat = sbillPrint.itemTotalWithoutVat;
        sbillPrint.serviceTotalActualVat = sbillPrint.itemTotalActualVat;
        for (var service of this.allBillService) {
            sbillPrint.serviceTotalWithVat += service.totalPrice;
            sbillPrint.serviceTotalWithoutVat += service.price;
            sbillPrint.serviceTotalActualVat += service.actualVat;
            sbillPrint.totalVat += service.actualVat;
            //service.totalPrice = service.priceWithVat * service.quantity - service.discount;
            sbillPrint.itemsDiscount += +service.discount;
        }

        sbillPrint.billService = this.allBillService;
        sbillPrint.billService.forEach(e => {
            //e.quantity = 1;
            e.itemUnitName = '';
        });
        sbillPrint.paymentMethods=this.sbillEdit.paymentMethods
        return sbillPrint
    }
    mapNewSBillToPrint() {
        // this.allBillItem.map(val => val.id=0)
        // this.allBillService.map(val =>val.id=0)
        let sbillPrint: any = {}

        sbillPrint.receiptCode = this.sbillEdit.receiptCode;
        sbillPrint.personCode = this.sbillEdit.personId;
        sbillPrint.date = this.sbillEdit.date;
        sbillPrint.personName = this.sbillEdit.personName;
        sbillPrint.personMobile = this.sbillEdit.personMobile;
        sbillPrint.isDebt = this.sbillEdit.isDept;
        sbillPrint.accountType = this.sbillEdit.accountType;
        sbillPrint.staffId = this.sbillEdit.staffId;
        sbillPrint.staffName = this.sbillEdit.staffName;
        sbillPrint.vatNumber = this.sbillEdit.personVatNumber;
        sbillPrint.address = this.sbillEdit.billAddress;
        sbillPrint.totalBeforeDiscount = this.sbillEdit.totalBeforeDiscount;
        sbillPrint.discount = this.sbillEdit.discount;
        sbillPrint.totalAfterDiscount = this.sbillEdit.totalAfterDiscount;
        sbillPrint.membershipId = this.sbillEdit.personId;
        sbillPrint.userCreaterName = this.sbillEdit.userCreaterName
        sbillPrint.billItems = this.allBillItem;
        sbillPrint.billService = this.allBillService;
        if (this.sbillEdit.notes == null || this.sbillEdit.notes == undefined || this.sbillEdit.notes == "undefined")
            this.sbillEdit.notes = "";
        sbillPrint.notes = this.sbillEdit.notes;
        sbillPrint.exchangeReason = this.sbillEdit.exchangeReason;
        sbillPrint.code = this.sbillEdit.code;
        sbillPrint.fromAccountId = this.sbillEdit.fromAccountId;
        if (sbillPrint.fromAccountId != null)
            sbillPrint.fromAccountName = this.accounts.find(e => e.id == sbillPrint.fromAccountId).name;
        sbillPrint.toAccountId = this.sbillEdit.toAccountId;
        if (sbillPrint.toAccountId != null)
            sbillPrint.toAccountName = this.accounts.find(e => e.id == sbillPrint.toAccountId).name;
        sbillPrint.code = this.sbillEdit.code;
        console.log("note is", sbillPrint.notes)
        for (var accountType of this.allAccountType) {
            if (accountType.id === this.sbillEdit.accountTypeId) {
                sbillPrint.paymentMethod = accountType.name;
            }
        }
        sbillPrint.itemTotalWithVat = 0;
        sbillPrint.itemTotalWithoutVat = 0;
        sbillPrint.itemTotalActualVat = 0;

        sbillPrint.totalVat = 0;
        sbillPrint.itemsDiscount = 0;
        for (var item of sbillPrint.billItems) {
            //sbillPrint.itemTotalWithVat += item.priceWithVat * item.quantity - item.discount;
            for (var itemUnit of item.itemUnits) {
                if (itemUnit.id == item.itemUnitId) {
                    item.itemUnitName = itemUnit.name;
                    break;
                }
            }

            // sbillPrint.itemTotalWithVat += item.totalPrice;
            // sbillPrint.itemTotalWithoutVat += item.price * item.quantity;
            // sbillPrint.itemTotalActualVat += item.actualVat * item.quantity;
            // sbillPrint.totalVat += item.actualVat;
            // //item.totalPrice = item.priceWithVat * item.quantity - item.discount;
            // sbillPrint.itemsDiscount += +item.discount;

        }

        // sbillPrint.serviceTotalWithVat = sbillPrint.itemTotalWithVat;
        // sbillPrint.serviceTotalWithoutVat = sbillPrint.itemTotalWithoutVat;
        // sbillPrint.serviceTotalActualVat = sbillPrint.itemTotalActualVat;
        // for (var service of this.allBillService) {
        //     sbillPrint.serviceTotalWithVat += service.totalPrice;
        //     sbillPrint.serviceTotalWithoutVat += service.price;
        //     sbillPrint.serviceTotalActualVat += service.actualVat;
        //     sbillPrint.totalVat += service.actualVat;
        //     //service.totalPrice = service.priceWithVat * service.quantity - service.discount;
        //     sbillPrint.itemsDiscount += +service.discount;
        // }

        // sbillPrint.billService = this.allBillService;
        sbillPrint.billService.forEach(e => {
            //e.quantity = 1;
            e.itemUnitName = '';
        });
        sbillPrint.paymentMethods=this.sbillEdit.paymentMethods
        sbillPrint.StandardVatTaxableAmount=this.sbillEdit.StandardVatTaxableAmount
        sbillPrint.NotSubjectToVatTaxableAmount=this.sbillEdit.NotSubjectToVatTaxableAmount
        sbillPrint.totalAfterDiscount=this.sbillEdit.totalAfterDiscount
        sbillPrint.totalBeforeDiscount=this.sbillEdit.totalBeforeDiscount
        sbillPrint.totalPriceAfterVat=this.sbillEdit.totalAfterDiscount
        sbillPrint.totalPriceBeforeVat=this.sbillEdit.totalBeforeDiscount
        sbillPrint.totalVat=this.sbillEdit.totalVat

        return sbillPrint
    }

    mapSBillToPost() 
    {  
        // this.allBillItem.map(val => val.id=0)
        // this.allBillService.map(val =>val.id=0)
        //our sbill is stored
        this.billPost.UserCreaterName = this.sbillEdit.userCreaterName
        this.billPost.Id = this.sbillEdit.id;
        this.billPost.BillTypeCode = this.initialDataParam["BillTypeCode"];
        this.billPost.ReceiptCode = this.sbillEdit.receiptCode;
        this.billPost.AccountId = this.sbillEdit.accountId;
        this.billPost.AccountTypeId = this.sbillEdit.accountTypeId;
        this.billPost.Date = this.sbillEdit.date;
        this.billPost.TotalBeforeDiscount = this.sbillEdit.totalBeforeDiscount;
        this.billPost.TotalAfterDiscount = this.sbillEdit.totalAfterDiscount;
        this.billPost.Discount = this.sbillEdit.discount;
        if (this.sbillType != "sale") {
            this.billPost.BranchId = this.sbillEdit.branchId;
            this.billPost.costCenterId = this.sbillEdit.costCenterId;
        }
        this.billPost.Notes = this.sbillEdit.notes;
        this.billPost.ExchangeReason = this.sbillEdit.exchangeReason;
        this.billPost.Code = this.sbillEdit.code;
        this.billPost.isDept = this.sbillEdit.isDept;
        this.billPost.PersonId = this.sbillEdit.personId;
        this.billPost.PersonName = this.sbillEdit.personName
        this.billPost.StaffId = this.sbillEdit.staffId;
        this.billPost.FromAccountId = this.sbillEdit.fromAccountId;
        this.billPost.ToAccountId = this.sbillEdit.toAccountId;
        this.billPost.paymentMethods = this.sbillEdit.paymentMethods
        this.billPost.BillItems = [];
        for (let item of this.allBillItem) {
            let billItemPost: BillItemPost = new BillItemPost();
            billItemPost.Id = item.id;
            billItemPost.ActualVat = item.actualVat;
            billItemPost.actualVatTwo = item.actualVatTwo
            billItemPost.Price = item.price;
            billItemPost.serialNo = item.serialNo;
            billItemPost.Quantity = item.quantity;
            billItemPost.discount = item.discount;
            billItemPost.ItemUnitId = item.itemUnitId;
            billItemPost.Notes = item.notes;
            billItemPost.totalPrice = item.totalPrice;
            billItemPost.itemUnitBranchId = item.itemUnitBranchId;
            this.billPost.BillItems.push(billItemPost);
        }
        this.billPost.BillServices = [];
        for (let service of this.allBillService) {
            let billServicePost: BillServicePost = new BillServicePost();
            billServicePost.Id = service.id;
            billServicePost.BranchId = service.branchId
            billServicePost.ServiceTypeId = service.serviceTypeId;
            billServicePost.ActualVat = service.actualVat;

            billServicePost.Price = service.price;
            billServicePost.Quantity = service.quantity;
            billServicePost.discount = service.discount;
            this.billPost.BillServices.push(billServicePost);
        }
        if(!this.sbillEdit.isOldBillTemplate){
            this.billPost.StandardVatTaxableAmount=this.sbillEdit.StandardVatTaxableAmount
            this.billPost.NotSubjectToVatTaxableAmount=this.sbillEdit.NotSubjectToVatTaxableAmount
            this.billPost.totalVat=this.sbillEdit.totalVat
        }
        this.billPost.IsOldBillTemplate=this.sbillEdit.isOldBillTemplate
    }

    
    //used by html template
    private save() {
        if(this.lockSumbitEvent)
        return
        this.lockSumbitEvent=true
      //  console.log('printer', this.mapSBillToPrint());
      if(!this.isMultiPaymentMethods &&!(this.isNewRsale || this.isNewRpurch)){
        this.sbillEdit.paymentMethods=[]
        this.sbillEdit.paymentMethods.push({accountId:this.sbillEdit.accountTypeId==4?1200:this.sbillEdit.accountId,accountTypeId:this.sbillEdit.accountTypeId,amount:this.sbillEdit.totalAfterDiscount})
        this.sbillEdit.accountId=null
        this.sbillEdit.accountTypeId=null
    } console.log(this.sbillEdit.paymentMethods)
      
        console.log(this.sbillEdit.paymentMethods)
        this.setType(this.router.url);
       
        this.mapSBillToPost();
        this.isSaving = true;
        
        //    this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        if (this.isNewSBill) {

            this.sbillService
                .newSBill(this.billPost)
                .subscribe(
                    sbill => this.saveSuccessHelper(sbill, true),
                    error => this.saveFailedHelper(error)
                );


        } else {
            this.sbillService
                .updateSBill(this.billPost)
                .subscribe(
                    sbill => {
                        this.saveSuccessHelper(sbill, true)
                    },
                    error => this.saveFailedHelper(error)
                );
        }
    }

    private saveSuccessHelper(sbill, prinateble) {
        this.amount=0
        const printer = localStorage.getItem('printerType') == 'normal' ? 'normalPrinter' : 'thermalPrinter';
        // setTimeout(() => {
        //     const objtoPRint = this.mapSBillToPrint()
        //     if(printer == 'normalPrinter') {
        //         this.printService.printBillInfo( objtoPRint, this.serverPrintOptions['normalPrinter'], this.normalprinterLabel);
        //     } else {
        //         this.thermalPrintService.printBillInfo(objtoPRint, this.serverPrintOptions['thermalPrinter'], this.normalprinterLabel);
        //     }
        // }, 0);
        let i = 0;
        
        while (i != 1 && prinateble) {
            console.log('******************========', this.mapSBillToPrint(),sbill)
            const objtoPRint = this.sbillEdit.isOldBillTemplate?this.mapSBillToPrint():this.mapNewSBillToPrint()
            console.log(objtoPRint, 'sssss', sbill)
            objtoPRint.userCreaterName = sbill.userCreaterName
            objtoPRint.totalAfterDiscountRounded = this.round(objtoPRint.totalAfterDiscount, 2);
            objtoPRint.totalBeforeDiscountRounded = this.round(objtoPRint.totalBeforeDiscount, 2);
            objtoPRint.itemTotalWithoutVatRounded = this.round(objtoPRint.itemTotalWithoutVat, 2);
            objtoPRint.totalVatRounded = this.round(objtoPRint.totalVat, 2);
            objtoPRint.serviceTotalWithVatRounded = this.round(objtoPRint.serviceTotalWithVat, 2);
            objtoPRint.paymentMethods=sbill.paymentMethods
            if (printer == 'normalPrinter') {
               this.sbillEdit.isOldBillTemplate? this.printService.printBillInfo(objtoPRint, {
                    ...this.serverPrintOptions['normalPrinter'],
                    'shopName': this.serverPrintOptions['thermalPrinter']['shopName'], 'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber']
                }, this.normalprinterLabel, this.isVatEnable, this.logoPath)
                :
            this.printNewBill.printBillInfo(objtoPRint, {
                    ...this.serverPrintOptions['normalPrinter'],
                    'shopName': this.serverPrintOptions['thermalPrinter']['shopName'], 'vatNumber': this.serverPrintOptions['thermalPrinter']['vatNumber']
                }, this.normalprinterLabel, this.isVatEnable, this.logoPath)
            } else {
                this.thermalPrintService.printBillInfo(objtoPRint, this.serverPrintOptions['thermalPrinter'], this.thermalprinterLabel, this.isVatEnable, this.logoPath,this.sbillEdit.isOldBillTemplate);
            }
            i = 1;
        }
        this.lockSumbitEvent=false
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        // if (this.isNewSBill)
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.CreationSucceded") +
        //         " " +
        //         sbill.receiptCode +
        //         " " +
        //         this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );
        // else
        //     this.alertService.showMessage(
        //         this.gT("shared.OperationSucceded"),
        //         this.gT("shared.ChangesSaved") +
        //         " " +
        //         sbill.receiptCode +
        //         " " +
        //         this.gT("shared.Successfully"),
        //         MessageSeverity.success
        //     );

        if (!this.isNewRsale) {

            this.resetForm();
            this.ngOnInit();
        }


        // this.goHome();
    }

    saveWithoutPrince() {
        if(this.lockSumbitEvent)
        return
        this.lockSumbitEvent=true
        console.log('printer', this.mapSBillToPrint());
        if(!this.isMultiPaymentMethods  &&!(this.isNewRsale || this.isNewRpurch)){
            this.sbillEdit.paymentMethods=[]
            this.sbillEdit.paymentMethods.push({accountId:this.sbillEdit.accountTypeId==4?1200:this.sbillEdit.accountId,accountTypeId:this.sbillEdit.accountTypeId,amount:this.sbillEdit.totalAfterDiscount})
            this.sbillEdit.accountId=null
            this.sbillEdit.accountTypeId=null
        }
       
       
        this.mapSBillToPost();
        this.isSaving = true;
        this.alertService.startLoadingMessage(this.gT("shared.Saving"));
        if (this.isNewSBill) {
            console.log('data is going to server', this.billPost);
            this.sbillService
                .newSBill(this.billPost)
                .subscribe(
                    sbill => this.saveSuccessHelper(sbill, false),
                    error => this.saveFailedHelper(error)
                );


        } else {
            if (!(this.isNewRsale || this.isNewRpurch)) {
                this.sbillService
                    .updateSBill(this.billPost)
                    .subscribe(
                        sbill => {
                            this.saveSuccessHelper(sbill, false)
                        },
                        error => this.saveFailedHelper(error)
                    );
            }
            else {
                //New Recharge Bill
                let billTypeCode = {}
                if (this.isNewRsale) {
                    billTypeCode = { BillTypeCode: "RSALE" };
                } else {
                    if (this.isNewRpurch) {
                        billTypeCode = { BillTypeCode: "RPURCH" };
                    }
                }
                this.sbillService.getSBillInit(billTypeCode).subscribe(
                    (data: any) => {
                        let newRSaleReciptCode = data.receiptCode
                        
                        //generate Recharge Bill automaticlly from original bill
                        if (this.isNewRsale || this.isNewRpurch) {
                            this.generateNewRSallBill(newRSaleReciptCode, billTypeCode)
                        }

                    }
                )
                // this.sbillService.getSBillInitCode(this.sbillEdit.branchId, this.isNewRpurch?'RPURCH':'RSALE').subscribe(
                //     (data: any) => {
                //         console.log(data)
                //        // let newRSaleReciptCode = data
                //        let code=this.isNewRpurch?'RP-':'RS-'
                //         let newRSaleReciptCode=code+ data;
                //         //generate Recharge Bill automaticlly from original bill
                //         if (this.isNewRsale || this.isNewRpurch) {
                //             this.generateNewRSallBill(newRSaleReciptCode, billTypeCode)
                //         }

                //     }
                // )
            }

        }
    }


    generateNewRSallBill(receiptCode, billTypeCode) {
        
        let rBillPost = { ...this.billPost }
        delete rBillPost.Id
        rBillPost.BillTypeCode = billTypeCode.BillTypeCode;
        if (this.isNewRpurch) {
            rBillPost.BranchId = this.billPost.BranchId;
            rBillPost.costCenterId = this.billPost.costCenterId;
            rBillPost.Notes = `هذه فاتورة رجيع متعلقة بفاتورة مشتريات تحمل الرمز ${this.billPost.ReceiptCode}`;
        } else {
            rBillPost.BranchId = null;
            rBillPost.costCenterId = null;
            rBillPost.Notes = `هذه فاتورة رجيع متعلقة بفاتورة مبيعات تحمل الرمز ${this.billPost.ReceiptCode}`;
        }
        rBillPost.BillItems = []
        rBillPost.BillServices = []

        rBillPost.Date = new Date()

        //request new code for resale
        rBillPost.ReceiptCode = receiptCode
        //calcualte all rsall bill items 
        if(this.sbillEdit.isOldBillTemplate){
            
        for (let billItem of this.allRsaleItem) {
            billItem.discount = billItem.quantity / billItem.originalQuantity * billItem.originalDiscount;
            billItem.discount = Math.round((billItem.discount + Number.EPSILON) * 100) / 100;
           
           
            if (this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {

                billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeTwoDefaultValue)
                  let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish()
                billItem.actualVat = (((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo) * billItem.vatTypeDefaultValue
                billItem.totalPrice = ((billItem.quantity * billItem.price -
                    billItem.discount) + billItem.actualVatTwo) + billItem.actualVat
            } else {
                billItem.actualVatTwo = 0
                billItem.actualVat = (billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeDefaultValue;
                billItem.totalPrice =
                    billItem.quantity * billItem.price -
                    billItem.discount + billItem.actualVat;
            }



        }

        for (let billService of this.allRsaleService) {
            billService.discount = billService.quantity / billService.originalQuantity * billService.originalDiscount;
            billService.discount = Math.round((billService.discount + Number.EPSILON) * 100) / 100;

            billService.actualVat = (billService.price * billService.quantity - billService.discount) * billService.vatTypeDefaultValue;
            billService.totalPrice =
                billService.quantity * billService.price -
                billService.discount + billService.actualVat;

        }

        let sum = 0;
        for (let billItem of this.allRsaleItem) {
            if (billItem.totalPrice) {
                sum = sum + billItem.totalPrice;
            }
        }

        for (let billService of this.allRsaleService) {
            if (billService.totalPrice) {
                sum = sum + billService.totalPrice;
            }
        }

        rBillPost.TotalBeforeDiscount = Math.round(sum* 100) / 100
        //ReCalculate Discount
        rBillPost.Discount = (rBillPost.TotalBeforeDiscount / this.billPost.TotalBeforeDiscount) * this.billPost.Discount;
        rBillPost.Discount = Math.round((rBillPost.Discount + Number.EPSILON) * 100) / 100;
        rBillPost.TotalAfterDiscount =
            rBillPost.TotalBeforeDiscount - rBillPost.Discount;
        }else{
            for (let billItem of this.allRsaleItem) {
                billItem.discount = billItem.quantity / billItem.originalQuantity * billItem.originalDiscount;
                billItem.discount = Math.round((billItem.discount + Number.EPSILON) * 100) / 100;
               
               
                if (!billItem.isService &&  this.checkPermissions.checkGroup(7, 5) && (billItem.vatTypeTwoId || (billItem.actualVatTwo > 0 && !!billItem.actualVatTwo))) {

                    billItem.actualVatTwo = ((billItem.price * billItem.quantity - billItem.discount) * billItem.vatTypeTwoDefaultValue)
                      let temp = billItem.actualVatTwo/billItem.quantity
                    billItem.actualVatTwo=temp>=25?billItem.actualVatTwo:new Calc(25).multiply(billItem.quantity).finish()
                  
                    billItem.actualVat = Math.round((Math.round(((((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo)*100) /100)* billItem.vatTypeDefaultValue)*100)/100;
                    //
                    billItem.priceWithVat = billItem.actualVat + (billItem.price+billItem.actualVatTwo);
                    billItem.totalPrice =
                    (Math.round((((billItem.price * billItem.quantity - billItem.discount)) + billItem.actualVatTwo)*100) /100) + billItem.actualVat;
                    console.log('c', billItem.actualVatTwo)
                }
                else {
                    billItem.actualVat = Math.round(((Math.round((billItem.price * billItem.quantity - billItem.discount)*100)/100) * billItem.vatTypeDefaultValue)*100)/100;
                    billItem.totalPrice = (Math.round((billItem.price * billItem.quantity - billItem.discount)*100)/100)+ billItem.actualVat;
                }
    
    
            }
    
            for (let billService of this.allRsaleService) {
                billService.discount = billService.quantity / billService.originalQuantity * billService.originalDiscount;
                billService.discount = Math.round((billService.discount + Number.EPSILON) * 100) / 100;
    
                billService.actualVat = Math.round(((Math.round((billService.price * billService.quantity - billService.discount)*100)/100) * billService.vatTypeDefaultValue)*100)/100;
                billService.totalPrice = (Math.round((billService.price * billService.quantity - billService.discount)*100)/100)+ billService.actualVat;
         
            }
            let sum = 0, sumBeforeVat=0,sumBeforeVatTow=0,vat=0
        for (let billItem of this.allRsaleItem) {
            if (billItem.vatTypeDefaultValue==0) {
                sum = sum + (((billItem.price*billItem.quantity)-billItem.discount)+(((billItem.price*billItem.quantity)-billItem.discount)*billItem.vatTypeTwoDefaultValue|0));
                
            }else if(billItem.vatTypeDefaultValue>0){
                vat==0?vat=billItem.vatTypeDefaultValue:''
                sumBeforeVat=sumBeforeVat+((billItem.price*billItem.quantity)-billItem.discount+(((billItem.price*billItem.quantity)-billItem.discount)*billItem.vatTypeTwoDefaultValue|0));
            }
            if(billItem.vatTypeTwoDefaultValue)
            sumBeforeVatTow=sumBeforeVatTow+(billItem.price*billItem.quantity)-billItem.discount;
         
            
        }

        for (let billService of this.allRsaleService) {
            if (billService.vatTypeDefaultValue==0) {
                sum = sum + (((billService.price*billService.quantity)-billService.discount));
                
            }else if(billService.vatTypeDefaultValue>0){
                sumBeforeVat=sumBeforeVat+((billService.price*billService.quantity)-billService.discount);
            }
        }
        rBillPost.StandardVatTaxableAmount = Math.round(sumBeforeVat* 100) / 100;
        rBillPost.NotSubjectToVatTaxableAmount = Math.round(sum* 100) / 100;
        rBillPost.totalVat=Math.round((sumBeforeVat*vat)*100)/100
        rBillPost.TotalBeforeDiscount = rBillPost.StandardVatTaxableAmount+rBillPost.NotSubjectToVatTaxableAmount;
        rBillPost.TotalAfterDiscount =rBillPost.TotalBeforeDiscount+rBillPost.totalVat
       
           
    
        /*    rBillPost.TotalBeforeDiscount = Math.round(sum* 100) / 100
            //ReCalculate Discount
            rBillPost.Discount = (rBillPost.TotalBeforeDiscount / this.billPost.TotalBeforeDiscount) * this.billPost.Discount;
            rBillPost.Discount = Math.round((rBillPost.Discount + Number.EPSILON) * 100) / 100;
            rBillPost.TotalAfterDiscount =
                rBillPost.TotalBeforeDiscount - rBillPost.Discount;
          */  
        } for (let item of this.allRsaleItem) {
            let billItemPost: BillItemPost = new BillItemPost();
            billItemPost.ActualVat = item.actualVat;
            billItemPost.actualVatTwo = item.actualVatTwo
            billItemPost.Price = item.price;
            billItemPost.serialNo = item.serialNo;
            billItemPost.Quantity = item.quantity;
            billItemPost.discount = item.discount;
            billItemPost.ItemUnitId = item.itemUnitId;
            billItemPost.itemUnitBranchId = item.itemUnitBranchId;
            billItemPost.Notes = item.notes;
            billItemPost.totalPrice = item.totalPrice;
            billItemPost.RefundBillItemId = item.id;
            rBillPost.BillItems.push(billItemPost);

        }

        for (let service of this.allRsaleService) {
            let billServicePost: BillServicePost = new BillServicePost();
            billServicePost.ActualVat = service.actualVat;
            billServicePost.Price = service.price;
            billServicePost.Quantity = service.quantity;
            billServicePost.discount = service.discount;
            billServicePost.BranchId = service.branchId;
            billServicePost.ServiceTypeId = service.serviceTypeId
            billServicePost.RefundBillServiceId = service.id;
            rBillPost.BillServices.push(billServicePost);

        }
        console.error(rBillPost);
        if(!this.isMultiPaymentMethods){
            rBillPost.paymentMethods=[]
            rBillPost.paymentMethods.push({accountId:this.sbillEdit.accountId,accountTypeId:this.sbillEdit.accountTypeId,amount: rBillPost.TotalAfterDiscount})
       
        }
        rBillPost.AccountId=null
        rBillPost.AccountTypeId=null
        console.log(this.sbillEdit,this.billPost)
        rBillPost.IsOldBillTemplate=this.sbillEdit.isOldBillTemplate
        this.rsallbill=rBillPost
        this.sbillService
            .newSBill(rBillPost)
            .subscribe(
                sbill => {
                    //navigate to newly created RSall Bill
                    console.log(sbill)
                    if (this.isNewRpurch)
                        this.router.navigate(['purch', 'bill', 'rpurch', sbill['id']])
                    if (this.isNewRsale)
                        this.router.navigate(['sales', 'bill', 'rsale', sbill['id']])
                },
                (error: any) => {
                    console.error(error)
                    this.isSaving = false
                }
            );
    }

    private saveFailedHelper(error: any) {
        if(this.lockSumbitEvent)
        return
        this.isSaving = false;
        this.lockSumbitEvent=false
     /*   this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(
            "Save Error",
            "The below errors occured whilst saving your changes:",
            MessageSeverity.error,
            error
        );
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        */}

    private showErrorAlert(caption: string, message: string) {
        //  this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    private cancel() {
        this.sbillEdit = this.sbill = new SBill();

        this.showValidationErrors = false;
        this.resetForm();

        // this.alertService.showMessage(
        //     "إغلاق",
        //     "تم تجاهل العملية",
        //     MessageSeverity.default
        // );
        // this.alertService.resetStickyMessage();
        this.goHome();

    }

    private goHome() {
        if (
            this.sbillType === "sale" ||
            this.sbillType === "rsale" ||
            this.sbillType === "quate" ||
            this.sbillType === "exchange"
        ) {
            this.router.navigate(["/sales/bill", this.sbillType, 'new']);

        } else {
            this.router.navigate(["/purch/bill", this.sbillType, 'new']);

        }


    }

    goNotFound() {
        this.router.navigate(["/notFound"]);
    }
    getAccountamount(id) {
        let amount :number=0
        if(this.sbillEdit.paymentMethods)
        this.sbillEdit.paymentMethods.forEach(e => {

            if (id == e.accountId)
                amount = e.amount
        })
      
        return amount-(this.allPaymentMethods- this.sbillEdit.totalAfterDiscount)
    }
    getAccountTypeName(id) {
        let name = ''
        this.allAccountType.forEach(e => {

            if (id == e.id)
                name = e.name
        })
        return name
    }
    getAccountIdName(id, aId) {
        let name = ''
        this.allAccountType.forEach(a => {
            if (a.id == aId)
                a.accounts.forEach((e, i) => {
                    if (id == e.id)
                        name = e.name
                })
        })
        /* this.allAccount.forEach(e =>{
            
             if(id==e.id)
             name= e.name
         })*/
        return name
    }
    defaultChanged(e) {
        if (e) {
            if (this.printOptions.printTypes == 0) {
                this.defaultLabel = 'الطابعة الافتراضية: ضريبية'
            }
            else if (this.printOptions.printTypes == 1) {
                this.defaultLabel = 'الطابعة الافتراضية: ضريبية مبسطة'

            }
        }
    }

    private loadItem3() {
        console.log(this.sbillType)
        /*if (this.sbillType == "exchange") {
            console.log(1)
            
            this.item3$ = concat(
                of([]), // default items
                this.item3input$.pipe(
                    debounceTime(200),
                    distinctUntilChanged(),
                    tap(() => (this.item3Loading = true)),
                    switchMap(term =>
                        this.itemSearchService
                            .getSearchItemEndpointExchange(term, this.sbillEdit.branchId, this.sbillEdit.costCenterId,type)
                            .pipe(
                                catchError(() => of([])), // empty list on error
                                tap(() => (this.item3Loading = false))
                            )
                    )
                )
            );
       // } else {*/
        console.log(2)
        this.item3$ = concat(
            of([]), // default items
            this.item3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.item3Loading = true)),
                switchMap(term =>
                    this.itemSearchService
                        .getSearchItemEndpoint(term, this.sbillEdit.branchId, this.sbillEdit.costCenterId, this.sbillType)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.item3Loading = false))
                        )
                )
            )
        );
        //    }
    }

    private loadService3() {
        this.service3$ = concat(
            of([]), // default services
            this.service3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.service3Loading = true)),
                switchMap(term =>
                    this.serviceSearchService
                        .getSearchServiceEndpoint(term)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.service3Loading = false))
                        )
                )
            )
        );
    }

    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default people
            this.people3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.people3Loading = true)),
                switchMap(term =>
                    this.peopleSearchService.getSearchPeopleEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.people3Loading = false))
                    )
                )
            )
        );
    }
    private loadAccounts3() {
        this.account$ = concat(
            of([]), // default people
            this.accountinput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.accountLoading = true)),
                switchMap(term =>
                    this.accountSearchService.getSearchAccountEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.accountLoading = false))
                    )
                )
            )
        );
    }
    private loadAccountsTo3() {
        this.accountTo$ = concat(
            of([]), // default people
            this.accountinputTo$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.accountLoadingTo = true)),
                switchMap(term =>
                    this.accountSearchService.getSearchAccountEndpoint(term).pipe(
                        catchError(() => of([])), // empty list on error
                        tap(() => (this.accountLoadingTo = false))
                    )
                )
            )
        );
    }
    public round(number, point) {
        var factor = Math.pow(10, point);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
            this.allBillItem = [];
            this.allBillService = [];
            this.allRsaleItem = [];
            this.allRsaleService = [];
            this.currentBalance = 0;
            this.sbillEdit.totalAfterDiscount = 0;
            this.sbillEdit.totalBeforeDiscount = 0;
            this.tobaccoView = false
            this.amount=0
            this.paymentMethods=[]
        } else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }
    calcDiscount(DiscountBill){
        let d= +DiscountBill
        let total=this.sbillEdit.totalAfterDiscount
        let subTotalItems=0
        let subTotalServices=0
        let counter=0
        this.allBillItem.forEach((item,index) =>{
            counter++
            let subdiscount=0
            if(counter==(this.allBillItem.length+this.allBillService.length)){
              subdiscount=((d-subTotalItems)/(1+item.vatTypeDefaultValue))/(1+item.vatTypeTwoDefaultValue)
            }else{
                console
                subdiscount =(((Math.round((d*item.totalPrice/total)*100)/100)/(1+item.vatTypeDefaultValue))/(1+item.vatTypeTwoDefaultValue))
                console.log(d,'-',item.totalPrice,'-',total,'-',item.vatTypeDefaultValue)
                subTotalItems+= (Math.round((d*item.totalPrice/total)*100)/100)
            }
                console.log( '=================>',item.discount,(Math.round((subdiscount)*100)/100),subdiscount,Math.round((item.discount+ (Math.round((subdiscount)*100)/100))*100)/100)
                
             item.discount =Math.round((item.discount+ (Math.round((subdiscount)*100)/100))*100)/100

        })
        this.allBillService.forEach((item,index) =>{
            let subdiscount
            counter++
            if(counter==(this.allBillItem.length+this.allBillService.length)){
                subdiscount=(d-subTotalItems)/(1+item.vatTypeDefaultValue)
            }else{
                subdiscount =((Math.round((d*item.totalPrice/total)*100)/100)/(1+item.vatTypeDefaultValue))
          
                subTotalServices+= (Math.round((d*item.totalPrice/total)*100)/100)
            }
   
            item.discount =Math.round((item.discount+ (Math.round((subdiscount)*100)/100))*100)/100
          })
          this.allBillItem.forEach(item =>{
                this.calTotalForNewBills(item)
        })
        this.allBillService.forEach(item =>{
               this.calTotalForNewBills(item)
          })
          this.sbillEdit.discount=0
          
          return
    }
}
