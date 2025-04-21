import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { CheckPermissionsService } from './check-permissions.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class SideBarMenuService {
  openMenu:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(true);
  constructor( private accountService:AccountService,private checkPermissions:CheckPermissionsService) { 
    
  }
  
  getMainTaps(){
    let main=[]
    main=[this.salesMenu,this.purchMenu,this.accountingMenu,this.statementMenu,this.reportsMenu,this.definitionsMenu,this.toolsMenu,this.settingsMenu]
    
    return main.map(val => val={active:val.isActive,name:val.pageHeader,groupNumber:val.groupNumber,router:val.routerLink,icon:val.icon})
  }

  purchMenu={pageHeader:'pageHeader.Purch',icon:'fa fa-shopping-cart'    , groupNumber:2,routerLink:'/purch',isActive:false,taps:[{
    name:'shared.createPurchBill' ,
    routerLink:'/purch/bill/purch/new',
    isActive:false,
    groupNumber:2,
    featureNumber:1,
    icon:'bi bi-file-earmark-plus'
  },
  {
    name:'shared.createRefund' ,
    routerLink:'/purch/rpurch',
    isActive:false,
    groupNumber:2,
    featureNumber:[2,5],
    
    icon:"bi bi-arrow-return-right"
  },
  
  {
    name:'Sales.Tabs.Expenses' ,
    routerLink:'/purch/expenses',
    isActive:false,
    groupNumber:2,
    featureNumber:3,
    icon:'bi bi-cash-coin'
  },
  {
    name:'shared.addProductionBill' ,
    routerLink:'/purch/add-production-bill/new',
    isActive:false,
    groupNumber:2,
    featureNumber:4,
    icon:'bi bi-file-earmark-plus'
  },
 ]}
 salesMenu={pageHeader:'pageHeader.Sales',  groupNumber:1,icon:'fa fa-shopping-cart' ,isActive:false,routerLink:'/sales',taps:[{
  name:'shared.createSalesBill' ,
  routerLink:'/sales/bill/sale/new',
  isActive:false,
  groupNumber:1,
  featureNumber:1,
  icon:'bi bi-file-earmark-plus'
},
{
  name:'Sales.Tabs.CreateQuote' ,
  routerLink:'/sales/bill/quate/new',
  isActive:false,
  groupNumber:1,
  featureNumber:2,
  icon:'fa fa-list-alt'
},
{
  name:'shared.createRefund' ,
  routerLink:'/sales/rsale',
  isActive:false,
  groupNumber:1,
  featureNumber:[3,7],
  icon:'bi bi-arrow-return-right'
},
{
  name:'Sales.Tabs.Exchange' ,
  routerLink:'/sales/bill/exchange/new',
  isActive:false,
  groupNumber:1,
  featureNumber:4,
  icon:'bi bi-cash-coin',
},
{
  name:'Sales.Tabs.Convert Varieties' ,
  routerLink:'/sales/convert-varieties',
  isActive:false,
  groupNumber:1,
  featureNumber:5,
  icon:'fa fa-exchange'
},
{
  name:'Sales.Tabs.Transference Varieties' ,
  routerLink:'/sales/convert-cc',
  isActive:false,
  groupNumber:1,
  featureNumber:6,
  icon:'a fa-exchange'
},
]}
accountingMenu={pageHeader:'pageHeader.Accounting',  groupNumber:3,icon:'fa fa-money',isActive:false,routerLink:'/accounting',taps:[{
  name:'shared.AccountingTree' ,
  routerLink:'/accounting/accountingtree',
  isActive:false,
  groupNumber:3,
  featureNumber:1,
  icon:'bi bi-diagram-3'
},
{
  name:'shared.receipts' ,
  routerLink:'/accounting/receipts',
  isActive:false,
  groupNumber:3,
  featureNumber:2,
  icon:'bi bi-cash-stack'
},
{
  name:'shared.payments' ,
  routerLink:'/accounting/payments',
  isActive:false,
  groupNumber:3,
  featureNumber:3,
  icon:'bi bi-credit-card'
},
{
  name:'shared.deposits' ,
  routerLink:'/accounting/deposits',
  isActive:false,
  groupNumber:3,
  featureNumber:4,
  icon:'bi bi-bank'
},
{
  name:'shared.daily' ,
  routerLink:'/accounting/daily',
  isActive:false,
  groupNumber:3,
  featureNumber:5,
  icon:'bi bi-journal-text'
},
{
  name:'shared.dailyAdvanced' ,
  routerLink:'/accounting/daily-advanced',
  isActive:false,
  groupNumber:3,
  featureNumber:6,
  icon:'bi bi-journal-text'
},
{
  name:'Sales.Tabs.Receipt Documents' ,
  routerLink:'/accounting/receipt-documents',
  isActive:false,
  groupNumber:3,
  featureNumber:7,
  icon:'fa fa-file-text-o'
},
{
  name:'Sales.Tabs.Payment Documents' ,
  routerLink:'/accounting/payment-documents',
  isActive:false,
  groupNumber:3,
  featureNumber:8,
  icon:'fa fa-file-text-o'
},
{
  name:'asset.newasset' ,
  routerLink:'/accounting/newassets',
  isActive:false,
  groupNumber:3,
  featureNumber:9,
  icon:'bi bi-plus-square'
},
{
  name:'asset.Assetmangment' ,
  routerLink:'/accounting/assets',
  isActive:false,
  groupNumber:3,
  featureNumber:10,
  icon:'fa fa-usd'
},
{
  name:'shared.deliveryAppManage' ,
  routerLink:'/accounting/delivery-apps',
  isActive:false,
  groupNumber:3,
  featureNumber:11,
  icon:'bi bi-truck'
},
]}
reportsMenu={pageHeader:'pageHeader.Reports',  groupNumber:5,icon:'fa fa-file-text-o',isActive:false,routerLink:'/reports',taps:[{
  name:'shared.billsReport' ,
  routerLink:'/reports/bills',
  isActive:false,
  groupNumber:5,
  featureNumber:1,
  icon:'bi bi-clipboard2-data'
},
{
  name:'shared.production' ,
  routerLink:'/reports/production',
  isActive:false,
  groupNumber:5,
  featureNumber:2,
  icon:'fa fa-bar-chart'
},
{
  name:'shared.solidItems' ,
  routerLink:'reports/sold-items',
  isActive:false,
  groupNumber:5,
  featureNumber:3,
  icon:'fa fa-line-chart'
},
{
  name:'shared.dueAmount' ,
  routerLink:'reports/due-amount',
  isActive:false,
  groupNumber:5,
  featureNumber:4,
  icon:'fa fa-file'
},

{
  name:'shared.vatSummaryTab' ,
  routerLink:'/reports/vat-reports',
  isActive:false,
  groupNumber:5,
  featureNumber:5,
  icon:'bi bi-percent'
},
{
  name:'shared.purchAddedVatTab' ,
  routerLink:'/reports/vat-reports-purch',
  isActive:false,
  groupNumber:5,
  featureNumber:6,
  icon:'bi bi-percent'
},
{
  name:'shared.recieptAddedVatTab' ,
  routerLink:'/reports/vat-reports-sales',
  isActive:false,
  groupNumber:5,
  featureNumber:7,
  icon:'bi bi-percent'
},
{
  name:'Sales.Tabs.Storage' ,
  routerLink:'/reports/storage',
  isActive:false,
  groupNumber:5,
  featureNumber:8,
  icon:'bi bi-file-text'
},



{
  name:'shared.SuppAccountStatement' ,
  routerLink:'/reports/supplier-info',
  isActive:false,
  groupNumber:5,
  featureNumber:9,
  icon:'bi bi-clipboard-data'
},
{
  name:'shared.CustAccountStatement' ,
  routerLink:'/reports/customer-info',
  isActive:false,
  groupNumber:5,
  featureNumber:10,
  icon:'bi bi-clipboard-data'
},
{
  name:'shared.Movement' ,
  routerLink:'/reports/item-report',
  isActive:false,
  groupNumber:5,
  featureNumber:11,
  icon:'fa fa-arrows-alt'
},


{
  name:'Sales.Tabs.Abstract' ,
  routerLink:'/reports/abstract',
  isActive:false,
  groupNumber:5,
  featureNumber:12,
  icon:'fa fa-file'
},
{
  name:'shared.profit' ,
  routerLink:'/reports/profit-reports',
  isActive:false,
  groupNumber:5,
  featureNumber:13,
  icon:'fa fa-balance-scale'
},
{
  name:'shared.profitbranch' ,
  routerLink:'/reports/profit-branch-reports',
  isActive:false,
  groupNumber:5,
  featureNumber:14,
  icon:'fa fa-balance-scale'
},


{
  name:'shared.profitCC' ,
  routerLink:'/reports/profit-cc-reports',
  isActive:false,
  groupNumber:5,
  featureNumber:15,
  icon:'fa fa-balance-scale'
},
{
  name:'shared.shifts' ,
  routerLink:'/reports/shifts',
  isActive:false,
  groupNumber:5,
  featureNumber:16,
  icon:'fa fa-calendar-plus-o'
},
{
  name:'shared.abstract-tobacco' ,
  routerLink:'/reports/abstract-tobacco',
  isActive:false,
  groupNumber:5,
  featureNumber:12,
  icon:'fa fa-file'
},

{
  name:'shared.CostCenterReport' ,
  routerLink:'/reports/cost-center',
  isActive:false,
  groupNumber:5,
  featureNumber:19,
  icon:'fa fa-file'
},
{
  name:'shared.CostCenterProduction' ,
  routerLink:'/reports/cost-center-production',
  isActive:false,
  groupNumber:5,
  featureNumber:19,
  icon:'fa fa-file'
},





]}
statementMenu={pageHeader:'mainMenu.permissions',groupNumber:4,icon:'fa fa-drivers-license-o',isActive:false,routerLink:'/permissions',taps:[{
  name:'permissions.newEntrySatatement' ,
  routerLink:'/permissions/newentrystatments',
  isActive:false,
  groupNumber:4,
  featureNumber:1,
  icon:'bi bi-file-earmark-plus'
},
{
  name:'permissions.EnterExitStatement' ,
  routerLink:'/permissions/entrystatments',
  isActive:false,
  groupNumber:4,
  featureNumber:2,
  icon:'bi bi-card-checklist'
},


]}
definitionsMenu={pageHeader:'pageHeader.Definitions',  groupNumber:6,icon:'fa fa-sliders',isActive:false,routerLink:'/definitions',taps:[{
  name:'shared.ItemCat' ,
  routerLink:'/definitions/itemcat',
  isActive:false,
  groupNumber:6,
  featureNumber:1,
  icon:'fa fa-folder-open'
},
{
  name:'shared.items' ,
  routerLink:'/definitions/item',
  isActive:false,
  groupNumber:6,
  featureNumber:2,
  icon:'bi bi-list-columns'
},
{
  name:'shared.serviceTypes' ,
  routerLink:'/definitions/service-type',
  isActive:false,
  groupNumber:6,
  featureNumber:3,
  icon:'bi bi-journal-plus'
},
{
  name:'shared.tablesManagement' ,
  routerLink:'/definitions/tables',
  isActive:false,
  groupNumber:6,
  featureNumber:4,
icon:'bi bi-microsoft'
},


{
  name:'shared.supplier' ,
  routerLink:'/definitions/supplier',
  isActive:false,
  groupNumber:6,
  featureNumber:5,
  icon:'bi bi-person-plus'
},
{
  name:'shared.customer' ,
  routerLink:'/definitions/customer',
  isActive:false,
  groupNumber:6,
  featureNumber:6,
  icon:'bi bi-people'
},
{
  name:'shared.tableLabel' ,
  routerLink:'/definitions/acc-table',
  isActive:false,
  groupNumber:6,
  featureNumber:7,
icon:'bi bi-microsoft'
},



{
  name:'shared.branches' ,
  routerLink:'/definitions/branch',
  isActive:false,
  groupNumber:6,
  featureNumber:8,
  icon:'bi bi-people'
},
{
  name:'shared.expenses-template' ,
  routerLink:'/definitions/expenses-template',
  isActive:false,
  groupNumber:6,
  featureNumber:9,
icon:'fa fa-folder-open'
},

{
  name:'shared.discountManagement' ,
  routerLink:'/definitions/discount-management',
  isActive:false,
  groupNumber:6,
  featureNumber:10,
  icon:'bi bi-gear'
},

{
  name:'shared.printerSettings' ,
  routerLink:'/definitions/printer-settings',
  isActive:false,
  groupNumber:6,
  featureNumber:11,
  icon:'bi bi-gear'
},

]}
toolsMenu={pageHeader:'mainMenu.Tools',icon:'fa fa-drivers-license-o',groupNumber:8,isActive:false,routerLink:'/tools',taps:[
  {
    name:'mainMenu.Tools' ,
    routerLink:'/tools',
    isActive:true,
    groupNumber:8,
    featureNumber:1,
    icon:'fa fa-drivers-license-o',
   
    
  },
]
}
settingsMenu={pageHeader:'pageHeader.Settings',groupNumber:7,icon:'fa fa-cog fa-lg page-caption',isActive:false,routerLink:'/settings',taps:[
  {
    name:'settings.tab.Profile' ,
    routerLink:'/settings',
    isActive:true,
    groupNumber:7,
    featureNumber:null,
    icon:'fa fa-user-circle-o fa-fw',
    id:'profileTab',
    fragment:"profile",
    
  },
  {
    name:'settings.tab.Preferences' ,
    routerLink:'/settings',
    isActive:true,
    groupNumber:7,
    featureNumber:null,
    icon:'fa fa-user-circle-o fa-fw',
    id:'Preferences',
  fragment:"preferences"
  },


  {
    name:'settings.tab.VatEnable' ,
    routerLink:'/settings',
    isActive:false,
    groupNumber:'superAdmin',
    featureNumber:'superAdmin',
    icon:'fa fa-shield fa-fw',
    id:'vatSettingTab',
    fragment:"vatSetting"
  },
  {
    name:'settings.tab.Users' ,
    routerLink:'/settings',
    isActive:this.accountService.userHasPermission('users.view'),
    groupNumber:7,
    featureNumber:1,
    icon:'fa fa-users fa-fw',
    id:'usersTab',
    fragment:"users"
  },
  {
    name:'settings.tab.Roles' ,
    routerLink:'/settings',
    isActive:this.accountService.userHasPermission('roles.view'),
    groupNumber:7,
    featureNumber:null,
    icon:'fa fa-shield fa-fw',
    id:'rolesTab',
  fragment:"roles"
  },




  {
    name:'settings.tab.Backup' ,
    routerLink:'/settings',
    isActive:this.checkPermissions.checkGroup(7,2),
    groupNumber:7,
    featureNumber:2,
    icon:'fa fa-user-circle-o fa-fw',
    id:'backupTab',
    fragment:"backup"
  },
  {
    name:'settings.tab.VatEnable' ,
    routerLink:'/settings',
    isActive:this.accountService.userHasPermission('manageVat'),
    groupNumber:7,
    featureNumber:null,
    icon:'fa fa-shield fa-fw',
    id:'vatSettingTab',
  fragment:"vatSetting"
  },




  {
    name:'settings.tab.Logo' ,
    routerLink:'/settings',
    isActive:this.checkPermissions.checkGroup(7,3),
    groupNumber:7,
    featureNumber:3,
    icon:'fa fa-shield fa-fw',
    id:'logoTab',
    fragment:"logo"
  },
  {
    name:'settings.tab.Updates' ,
    routerLink:'/settings',
    isActive:true,
    groupNumber:7,
    featureNumber:null,
    icon:'fa fa-refresh',
    id:'updatesTab',
  fragment:"updates"
  },
  {
    name:'settings.tab.statistics' ,
    routerLink:'/statistics',
    isActive:true,
    groupNumber:7,
    featureNumber:null,
    icon:'fas fa-chart-line',
    id:'statisticsTab',
     fragment:"statistics"
  },
 ]}
}

