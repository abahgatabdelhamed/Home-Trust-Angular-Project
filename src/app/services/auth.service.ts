// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LocalStoreManager } from './local-store-manager.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-Keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { LoginResponse, IdToken } from '../models/login-response.model';
import { User } from '../models/user.model';
import { Permission, PermissionNames } from '../models/permission.model';
import { BehaviorSubject } from 'rxjs';
import { PermissionsUser } from '../models/PermissionsUser.model';
import { SettingsService } from './settings.service';

import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class AuthService {
    loggedInUser = new BehaviorSubject<User>(null);
    userInStorage=new BehaviorSubject<User>(null)
    loadingData=new BehaviorSubject<boolean>(false)
    
    public get loginUrl() { return this.configurations.loginUrl; }
    public get homeUrl() { return this.configurations.homeUrl; }

    public loginRedirectUrl: string;
    public logoutRedirectUrl: string;

    public reLoginDelegate: () => void;

    private previousIsLoggedInCheck = false;
    private _loginStatus = new Subject<boolean>();


    constructor(private router: Router, 
   
        private configurations: ConfigurationService, private endpointFactory: EndpointFactory, private localStorage: LocalStoreManager) {
        this.initializeLoginStatus();
    }
   

    private initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.reevaluateLoginStatus();
        });
    }


    gotoPage(page: string, preserveParams = true) {

        let navigationExtras: NavigationExtras = {
            queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
        };


        this.router.navigate([page], navigationExtras);
    }


    redirectLoginUser() {
    
        let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;


        let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

        let navigationExtras: NavigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: "merge"
        };

        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }


    redirectLogoutUser() {
        this.logout()
        let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;

        this.router.navigate([redirect]);
    }


    redirectForLogin() {
        this.loginRedirectUrl = this.router.url;
        this.router.navigate([this.loginUrl]);
    }


    reLogin() {

        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.userInStorage.next(null)
        this.loggedInUser.next(null)
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }


    refreshLogin() {
        return this.endpointFactory.getRefreshLoginEndpoint<LoginResponse>()
            .map(response => this.processLoginResponse(response, this.rememberMe,this.userPassword));
    }


    login(userName: string, password: string, rememberMe?: boolean,isRefresh?:boolean) {

        if (this.isLoggedIn &&!isRefresh)
            this.logout();
    
        return this.endpointFactory.getLoginEndpoint<LoginResponse>(userName, password)
            .map(response => this.processLoginResponse(response, rememberMe,password));
    }


    private processLoginResponse(response: LoginResponse, rememberMe: boolean,Password?) {

        let accessToken = response.access_token;

        if (accessToken == null)
            throw new Error("Received accessToken was empty");

        let idToken = response.id_token;
        let refreshToken = response.refresh_token || this.refreshToken;
        let expiresIn = response.expires_in;

        let tokenExpiryDate = new Date();
         tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

        let accessTokenExpiry = tokenExpiryDate;
        //accessTokenExpiry.setFullYear(2010)
     
        let jwtHelper = new JwtHelper();
        let decodedIdToken = <IdToken>jwtHelper.decodeToken(response.id_token);
     //   console.log('jwt =',decodedIdToken,decodedIdToken.discountLimitValue)
        let groups:PermissionsUser[]
        let permissions: any[]
        if(  (decodedIdToken.role.includes('superadmin'))){
          //  console.log('ooooooooooooooooo')
             groups=this.getGroups([])
             permissions=[
             "users.view",
             "users.manage",
             "roles.view",
             "roles.manage",
             "roles.assign",
             "canDiscount"]
        }else{
             permissions= Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];
            groups=this.getGroups(decodedIdToken.permission)
           
        }
        if (!this.isLoggedIn)
            this.configurations.import(decodedIdToken.configuration);
          
        
        let user = new User(
            decodedIdToken.sub,
            decodedIdToken.name,
            decodedIdToken.fullname,
            decodedIdToken.email,
            decodedIdToken.jobtitle,
            decodedIdToken.phone,
            Array.isArray(decodedIdToken.role) ? decodedIdToken.role : [decodedIdToken.role],
            permissions,
            groups,
            null,
            decodedIdToken.discountLimitValue,
            Password
            
            
            );
        user.isEnabled = true;
      //  console.log(groups)
       console.log(accessTokenExpiry)
       user.groups=groups
       user.discountLimitValue=decodedIdToken.discountLimitValue
       user.Password=Password
       user.RememberMe=rememberMe
       console.log(user,'ssssssssssssssss')
        this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry, rememberMe,Password);
      
        this.reevaluateLoginStatus(user);
        console.log(user,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        this.userInStorage.next(user)

     
        return user;
    }

    public saveClientId(id){
         localStorage.setItem('ClientId',id)
    }
    public getClientId(){
        return localStorage.getItem('ClientId')
    }
    private saveUserDetails(user: User, permissions: any[], accessToken: string, idToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean,password?) {

        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(idToken, DBkeys.ID_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
            this.localStorage.savePermanentData(password, DBkeys.USER_Password);
          
            
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(idToken, DBkeys.ID_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
            this.localStorage.savePermanentData(password, DBkeys.USER_Password);
        
        }

        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }



    logout(): void {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.ID_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.localStorage.deleteData(DBkeys.USER_Password);
      //  window.localStorage.removeItem('password')
        this.userInStorage.next(null)
        this.loggedInUser.next(null)
        this.loadingData.next(false)
        this.configurations.clearLocalChanges();

        this.reevaluateLoginStatus();
    }


    private reevaluateLoginStatus(currentUser?: User) {

        let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        let isLoggedIn = user != null;

        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout(() => {
                this._loginStatus.next(isLoggedIn);
            });
        }

        this.previousIsLoggedInCheck = isLoggedIn;
    }


    getLoginStatusEvent(): Observable<boolean> {
        return this._loginStatus.asObservable();
    }


    get currentUser(): User {

        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        this.reevaluateLoginStatus(user);
       // console.log(user)
    //   user.Password=this.userPassword
        this.userInStorage.next(user)
      //  this.userInStorage.value.Password=this.userPassword;
       /*  this.accountservice.getUserEndpoint(user.id).subscribe({next:(user:User)=>{
           console.log(user)
             this.loggedInUser.next(user)
         }})*/
      //  this.loggedInUser.next(user)
       // console.log(user)
        
        return user;
    }

    get userPassword(): string {
        return this.localStorage.getData(DBkeys.USER_Password) || null;
    }
    get userPermissions(): any[] {
        return this.localStorage.getDataObject<any[]>(DBkeys.USER_PERMISSIONS) || [];
    }

    get accessToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }

    get accessTokenExpiryDate(): Date {

        this.reevaluateLoginStatus();
        return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
    }

    get isSessionExpired(): boolean {

        if (this.accessTokenExpiryDate == null) {
            
            return true;
        }
          return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
    }


    get idToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ID_TOKEN);
    }

    get refreshToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }

    get isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    isRegistered() {
        return this.endpointFactory.IsRegistered();
    }

    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
    }
    getGroups(p){
        let groups:PermissionsUser[]=[{"id":1,"isActive":false,"groupCode":"g-sales","features":[{"id":1,"name":"Create Sales Invoices","arabicName":"إنشاء فاتورة مبيعات","description":"","featureCode":"f-create-sales-invoice","isActive":true},{"id":28,"name":"Create Offers","arabicName":"إنشاء عرض","description":"","featureCode":"f-create-offer-invoice","isActive":true},{"id":29,"name":"Create Sales Invoice Refund","arabicName":"إنشاء فاتورة رجيع للمبيعات","description":"","featureCode":"f-create-sales-invoice-refund","isActive":true},{"id":30,"name":"Create Damage Invoice ","arabicName":"إنشاء فاتورة صرف أصناف","description":"","featureCode":"f-create-damage-invoice","isActive":true},{"id":31,"name":"Transfer Item Between Branches","arabicName":"تحويل الأصناف بين الأفرع","description":"","featureCode":"f-transfer-item-branche","isActive":true},{"id":32,"name":"Transfer Item From Cost Center","arabicName":"تحويل الأصناف من مراكز التكلفة","description":"","featureCode":"f-transfer-item-cc","isActive":true},{"id":33,"name":"Create Damage Invoice Refund","arabicName":"إنشاء فاتورة رجيع صرف الأصناف","description":"","featureCode":"f-create-damage-invoice-refund","isActive":true}]
        ,"name":"Sales","arabicName":"المبيعات"},{"id":2,"isActive":false,"groupCode":"g-purchases","features":[{"id":34,"name":"Create Purchases Invoice","arabicName":"إنشاء فاتورة مشتريات","description":"","featureCode":"f-create-purchases-invoice","isActive":true},{"id":35,"name":"Create Purchases Invoice Refund","arabicName":"إنشاء فاتورة رجيع مشتريات","description":"","featureCode":"f-create-purchases-invoice-refund","isActive":true},{"id":36,"name":"Create Expense Invoice Refund","arabicName":"إنشاء فاتورة رجيع مصروفات","description":"","featureCode":"f-create-damage-expenses-refund","isActive":true},{"id":37,"name":"Create Production Invoice","arabicName":"إنشاء فاتورة إنتاج","description":"","featureCode":"f-create-production-invoice","isActive":true},{"id":39,"name":" Expenses Management","arabicName":"ادارة المصروفات","description":" ","featureCode":"f-expenses-manage","isActive":true}],"name":"Purchases","arabicName":"المشتريات"},{"id":3,"isActive":false,"groupCode":"g-accounting","features":[{"id":40,"name":"Receive Recipts Management","arabicName":" ادارة قيود مقبوضات\r\n","description":" ","featureCode":"f-receive-recipts-manage","isActive":true},{"id":41,"name":"Payment Recipts Management","arabicName":"  ادارة قيود مدفوعات\r\n","description":"","featureCode":"f-payment-recipts-manage","isActive":true},{"id":42,"name":"Deposit Recipts Management","arabicName":"إدارة قيود الإيداع و السحب","description":"","featureCode":"f-deposit-recipts-manage","isActive":true},{"id":43,"name":"Daily Recipts Management","arabicName":"إدارة قيود اليومية","description":"","featureCode":"f-daily-recipts-manage","isActive":true},{"id":44,"name":"Advanced Daily Recipts Management","arabicName":"إدارة القيود اليومية المتقدمة","description":"","featureCode":"f-advanced-daily-recipts-manage","isActive":true},
        {"id":43,"name":"Daily Recipts Management","arabicName":"إدارة تطبيقات التوصيل","description":"","featureCode":"f-manage-delivery-apps","isActive":true}
  
        ,{"id":45,"name":"Recipt Document Management","arabicName":"إدارة سند القبض","description":"","featureCode":"f-recipt-documents-manage","isActive":true},{"id":45,"name":"Payment Document Management","arabicName":"إدارة سند الدفع","description":"","featureCode":"f-payment-documents-manage","isActive":true},{"id":46,"name":"Add Depreciation Asset","arabicName":"إنشاء أصل قابل للاهتلاك","description":"","featureCode":"f-creat-depreciation-asset","isActive":true},{"id":47,"name":"Assets With Depretciation Management","arabicName":"إدارة الأصول القابلة للاهتلاك","description":"","featureCode":"f-assets-depreciation-manage","isActive":true},{"id":50,"name":"Accounts Tree","arabicName":"شجرة الحسابات","description":"","featureCode":"f-accounts-tree-manage","isActive":true}],"name":"Accounting","arabicName":"المحاسبة"},{"id":4,"isActive":false,"groupCode":"g-statements","features":[{"id":27,"name":"Create Exit Persmission","arabicName":"انشاء اذن خروج ","description":" ","featureCode":"f-create-exit-permission","isActive":true},{"id":48,"name":"Create Entry Statement","arabicName":"إنشاء تصريح دخول","description":"","featureCode":"f-create-entry-statement","isActive":true},{"id":49,"name":"Statements List","arabicName":"استعراض التصاريح والأذونات","description":" ","featureCode":"f-statements-List","isActive":true}],"name":"Statements","arabicName":"التصاريح"},{"id":5,"isActive":false,"groupCode":"g-definition","features":[{"id":2,"name":"Customers Management","arabicName":"إدارة العملاء","description":" ","featureCode":"f-customers-manage","isActive":true},{"id":3,"name":"Accounts Management","arabicName":"إدارة الحسابات","description":" ","featureCode":"f-accounts-manage","isActive":true},{"id":4,"name":"Branches Management","arabicName":"إدارة الفروع","description":" ","featureCode":"f-branches-manage","isActive":true},{"id":5,"name":"Cost Centers Management","arabicName":"إدارة مراكز التكلفة","description":" ","featureCode":"f-cc-manage","isActive":true},{"id":6,"name":"Cost Hierarchy Management","arabicName":"إدارة هيكلية المصروفات","description":" ","featureCode":"f-cost-hierarchy-manage","isActive":true},{"id":7,"name":"Services Management","arabicName":"إدارة الخدمات","description":" ","featureCode":"f-services-manage","isActive":true},
        {"id":9,"name":"Discounts Management","arabicName":"ادارة الخصومات","description":" ","featureCode":"f-discount-management","isActive":true},
        {"id":8,"name":"Printer Settings Management","arabicName":"إدارة اعدادات الطابعة","description":" ","featureCode":"f-printer-settings-manage","isActive":true},{"id":12,"name":"Suppliers Management","arabicName":"إدارة الموردين","description":" ","featureCode":"f-suppliers-manage","isActive":true},{"id":26,"name":"Items Management","arabicName":"إدارة الأصناف","description":" ","featureCode":"f-items-manage","isActive":true},{"id":38,"name":" Item Groups Management","arabicName":"إدارة مجموعات الأصناف","description":" ","featureCode":"f-item-groups-management","isActive":true},{"id":53,"name":"Add Table","arabicName":"إضافة طاولة","description":" ","featureCode":"f-add-table","isActive":true}],"name":"Definition","arabicName":"التأسيس"},{"id":6,"isActive":false,"groupCode":"g-reports","features":[{"id":8,"name":"change delivring","arabicName":"تغيير حالة التسليم","description":" ","featureCode":"f-change-delivering -status","isActive":true},{"id":9,"name":"Bills History","arabicName":"سجل الفواتير","description":" ","featureCode":"f-bills-history","isActive":true},{"id":10,"name":"Porduction","arabicName":"الإنتاج","description":" ","featureCode":"f-production","isActive":true},{"id":11,"name":"Sold Items","arabicName":"القطع المباعة","description":" ","featureCode":"f-sold-items","isActive":true},{"id":13,"name":"Credit","arabicName":"الآجل","description":" ","featureCode":"f-credit","isActive":true},{"id":14,"name":"Inventory","arabicName":"الجرد","description":" ","featureCode":"f-inventory","isActive":true},{"id":15,"name":"Supplier Account Statement","arabicName":"كشف حساب مورد","description":" ","featureCode":"f-supplier-statement","isActive":true},{"id":16,"name":"Customer Account Statement","arabicName":"كشف حساب عميل","description":" ","featureCode":"f-customer-statement","isActive":true},{"id":17,"name":"Item History ","arabicName":"حركة الصنف","description":" ","featureCode":"f-item-history","isActive":true},{"id":18,"name":"Summary ","arabicName":"الملخص","description":" ","featureCode":"f-summary","isActive":true},{"id":19,"name":"Profit  Balancer","arabicName":"ميزان الربح والخسارة للمنشأة","description":" ","featureCode":"f-profit-balancer","isActive":true},{"id":20,"name":"Profit Balancer For Branch","arabicName":"ميزان الربح والخسارة للفرع","description":" ","featureCode":"f-profit-balancer-branch","isActive":true},{"id":21,"name":"Profit Balancer For Cost Center","arabicName":"ميزان الربح والخسارة لمركز التكلفة","description":" ","featureCode":"f-profit-balancer-cc","isActive":true},
        {"id":24,"name":"VAT","arabicName":"الضريبة","description":" ","featureCode":"f-vat","isActive":true},{"id":26,"name":"VAT-On-Purch","arabicName":"ضريبة القيمة المضافة على المشتريات","description":" ","featureCode":"f-vat-on-purchases","isActive":true},{"id":27,"name":"VAT-On-Sales","arabicName":"ضريبة القيمة المضافة على الايرادات","description":" ","featureCode":"f-vat-on-sales","isActive":true},{"id":25,"name":"Shift","arabicName":"ادارة الوارديات","description":" ","featureCode":"f-shifts","isActive":true},{"id":26,"name":"Tobacco Vat Rreport","arabicName":"ملخص ضريبة التبغ","description":" ","featureCode":"f-tobacco-vat-report","isActive":true},{"id":32,"name":"CC Rreport","arabicName":"تقرير مركز التكلفة","description":" ","featureCode":"f-cc-report","isActive":true},{"id":33,"name":"statics","arabicName":"الاحصائيات","description":" ","featureCode":"f-view-statics","isActive":true}],"name":"Reports","arabicName":"التقارير"},{"id":7,"isActive":false,"groupCode":"g-settings","features":[{"id":22,"name":"User Management","arabicName":"التحكم بالمستخدمين","description":" ","featureCode":"users.manage","isActive":true},{"id":23,"name":"User View","arabicName":"مشاهدة المستخدمين","description":" ","featureCode":"users.view","isActive":true},{"id":24,"name":"ٌRoles Manage","arabicName":" التحكم بالصلاحيات","description":" ","featureCode":"roles.manage","isActive":true},{"id":25,"name":"ٌRoles View","arabicName":" مشاهدة الصلاحيات","description":" ","featureCode":"roles.view","isActive":true},
        {"id":26,"name":"ٌRoles Assign","arabicName":"اسناد صلاحية","description":" ","featureCode":"roles.assign","isActive":true},{"id":27,"name":"ٌDiscount","arabicName":"امكانية الخصم","description":" ","featureCode":"canDiscount","isActive":true},{"id":30,"name":"manage discount limit","arabicName":"التحكم بقيمة الخصم","description":" ","featureCode":"f-manage-discount-limit","isActive":true},{"id":28,"name":"Database Backup","arabicName":"النسخ الاحتياطي","description":" ","featureCode":"f-backup","isActive":true},{"id":29,"name":"Adjust Entity LOGO","arabicName":"تغيير شعار المؤسسة","description":" ","featureCode":"f-adjust-entity-logo","isActive":true},{"id":30,"name":"Tobacco Vat","arabicName":"اضافة ضريبة التبغ","description":" ","featureCode":"f-manage-tobacco-vat","isActive":true}],"name":"Settings","arabicName":"الإعدادات"},{"id":8,"isActive":false,"groupCode":"g-tools","features":[{"id":51,"name":"Barcode Generator ","arabicName":"مولد الباركود","description":" ","featureCode":"f-barcode-generator","isActive":true}],"name":"Tools","arabicName":"الأدوات"},{"id":9,"isActive":false,"groupCode":"g-pos",
        "features":[{"id":52,"name":"Working on POS","arabicName":"العمل على نقطة البيع","description":" ","featureCode":"f-working-on-pos","isActive":true},{"id":53,"name":"","arabicName":"استعراض التفاصيل النقدية للملخص","description":" ","featureCode":"f-shift-balance","isActive":true}],"name":"POS","arabicName":"نقطة بيع"}]
    groups.forEach(element => {
              element.features.forEach(f =>{
                if(p.includes(f.featureCode) ){
                    f.isActive=true
                    element.isActive=true
               }
            
                else
                f.isActive=false
              })  
        });
        return groups
      }
            
}
