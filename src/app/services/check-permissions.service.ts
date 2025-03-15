import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { features, PermissionsUser } from '../models/PermissionsUser.model';
import { AuthService } from './auth.service';

@Injectable()
export class CheckPermissionsService {

  constructor(private authService: AuthService) { }
  checkGroup(groupName: any, feature: any) {
    let group:{
      groupName:string,
      feature:string

    }
    
    group=this.switchGroupName(groupName,feature)
    if(feature!=null)
    feature=group.feature
    groupName=group.groupName
    if (this.authService.userInStorage.value&&this.authService.userInStorage.value.roles.includes('superadmin'))
    return true
    return this.searchInGroups(groupName, feature)

  }
  searchInGroups(groupName: string, feature: string) {
    let groups: PermissionsUser[]
    //console.log(this.authService.userInStorage.value)
    if(this.authService.userInStorage.value){
      groups = this.authService.userInStorage.value.groups
      let value: boolean = false
       
      groups.forEach(e => {
  
        if (e.groupCode == groupName && e.isActive) {
       //   console.log(e.groupCode, groupName)
          if (feature == null)
            value = true
          else
            value = this.searchInFeatures(e.features, feature)
        }
  
      })
      
      return value
    }
    
  }
  searchInFeatures(group: features[], feature) {
    let value: boolean = false
    group.forEach(e => {
      //console.log(e.featureCode,feature)
      if (e.featureCode == feature && e.isActive){
     //   console.log(e.featureCode,feature,'truee')
        value = true
      }
        
    })
    return value
  }
  switchGroupName(name:any,feature:any){
    let groupName:any
    switch (name) {
      case 1: {
        groupName = "g-sales"
        feature=this.switchSalesName(feature)
        break;
      }
      case 2: {
        groupName = "g-purchases"
        feature=this.switchPurchName(feature)
        break;
      }
      case 3: {
        groupName = "g-accounting"
        feature=this.switchAccName(feature)
        break;
      }
      case 4: {
        groupName = "g-statements"
        feature=this.switchStatementName(feature)
        break;
      }
      case 5: {
        groupName = "g-reports"
        feature=this.switchReportName(feature)
        break;
      }
      case 6: {
        groupName = "g-definition"
        feature=this.switchDefiName(feature)
        break;
      }
      case 7: {
        groupName = "g-settings"
        feature=this.switchSetthingName(feature)
        break;
      }
      case 8: {
        groupName = "g-tools"
        feature=this.switchToolstName(feature)
        break;
      }
      case 9: {
        groupName = "g-pos"
        feature=this.switchPOSName(feature)
        break;
      }
    }
   return {groupName,feature}
  }
  
  switchSalesName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-create-sales-invoice"
        break;
      }
      case 2: {
        f = "f-create-offer-invoice"
        break;
      }
      case 3: {
        f = "f-create-sales-invoice-refund"
        break;
      }
      case 4: {
        f = "f-create-damage-invoice"
        break;
      }
      case 5: {
        f = "f-transfer-item-branche"
        break;
      }
      case 6: {
        f = "f-transfer-item-cc"
        break;
      }
      case 7: {
        f = "f-create-damage-invoice-refund"
        break;
      }
    }
return f
  }
  switchPurchName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-create-purchases-invoice"
        break;
      }
      case 2: {
        f = "f-create-purchases-invoice-refund"
        break;
      }
      case 3: {
        f = "f-expenses-manage"
        break;
      }
      case 4: {
        f = "f-create-production-invoice"
        break;
      }
      case 5:{
        f="f-create-damage-expenses-refund"
        break;
      }
      
    }
return f
  }
  switchAccName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-accounts-tree-manage"
        break;
      }
      case 2: {
        f = "f-receive-recipts-manage"
        break;
      }
      case 3: {
        f = "f-payment-recipts-manage"
        break;
      }
      case 4: {
        f = "f-deposit-recipts-manage"
        break;
      }
      case 5: {
        f = "f-daily-recipts-manage"
        break;
      }
      case 6: {
        f = "f-advanced-daily-recipts-manage"
        break;
      }
      
      case 7: {
        f = "f-recipt-documents-manage"
        break;
      }
      case 8: {
        f = "f-payment-documents-manage"
        break;
      }
      case 9: {
        f = "f-creat-depreciation-asset"
        break;
      }
      case 10: {
        f = "f-assets-depreciation-manage"
        break;
      }
      case 11:{
        f="f-manage-delivery-apps"
      }
    }
