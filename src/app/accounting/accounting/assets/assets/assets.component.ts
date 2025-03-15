import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../../services/account.service';
import { AlertService, DialogType, MessageSeverity } from '../../../../services/alert.service';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { ExcelService } from '../../../../services/excel.service';
import { Utilities } from '../../../../services/utilities';
import Page from '../../../definitions/models/page.model';
import { ReceiptDocService } from '../../../sales/services/receipt-doc.service';
import { Accounting } from '../../models/accounting.model';
import { Asset } from '../../models/asset.model';
import { AccountingService } from '../../services/accounting.service';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {

  isVatReport = false;
  whatToLoad;
  isAdvanced = false;
  editingName: { code: string };
  sourceAccountingTabels: Asset;
  editedAccountingTabels: Asset;
  rows: Asset[] = [];
  rowsCache: Asset[] = [];
  columns: any[] = [];
  loadingIndicator: boolean;
  page:Page = new Page(0, 0)
  isAsset:boolean=false
  query = ''
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

  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("editorModal")
  editorModal: ModalDirective;

 

  @ViewChild("actionsTemplate")
  actionsTemplate: TemplateRef<any>;

  @ViewChild("parentCategory")
  parentCategory: TemplateRef<any>;
   excelLabel: string = 'Accounts';

  constructor(
      private alertService: AlertService,
      private translationService: AppTranslationService,
      private accountService: AccountService,
      private dailyDocService: ReceiptDocService,
      private accountingService: AccountingService,
      private assetService:AssetService,
      private excelService: ExcelService,
      private router: Router,
      private route: ActivatedRoute,
  ) {}

  get canManageDocs() {
      //return this.accountService.userHasPermission(
      //    Permission.manageItemCatPermission
      //);
      return true;
  }

  ngOnInit() {
      this.page.size=8
      this.setType(this.router.url);
      this.route.params.subscribe(params => {
         if(params.id){
            this.isAsset=true;
            this.columns=[
              {
                  prop: "index",
                  name: "#",
                  width: 60
              },
              {
                  prop: "branch",
                  name: this.gT("shared.branch"),
                  width: 70
              },
              {
                  prop: "costCenter",
                  name: this.gT("shared.costCenter"),
                  width: 70
              },
              {
                  prop: "value",
                  name: this.gT("shared.defaultValue"),
                  width: 70
              },
              {
                  prop: "perc",
                  name: this.gT("shared.percentage"),
                  width: 70
              },
              {
                  prop: "updatedDate",
                  name: this.gT("shared.updatedDate"),
                  width: 70
              },
              {
               prop: "createdDate",
               name:this.gT("shared.createdDate"),
               width: 70
           },
              
            ]
        }else{
  
        
        this.columns = [
         {
             prop: "id",
             name: "#",
             width: 60
         },
         {
             prop: "nameAr",
             name: this.gT("shared.nameAr"),
             width: 70
         },
         {
             prop: "nameEn",
             name: this.gT("shared.nameEn"),
             width: 70
         },
         {
             prop: "value",
             name: this.gT("shared.defaultValue"),
             width: 70
         },
         {
             prop: "currentValue",
             name: this.gT("shared.currentValue"),
             width: 70
         },
         {
             prop: "depreciationInterval",
             name: this.gT("asset.depreciationInterval"),
             width: 70
         },
         {
          prop: "increaseAccount",
          name:this.gT("asset.increaseAccountId"),
          width: 70
      },
         {
             prop: "depreciationAccount",
             name:this.gT("asset.depreciationAccountId"),
             width: 70
         },
        
         
     ];
  }
      })
     
         
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

  setType(url) {
      switch (url) {
          case "/accounting/daily-advanced":
              this.whatToLoad = { name: "daily", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size };
              this.isAdvanced = true;
              break;
        case "/accounting/assets":
                this.whatToLoad = { name: "asset", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size };
                this.isAdvanced = true;
                break;
          case "/accounting/daily":
              this.whatToLoad = { name: "daily", type: 1 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
              this.isAdvanced = false;
              break;
          case "/accounting/deposits":
              this.whatToLoad = { name: "deposits", type: 2 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
              this.isAdvanced = false;
              break;
          case "/accounting/receipts":
              this.whatToLoad = { name: "receipts", type: 3 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
              this.isAdvanced = false;
              break;
          case "/accounting/payments":
              this.whatToLoad = { name: "payments", type: 4 , pageNumber: this.page.offset + 1, pageSize: this.page.size};
              this.isAdvanced = false;
              break;
          case "/accounting/vat-reports":
              this.whatToLoad = { name: "vat-reports", type: 5 };
              this.isAdvanced = false;
              this.isVatReport = true;
              console.log("vat report mode activated");
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
   console.log('page=',pageInfo,'***************')
   this.page.offset = pageInfo.offset;
   this.loadData();
}


  loadData() {

    /*  this.alertService.startLoadingMessage();
      */this.loadingIndicator = true;
      this.loadingIndicator = true;/*
*/
   //   this.alertService.startLoadingMessage();
   if(this.isAsset){
    this.route.params.subscribe(params => {
        
        this.assetService.getTransactionsAssets(params.id,this.page.offset,this.page.size).subscribe({
            next:(val)=>{
                console.log("tra=",val)
                this.onDataLoadSuccessful(val)
            }
        })
    })
   }else{
       
      this.assetService.GetAssets(this.query,this.page.offset + 1, this.page.size).subscribe(
          asset => {
              console.log("asset=",asset)
              this.onDataLoadSuccessful(asset)
          //        console.error(accounting);
          },
          //error => this.onDataLoadFailed(error)
      );
   }
  }
 
  onDataLoadSuccessful(sups: any) {
      console.log("from server");
      console.log('*********',sups);
    //  this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.page.count = sups.totalCount;
      sups = sups.content;
    if(this.isAsset){
         sups.forEach((bt, index, sup)=>{
             console.log(bt)
             bt['branch']=bt.branch.name
          if(bt.costCenter)   bt['costCenter']=bt.costCenter.nameAr
         })
    } else{
        sups.forEach((bt, index, sup) => {
        
          bt["depreciationAccount"] = bt.depreciationAccount.name;
          bt["increaseAccount"] = bt.increaseAccount.name;
          bt["depreciationInterval"]=this.convertdepreciationInterval(bt.depreciationInterval)
      });
    } 
      console.log("******",sups , this.page.count)
     /* sups.forEach((bt, index, sup) => {
          (<any>bt).index = bt.id + 1;
         // bt['defaultDisplay'] = bt.isDefault? this.gT("shared.yes")
         // : this.gT("shared.no");
       });
*/
this.rowsCache = [...sups];
this.rows = sups;

  }
  convertdepreciationInterval(val){
    switch (val){
        case 7:
            return 'اسبوعي'
        case 30:
            return 'شهري'
        case 1:
            return 'يومي'
        case 364:
            return 'سنوي'
       }
       return val
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
//   showModal() {
//       this.transformDataToModal();
//       this.editorModal.show();
//   }

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
      this.accountingService.deleteAccounting(row["id"]).subscribe(
          results => {
       //       this.alertService.stopLoadingMessage();
  /*            this.loadingIndicator = false;
              this.rowsCache = this.rowsCache.filter(sup => sup !== row);
              this.rows = this.rows.filter(sup => sup !== row);
          */     },
          error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

      /*        this.alertService.showStickyMessage(
                  "Delete Error",
                  `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
                      error
                  )}"`,
                  MessageSeverity.error,
                  error
              );*/
          }
      );
  }

  get canManageAccountingTabels() {
      //return this.accountService.userHasPermission(
      //    Permission.manageItemCatPermission
      //);
      return true;
  }

//   transformDataToModal() {
//       Object.assign(
//           this.dailyDocEditor.allAccountingegoryParent,
//           this.rowsCache
//       );
//   }
  getRemovedHeadersArray() {
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
  }
 /* exportAsXLSX(): void {
      let exportedRows: any[] = [];
      Object.assign(exportedRows, this.rows);
      let removedKeyArr: string[] = this.getRemovedHeadersArray();
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
      this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
  }*/
}
