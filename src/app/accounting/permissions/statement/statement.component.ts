  import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../services/account.service';
import { AlertService, MessageSeverity, DialogType } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { ExcelService } from '../../../services/excel.service';
import { Utilities } from '../../../services/utilities';
import { Accounting } from '../../accounting/models/accounting.model';
import { Asset } from '../../accounting/models/asset.model';
import { AccountingService } from '../../accounting/services/accounting.service';
import { AssetService } from '../../accounting/services/asset.service';
import Page from '../../definitions/models/page.model';
import { ReceiptDocService } from '../../sales/services/receipt-doc.service';
import { SBillService } from '../../shared/services/sbill.service';
import { STBill } from '../models/sBill';
import { StatmentsService } from '../services/statments.service';

  
  @Component({
    selector: 'app-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.css']
  })
  export class StatementComponent implements OnInit {
  
    isVatReport = false;
    whatToLoad;
    type=0
    statementtype:any[]=[]
    billId:number;
    sBill:STBill[]=[]
    isAdvanced = false;
    editingName: { code: string };
    sourceAccountingTabels: Asset;
    editedAccountingTabels: Asset;
    rows: Asset[] = [];
    rowsCache: Asset[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    page:Page = new Page(0, 0)
    query = ''
    serachModel:any=  {
        from: '',
        to: ''
    }
    gT = (key: string) => this.translationService.getTranslation(key);

   /* headers = {
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
        code: {
            title: this.gT("shared.code"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        name: {
            title: this.gT("shared.name"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        initialBalance: {
            title: this.gT("shared.initialBalance"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        defaultDisplay: {
            title: this.gT("shared.isDefault"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        personName: {
            title: this.gT("shared.personName"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        accountCategoryName: {
            title: this.gT("shared.accountCategoryName"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        accountTypeId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        accountCategoryId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        canBeDeleted: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        personId: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        actualBalance: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        accountTypeName: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        isDefault: {
            title: '',
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
    };
    */
    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;
      index: number=0;
      exitActive: boolean;
      entryActive: boolean;
  
    constructor(
        private sbillService:SBillService,
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private statmentService:StatmentsService,
        private checkPermissions:CheckPermissionsService,
        private router: Router,
    ) {}
  
    get canManageDocs() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }
    /*onchangebill(e){
        this.page.offset = 0;
        this.statmentService.GetStatments(this.billId,this.type,this.query,this.page.offset + 1, this.page.size,this.serachModel).subscribe(
            asset => {
                console.log("statment=",this.type,asset)
                this.onDataLoadSuccessful(asset)
            //        console.error(accounting);
            },
            //error => this.onDataLoadFailed(error)
        );
    }*/
    ngOnInit() {
        this.page.size=8
        this.statementtype=[{id:0,name:this.gT('permissions.addentrystatment')},{id:1,name:this.gT('permissions.addexitstatment')}]
        this.entryActive=this.checkPermissions.checkGroup(4,1)
        this.exitActive=this.checkPermissions.checkGroup(4,3)
        this.setType(this.router.url);
        this.columns = [
         {
             prop: "index",
             name: "#",
             width: 60
         },
         {
            prop: "code",
            name: this.gT("shared.code"),
            width: 70
        },
         {
             prop: "careNumber",
             name: this.gT("shared.careNumber"),
             width: 70
         },
         {
             prop: "driverName",
             name: this.gT("shared.driverName"),
             width: 70
         },
         {
             prop: "driverId",
             name: this.gT("shared.driverId"),
             width: 70
         },
         {
             prop: "driverPhoneNumber",
             name: this.gT("shared.driverPhoneNumber"),
             width: 70
         },
         {
             prop: "createdDate",
             name: this.gT("shared.createdDate"),
             width: 70
         },
         {
          prop: "updatedDate",
          name:this.gT("shared.updatedDate"),
          width: 70
      },
         {
             prop: "bill",
             name:this.gT("shared.billCode"),
             width: 70
         },
        
         
     ];
        if (this.canManageDocs) {
            this.columns.push({
                name: "",
                width: 200,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false
            });
        }
        
        this.loadData();
    }
    onchangetype(e){
        
        if(!e)
        this.type=0
      /*  this.page.offset = 0;
        this.loadData()*/
    }
    setType(url) {
        switch (url) {
            case "/permissions/entrystatments":
                this.whatToLoad = { name: "entrystatments", type: 0 , pageNumber: this.page.offset + 1, pageSize: this.page.size  };
                this.type=0
                break;
            case "/permissions/exitstatments":
                    this.whatToLoad = { name: "exitstatments", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size };
                   this.type=1
                    break;
             
            default:
                break;
        }
    }
  
    ngAfterViewInit() {
     /*   this.dailyDocEditor.changesSavedCallback = () => {
          //  this.addNewAccountingTabels();
            this.editorModal.hide();
            this.loadData();
        };
  */
    /*    this.dailyDocEditor.changesCancelledCallback = () => {
            // this.editAccountingTabels = null;
            this.sourceAccountingTabels = null;
            this.editorModal.hide();
        };*/
    }
    onSearchChanged(value: string) {
      this.page.offset = 0;
      this.query = value;
      this.loadData();
   }
    setPage(pageInfo:any){
  //   console.log('page=',pageInfo,'***************')
     this.page.offset = pageInfo.offset;
     this.loadData();
  }
  
    filter(){
        this.page.offset = 0;
      this.loadData();
    }
    loadData() {
        
        this.loadingIndicator=true
        this.statmentService.GetBillsThatHaveStatement().subscribe(
          (data: any) => {
            this.loadingIndicator = false;
            this.sBill = data;
           // console.log(this.sBill)
          },
          error =>{
            this.loadingIndicator = false;
          }
      );
      /*  this.alertService.startLoadingMessage();
        */this.loadingIndicator = true;
          this.loadingIndicator = true;/*
  */
     //   this.alertService.startLoadingMessage();
        this.statmentService.GetStatments(this.billId,this.type,this.query,this.page.offset + 1, this.page.size,this.serachModel).subscribe(
            res => {
            //    console.log("statment=",this.type,asset)
                this.onDataLoadSuccessful(res)
            //        console.error(accounting);
            },
            //error => this.onDataLoadFailed(error)
        );
    }
  
    onDataLoadSuccessful(sups: any) {
        console.log("from server");
        console.log(sups);
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.page.count = sups.totalCount;
        sups = sups.content;
      
       // console.log("******",sups , this.page.count)
        sups.forEach((bt, index, sup) => {
            (<any>bt).index = index + 1;
            bt['bill'] = bt.bill.receiptCode
            bt["createdDate"] = this.formatDate(new Date(bt.createdDate));
            bt["updatedDate"] = this.formatDate(new Date(bt.updatedDate));
            
           // : this.gT("shared.no");
         });
  this.index=0
  this.rowsCache = [...sups];
  this.rows = sups;
  
    }
  
    onDataLoadFailed(error: any) {
        /*this.alertService.stopLoadingMessage();
      */  this.loadingIndicator = false;
  
        this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
    }
  
  /*  onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.name)
        );
    }
  */
   /* addNewAccountingTabels() {
        if (this.sourceAccountingTabels) {
            Object.assign(
                this.sourceAccountingTabels,
                this.editAccountingTabels
            );
            this.rows = [...this.rows];
            // this.editAccountingTabels = null;
            this.sourceAccountingTabels = null;
        } else {
            let itemcat = new Accounting();
            Object.assign(itemcat, this.editAccountingTabels);
            // this.editAccountingTabels = null;
  
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
        this.dailyDocEditor.resetForm(true);
    }
  
   */ newAssetTabels() {
        this.editingName = null;
        this.sourceAccountingTabels = null;
      //  this.editedAccountingTabels = this.dailyDocEditor.newAcc();
      //  this.showModal();
    }
  //*
  /*  editAccountingTabels(row: Accounting) {
        this.editingName = { code: row.code };
        this.sourceAccountingTabels = row;
        this.editedAccountingTabels = this.dailyDocEditor.editAccounting(
            row
        );
        this.editedAccountingTabels = this.dailyDocEditor.editAccounting(
            row
        );
        this.showModal();
    }
  
    onSelect(row) {
        console.log(row);
        this.editingName = { code: row.code };
        this.sourceAccountingTabels = row;
        this.dailyDocEditor.displayAccounting(row);
        this.showModal();
    }
  */
    
  
    deleteAccountingTabels(row: Accounting) {
        this.alertService.showDialog(
            'هل أنت متأكد من حذف العنصر  "' + row.code + '"?',
            DialogType.confirm,
            () => this.deleteAccountingTabelsHelper(row)
        );
    }
  
    deleteAccountingTabelsHelper(row: Accounting) {
        //this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
     
    }
  
    get canManageAccountingTabels() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }
  
    formatDate(date: Date) {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }
   /* getRemovedHeadersArray() {
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
    }*/
  }
  