return f
  }
  switchReportName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-bills-history"
        break;
      }
      case 2: {
        f = "f-production"
        break;
      }
      case 3: {
        f = "f-sold-items"
        break;
      }
      case 4: {
        f = "f-credit"
        break;
      }
      case 5: {
        f = "f-vat"
        break;
      }
      case 6: {
        f = "f-vat-on-purchases"
        break;
      }
      case 7: {
        f = "f-vat-on-sales"
        break;
      }
      case 8: {
        f = "f-inventory"
        break;
      }
    
      
      case 9: {
        f = "f-supplier-statement"
        break;
      }
      case 10: {
        f = "f-customer-statement"
        break;
      }
      case 11: {
        f = "f-item-history"
        break;
      }
      
      case 12: {
        f = "f-summary"
        break;
      }
      case 13: {
        f = "f-profit-balancer"
        break;
      }
      case 14: {
        f = "f-profit-balancer-branch"
        break;
      }
      
      case 15: {
        f = "f-profit-balancer-cc"
        break;
      }
      case 16: {
        f = "f-shifts"
        break;
      }
      case 17: {
        f = "f-tobacco-vat-report"
        break;
      }
      case 18: {
        f =  "f-change-delivering -status"
        break;
      }
      case 19: {
        f = "f-cc-report"
        break;
      }
      case 20: {
        f = "f-view-statics"
        break;
      }
     
    }
return f
  }
  switchDefiName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-item-groups-management"
        break;
      }
      case 2: {
        f = "f-items-manage"
        break;
      }
      case 3: {
        f = "f-services-manage"
        break;
      }
      case 4: {
        f = "f-add-table"
        break;
      }
      case 5: {
        f = "f-suppliers-manage"
        break;
      }
      case 6: {
        f = "f-customers-manage"
        break;
      }
      case 7: {
        f = "f-accounts-manage"
        break;
      }
      case 8: {
        f = "f-branches-manage"
        break;
      }
      
      case 9: {
        f = "f-cost-hierarchy-manage"
        break;
      }
      case 11: {
        f = "f-printer-settings-manage"
        break;
      }
      case 10: {
        f = "f-discount-management"
        break;
      }
      case 12: {
        f = "f-cc-manage"
        break;
      }
    }
return f
  }
  switchStatementName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-create-entry-statement"
        break;
      }
      case 2: {
        f = "f-statements-List"
        break;
      }
      case 3: {
        f = "f-create-exit-permission"
        break;
      }
    }
  //  console.log(f)
return f
  }
  switchToolstName(feature){
    let f:any
    switch (feature){
      case 1: {
        f = "f-barcode-generator"
        break;
      }
    }
return f
  }

switchSetthingName(feature){
  let f:any
  switch (feature){
    case 1: {
      f = "f-user-management"
      break;
    }
    case 2: {
      f = "f-backup"
      break;
    }
    case 3: {
      f = "f-adjust-entity-logo"
      break;
    }
    case 4:{
      f="f-manage-discount-limit"
      break;
    }
    case 5:{
      f="f-manage-tobacco-vat"
      break;
    }
  }
return f
}
switchPOSName(feature){
  let f:any
  switch (feature){
    case 1: {
      f = "f-working-on-pos"
      break;
    }
    case 2: {
      f = "f-shift-balance"
      break;
    }
    
  }
return f
}

