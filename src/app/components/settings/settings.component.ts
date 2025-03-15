// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { fadeInOut } from '../../services/animations';
import { BootstrapTabDirective } from "../../directives/bootstrap-tab.directive";
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { SettingsService } from "../../services/settings.service";
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AuthService } from '../../services/auth.service';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { UsersManagementComponent } from '../controls/users-management.component';
import { ConfigurationService } from '../../services/configuration.service';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    animations: [fadeInOut]
})
export class SettingsComponent implements OnInit, OnDestroy {

    isProfileActivated = true;
    isPreferencesActivated = false;
    isUsersActivated = false;
    isRolesActivated = false;
    isVatSettingActivated = false;
    deleteLogoDone = false;
    fragmentSubscription: any;
    logoPath;
    imgURL;
    uploadDone: boolean;
    fileToUpload:any = null;
    feature:boolean=false

    readonly profileTab = "profile";
    readonly preferencesTab = "preferences";
    readonly usersTab = "users";
    readonly rolesTab = "roles";
    readonly vatSettingTab = "vatSetting";
    features:boolean[]=[false,false,false]
    versionCode: string;

    @ViewChild('usersmanage')
    usersmanage: UsersManagementComponent;

    @ViewChild("tab")
    tab: BootstrapTabDirective;
    isVatEnable: boolean = false;
    vatAmount: number;
    discountLimit: number;
    gT = (key: string) => this.translationService.getTranslation(key);
    user1:any
    isSuperAdmin: boolean=false;

    constructor(private authService:AuthService, private CheckPermissions:CheckPermissionsService,private route: ActivatedRoute, private accountService: AccountService,private Authservice:AuthService,
        private settingsService: SettingsService,
         private alertService: AlertService, private translationService: AppTranslationService,
         public config:ConfigurationService) { }
         ngOnInit() {
           let lan=this.config.language
           const layout = 
          /* Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
           layout.forEach(l => {
           l.style.display = 'none';
       
       });*/
        this.isSuperAdmin=this.authService.userInStorage.value.roles.includes('superadmin')
        this.authService.userInStorage.subscribe(user =>{
            if(user)
            this.features.forEach((e,index) =>{
                this.features[index]=this.CheckPermissions.checkGroup(7,index+1)
            })
           })    
      //  this.ReloadData()
      /* else
     */   this.authService.userInStorage.subscribe(user =>{

            if( this.authService.userInStorage.value&&this.authService.loadingData.value==false){
           /*  this.accountService
             .getUser(user.id)
             .subscribe(user1 =>(
              ( this.authService.loggedInUser.next(user1)
             ,// console.log(this.authService.loggedInUser.value),
             */this.features.forEach((e,index) =>{
                this.features[index]=this.CheckPermissions.checkGroup(7,index+1)
             //   console.log(this.features)
              })
            }
        })
          //   )  )
             //  console.log(user)
            
        
         


        this.fragmentSubscription = this.route.fragment.subscribe(anchor => this.showContent(anchor));
        this.settingsService.getCurrentVersionCode().subscribe(cv => {
            //console.log(cv);
            this.versionCode = cv;
        });
        this.settingsService.getSetting().subscribe(res => {
            this.isVatEnable = res.isVatEnable;
            this.vatAmount = res.vatAmount;
            this.discountLimit = res.discountLimit;
            this.logoPath = res.logoPath;
        })

    }


    ngOnDestroy() {
        this.fragmentSubscription.unsubscribe();
    }

    showContent(anchor: string) {
        if ((this.isFragmentEquals(anchor, this.usersTab) && !this.canViewUsers) ||
            (this.isFragmentEquals(anchor, this.rolesTab) && !this.canViewRoles))
            return;

        this.tab.show(`#${anchor || this.profileTab}Tab`);
    }

    handleFileChange(e: MouseEvent) {
        let reader = new FileReader();
        if (event.target['files'] && event.target['files'].length > 0) {
            const file = new FormData();
            file.append('files', event.target['files'][0]);
            file.append('fileName', event.target['files'][0].name);
            this.preview(event.target['files']);
            this.fileToUpload = file;
        }
    }

    preview(files) {
        if (files && files[0]) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = e => this.imgURL = reader.result;

            reader.readAsDataURL(file);
        }
    }

    changeLogo() {
        if (this.fileToUpload) {
            this.settingsService.uploadLogo(this.fileToUpload).subscribe(res => {
                this.uploadDone = true;
                this.deleteLogoDone = false;
            });
        }
    }

    deleteLogo(){
        this.settingsService.deleteLogo().subscribe(
            res=>{
                this.uploadDone = false;
                this.deleteLogoDone = true;
                this.logoPath = '';
                this.imgURL = '';
                this.fileToUpload = null;
            }
        )
    }


    isFragmentEquals(fragment1: string, fragment2: string) {

        if (fragment1 == null)
            fragment1 = "";

        if (fragment2 == null)
            fragment2 = "";

        return fragment1.toLowerCase() == fragment2.toLowerCase();
    }


    onShowTab(event) {
        let activeTab = event.target.hash.split("#", 2).pop();
       // this.usersmanage.loadData()
        this.isProfileActivated = activeTab == this.profileTab;
        this.isPreferencesActivated = activeTab == this.preferencesTab;
        this.isUsersActivated = activeTab == this.usersTab;
        this.isRolesActivated = activeTab == this.rolesTab;
        this.isVatSettingActivated = activeTab == this.vatSettingTab
    }
    get canViewUsers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }

    get canViewUpdates() {
        //return this.accountService.userHasPermission(Permission.viewUpdatesPermission);
        return true;
    }

    get canManageVat() {
        let perm = this.accountService.userHasPermission(
            Permission.manageVatPermission
        );
        return perm
    }
     checkVat(check){
        console.log(check)
        this.alertService.showDialog(
           check==true?'بتفعيلك للضريبة ستقوم بتطبيق ضريبة القيمة المضافة على جميع الاصناف   ': 'بتعطيلك للضريبة سيتم تحويل جميع الاصناف الى غير مسجلين في الضريبة ',
           DialogType.confirm,
            () => this.changeSbillSetting(),
            () => this.isVatEnable=!this.isVatEnable
           
        );
     }
    changeSbillSetting() {
        this.settingsService.setVatEnableSetting({
            isVatEnable: this.isVatEnable,
            vatAmount: this.vatAmount,
            discountLimit: this.discountLimit
        }).subscribe(
            res => {
                this.isVatEnable = res;
                this.alertService.showMessage(
                    this.gT("shared.OperationSucceded"),
                    this.gT("shared.ChangesSaved") +
                    this.gT("shared.Successfully"),
                    MessageSeverity.success
                );
            }
        )
    }
}

 