getFirstFeatureActive(groupname:any){
  groupname=this.switchGroupName(groupname,null).groupName
  let g=this.authService.userInStorage.value.groups
  //console.log(g,'gggggggggg')
  let f=null
  g.forEach(e =>{
    if(e.groupCode==groupname){
        e.features.forEach(f1=>{
          console.log()
          if(f1.isActive&&f==null)
          f=f1.featureCode
          console.log(f)
        })
    }
  })
return f
}
getGroups(p,isbundle?){
  let groups:PermissionsUser[]=[{"id":1,"isActive":false,"groupCode":"g-sales","features":[{"id":1,"name":"Create Sales Invoices","arabicName":"إنشاء فاتورة مبيعات","description":"","featureCode":"f-create-sales-invoice","isActive":true},{"id":28,"name":"Create Offers","arabicName":"إنشاء عرض","description":"","featureCode":"f-create-offer-invoice","isActive":true},{"id":29,"name":"Create Sales Invoice Refund","arabicName":"إنشاء فاتورة رجيع للمبيعات","description":"","featureCode":"f-create-sales-invoice-refund","isActive":true},
  {"id":30,"name":"Create Damage Invoice ","arabicName":"إنشاء فاتورة صرف أصناف","description":"","featureCode":"f-create-damage-invoice","isActive":true}
  ,{"id":31,"name":"Transfer Item Between Branches","arabicName":"تحويل الأصناف بين الأفرع","description":"","featureCode":"f-transfer-item-branche","isActive":true},
  {"id":32,"name":"Transfer Item From Cost Center","arabicName":"تحويل الأصناف من مراكز التكلفة","description":"","featureCode":"f-transfer-item-cc","isActive":true},
  {"id":33,"name":"Create Damage Invoice Refund","arabicName":"إنشاء فاتورة رجيع صرف الأصناف","description":"","featureCode":"f-create-damage-invoice-refund","isActive":true}],"name":"Sales","arabicName":"المبيعات"},
  {"id":2,"isActive":false,"groupCode":"g-purchases","features":[{"id":34,"name":"Create Purchases Invoice","arabicName":"إنشاء فاتورة مشتريات","description":"","featureCode":"f-create-purchases-invoice","isActive":true},
  {"id":35,"name":"Create Purchases Invoice Refund","arabicName":"إنشاء فاتورة رجيع مشتريات","description":"","featureCode":"f-create-purchases-invoice-refund","isActive":true},{"id":36,"name":"Create Expense Invoice Refund","arabicName":"إنشاء فاتورة رجيع مصروفات","description":"","featureCode":"f-create-damage-expenses-refund","isActive":true},{"id":37,"name":"Create Production Invoice","arabicName":"إنشاء فاتورة إنتاج","description":"","featureCode":"f-create-production-invoice","isActive":true},{"id":39,"name":" Expenses Management","arabicName":"ادارة المصروفات","description":" ","featureCode":"f-expenses-manage","isActive":true}],"name":"Purchases","arabicName":"المشتريات"},{"id":3,"isActive":false,"groupCode":"g-accounting","features":[{"id":40,"name":"Receive Recipts Management","arabicName":" ادارة قيود مقبوضات\r\n","description":" ","featureCode":"f-receive-recipts-manage","isActive":true},{"id":41,"name":"Payment Recipts Management","arabicName":"  ادارة قيود مدفوعات\r\n","description":"","featureCode":"f-payment-recipts-manage","isActive":true},{"id":42,"name":"Deposit Recipts Management","arabicName":"إدارة قيود الإيداع و السحب","description":"","featureCode":"f-deposit-recipts-manage","isActive":true},{"id":43,"name":"Daily Recipts Management","arabicName":"إدارة قيود اليومية","description":"","featureCode":"f-daily-recipts-manage","isActive":true},
  
  {"id":43,"name":"Daily Recipts Management","arabicName":"إدارة تطبيقات التوصيل","description":"","featureCode":"f-manage-delivery-apps","isActive":true}
  
  ,{"id":44,"name":"Advanced Daily Recipts Management","arabicName":"إدارة القيود اليومية المتقدمة","description":"","featureCode":"f-advanced-daily-recipts-manage","isActive":true},{"id":45,"name":"Recipt Document Management","arabicName":"إدارة سند القبض","description":"","featureCode":"f-recipt-documents-manage","isActive":true},{"id":45,"name":"Payment Document Management","arabicName":"إدارة سند الدفع","description":"","featureCode":"f-payment-documents-manage","isActive":true},{"id":46,"name":"Add Depreciation Asset","arabicName":"إنشاء أصل قابل للاهتلاك","description":"","featureCode":"f-creat-depreciation-asset","isActive":true},{"id":47,"name":"Assets With Depretciation Management","arabicName":"إدارة الأصول القابلة للاهتلاك","description":"","featureCode":"f-assets-depreciation-manage","isActive":true},{"id":50,"name":"Accounts Tree","arabicName":"شجرة الحسابات","description":"","featureCode":"f-accounts-tree-manage","isActive":true}],"name":"Accounting","arabicName":"المحاسبة"},{"id":4,"isActive":false,"groupCode":"g-statements","features":[{"id":27,"name":"Create Exit Persmission","arabicName":"انشاء اذن خروج ","description":" ","featureCode":"f-create-exit-permission","isActive":true},{"id":48,"name":"Create Entry Statement","arabicName":"إنشاء تصريح دخول","description":"","featureCode":"f-create-entry-statement","isActive":true},{"id":49,"name":"Statements List","arabicName":"استعراض التصاريح والأذونات","description":" ","featureCode":"f-statements-List","isActive":true}],"name":"Statements","arabicName":"التصاريح"},{"id":5,"isActive":false,"groupCode":"g-definition","features":[{"id":2,"name":"Customers Management","arabicName":"إدارة العملاء","description":" ","featureCode":"f-customers-manage","isActive":true},{"id":3,"name":"Accounts Management","arabicName":"إدارة الحسابات","description":" ","featureCode":"f-accounts-manage","isActive":true},{"id":4,"name":"Branches Management","arabicName":"إدارة الفروع","description":" ","featureCode":"f-branches-manage","isActive":true},{"id":5,"name":"Cost Centers Management","arabicName":"إدارة مراكز التكلفة","description":" ","featureCode":"f-cc-manage","isActive":true},{"id":6,"name":"Cost Hierarchy Management","arabicName":"إدارة هيكلية المصروفات","description":" ","featureCode":"f-cost-hierarchy-manage","isActive":true},{"id":7,"name":"Services Management","arabicName":"إدارة الخدمات","description":" ","featureCode":"f-services-manage","isActive":true},{"id":9,"name":"Discounts Management","arabicName":"ادارة الخصومات","description":" ","featureCode":"f-discount-management","isActive":true},{"id":8,"name":"Printer Settings Management","arabicName":"إدارة اعدادات الطابعة","description":" ","featureCode":"f-printer-settings-manage","isActive":true},{"id":12,"name":"Suppliers Management","arabicName":"إدارة الموردين","description":" ","featureCode":"f-suppliers-manage","isActive":true},{"id":26,"name":"Items Management","arabicName":"إدارة الأصناف","description":" ","featureCode":"f-items-manage","isActive":true},{"id":38,"name":" Item Groups Management","arabicName":"إدارة مجموعات الأصناف","description":" ","featureCode":"f-item-groups-management","isActive":true},{"id":53,"name":"Add Table","arabicName":"إضافة طاولة","description":" ","featureCode":"f-add-table","isActive":true}],"name":"Definition","arabicName":"التأسيس"}
  ,{"id":6,"isActive":false,"groupCode":"g-reports","features":
  [{"id":8,"name":"change delivring","arabicName":"تغيير حالة التسليم","description":" ","featureCode":"f-change-delivering -status","isActive":true},{"id":9,"name":"Bills History","arabicName":"سجل الفواتير","description":" ","featureCode":"f-bills-history","isActive":true},{"id":10,"name":"Porduction","arabicName":"الإنتاج","description":" ","featureCode":"f-production","isActive":true},{"id":11,"name":"Sold Items","arabicName":"القطع المباعة","description":" ","featureCode":"f-sold-items","isActive":true},{"id":13,"name":"Credit","arabicName":"الآجل","description":" ","featureCode":"f-credit","isActive":true},{"id":14,"name":"Inventory","arabicName":"الجرد","description":" ","featureCode":"f-inventory","isActive":true},{"id":15,"name":"Supplier Account Statement","arabicName":"كشف حساب مورد","description":" ","featureCode":"f-supplier-statement","isActive":true},{"id":16,"name":"Customer Account Statement","arabicName":"كشف حساب عميل","description":" ","featureCode":"f-customer-statement","isActive":true},{"id":17,"name":"Item History ","arabicName":"حركة الصنف","description":" ","featureCode":"f-item-history","isActive":true},{"id":18,"name":"Summary ","arabicName":"الملخص","description":" ","featureCode":"f-summary","isActive":true},{"id":19,"name":"Profit  Balancer","arabicName":"ميزان الربح والخسارة للمنشأة","description":" ","featureCode":"f-profit-balancer","isActive":true},{"id":20,"name":"Profit Balancer For Branch","arabicName":"ميزان الربح والخسارة للفرع","description":" ","featureCode":"f-profit-balancer-branch","isActive":true},{"id":21,"name":"Profit Balancer For Cost Center","arabicName":"ميزان الربح والخسارة لمركز التكلفة","description":" ","featureCode":"f-profit-balancer-cc","isActive":true},{"id":24,"name":"VAT","arabicName":"الضريبة","description":" ","featureCode":"f-vat","isActive":true},{"id":26,"name":"VAT-On-Purch","arabicName":"ضريبة القيمة المضافة على المشتريات","description":" ","featureCode":"f-vat-on-purchases","isActive":true},{"id":27,"name":"VAT-On-Sales","arabicName":"ضريبة القيمة المضافة على الايرادات","description":" ","featureCode":"f-vat-on-sales","isActive":true},{"id":25,"name":"Shift","arabicName":"ادارة الوارديات","description":" ","featureCode":"f-shifts","isActive":true},{"id":31,"name":"Tobacco Vat Rreport","arabicName":"ملخص ضريبة التبغ","description":" ","featureCode":"f-tobacco-vat-report","isActive":true},{"id":32,"name":"CC Rreport","arabicName":"تقرير مركز التكلفة","description":" ","featureCode":"f-cc-report","isActive":true},{"id":33,"name":"statics","arabicName":"الاحصائيات","description":" ","featureCode":"f-view-statics","isActive":true}],"name":"Reports","arabicName":"التقارير"},{"id":7,"isActive":false,"groupCode":"g-settings","features":[{"id":22,"name":"User Management","arabicName":"التحكم بالمستخدمين","description":" ","featureCode":"users.manage","isActive":true},{"id":23,"name":"User View","arabicName":"مشاهدة المستخدمين","description":" ","featureCode":"users.view","isActive":true},{"id":24,"name":"ٌRoles Manage","arabicName":" التحكم بالصلاحيات","description":" ","featureCode":"roles.manage","isActive":true},{"id":25,"name":"ٌRoles View","arabicName":" مشاهدة الصلاحيات","description":" ","featureCode":"roles.view","isActive":true},{"id":26,"name":"ٌRoles Assign","arabicName":"اسناد صلاحية","description":" ","featureCode":"roles.assign","isActive":true},{"id":27,"name":"ٌDiscount","arabicName":"امكانية الخصم","description":" ","featureCode":"canDiscount","isActive":true},{"id":30,"name":"manage discount limit","arabicName":"التحكم بقيمة الخصم","description":" ","featureCode":"f-manage-discount-limit","isActive":true},{"id":30,"name":"Tobacco Vat","arabicName":"اضافة ضريبة التبغ","description":" ","featureCode":"f-manage-tobacco-vat","isActive":true},{"id":28,"name":"Database Backup","arabicName":"النسخ الاحتياطي","description":" ","featureCode":"f-backup","isActive":true},{"id":29,"name":"Adjust Entity LOGO","arabicName":"تغيير شعار المؤسسة","description":" ","featureCode":"f-adjust-entity-logo","isActive":true}],"name":"Settings","arabicName":"الإعدادات"},{"id":8,"isActive":false,"groupCode":"g-tools","features":[{"id":51,"name":"Barcode Generator ","arabicName":"مولد الباركود","description":" ","featureCode":"f-barcode-generator","isActive":true}],"name":"Tools","arabicName":"الأدوات"},{"id":9,"isActive":false,"groupCode":"g-pos","features":[{"id":52,"name":"Working on POS","arabicName":"العمل على نقطة البيع","description":" ","featureCode":"f-working-on-pos","isActive":true},{"id":53,"name":"","arabicName":"استعراض التفاصيل النقدية للملخص","description":" ","featureCode":"f-shift-balance","isActive":true}],"name":"POS","arabicName":"نقطة بيع"}]
  
 

 groups.forEach(element => {

        element.features.forEach((f,index) =>{

          if(p.includes(f.featureCode)){
             f.isActive=true
             element.isActive=true
          }
         
          else if(isbundle){
            element.features.splice(index,1) 
          }else
          f.isActive=false
        })  
  });
    
  return groups
}
}