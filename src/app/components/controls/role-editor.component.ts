// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { ChangeDetectorRef, Component, OnChanges, OnDestroy, ViewChild } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { AppTranslationService } from '../../services/app-translation.service';
import { PermissionsUser } from '../../models/PermissionsUser.model';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'role-editor',
    templateUrl: './role-editor.component.html',
    styleUrls: ['./role-editor.component.css']
})
export class RoleEditorComponent implements  OnChanges{

    private isNewRole = false;
    private isSaving: boolean;
    private showValidationErrors: boolean = true;
    private editingRoleName: string;
    private roleEdit: Role = new Role();
    private allPermissions:any= [];
    private selectedValues: { [key: string]: boolean; } = {};
    public canSetPermissions:string[]=[]
    public formResetToggle = true;
    public canDiscount:boolean=false
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    gT = (key: string) => this.translationService.getTranslation(key);
   
    @ViewChild('f')
    private form;
    isSuperAdmin: any;



    constructor(private alertService: AlertService, private accountService: AccountService,
        private translationService:AppTranslationService,
        private changeDetectorRef: ChangeDetectorRef,
        private checkgroup:CheckPermissionsService,
        private auth :AuthService) {
    }

    
    private showErrorAlert(caption: string, message: string) {
     //   this.alertService.showMessage(caption, message, MessageSeverity.error);
    }
  ngOnChanges(): void {
    console.log('destroooooyyyy')
      this.changesCancelledCallback()
  }

    private save() {
        this.isSaving = true;
      //  this.alertService.startLoadingMessage(this.gT("shared.Saving"));

        this.roleEdit.featuresIds = this.getSelectedPermissions() ;
          console.log(this.roleEdit.permissions)
         if (this.isNewRole) {
            this.accountService.newRole(this.roleEdit).subscribe(role => this.saveSuccessHelper(role), error => this.saveFailedHelper(error));
        }
        else {
            this.accountService.updateRole(this.roleEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }




    private saveSuccessHelper(role?: Role) {
        if (role)
            Object.assign(this.roleEdit, role);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        if (this.isNewRole)
            this.alertService.showMessage("Success", `Role \"${this.roleEdit.name}\" was created successfully`, MessageSeverity.success);
        else
            this.alertService.showMessage("Success", `Changes to role \"${this.roleEdit.name}\" was saved successfully`, MessageSeverity.success);


        this.roleEdit = new Role();
        this.resetForm();


        if (!this.isNewRole && this.accountService.currentUser.roles.some(r => r == this.editingRoleName))
            this.refreshLoggedInUser();

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }


    private refreshLoggedInUser() {
        this.accountService.refreshLoggedInUser()
            .subscribe(user => { },
            error => {
              /*  this.alertService.resetStickyMessage();
                this.alertService.showStickyMessage("Refresh failed", "An error occured whilst refreshing logged in user information from the server", MessageSeverity.error, error);
            */ });
    }



    private saveFailedHelper(error: any) {
        this.isSaving = false;
       /* this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
*/
        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }


    private cancel() {
        this.roleEdit = new Role();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }



    private selectAll() {
        this.allPermissions.forEach(p => this.selectedValues[p.value] = true);
    }


    private selectNone() {
        this.allPermissions.forEach(p => this.selectedValues[p.value] = false);
    }


    private toggleGroup(groupCode: string,value) {
        /*let firstMemberValue: boolean;

        this.allPermissions.forEach(p => {
            if (p.groupName != groupName)
                return;

            if (firstMemberValue == null)
                firstMemberValue = this.selectedValues[p.value] == true;

            this.selectedValues[p.value] = !firstMemberValue;
        });*/
        this.allPermissions.forEach(element => {
            if(element.groupCode==groupCode){
                console.log(element.groupCode,groupCode,value)
                element.features.forEach(f => {
                    console.log(f.featureCode,this.checkgroup.checkGroup(7,4))
                    if(f.featureCode!='f-manage-discount-limit')
                    f.isActive=value
                    else if(f.featureCode=='f-manage-discount-limit'&&this.checkgroup.checkGroup(7,4))
                    f.isActive=value
                });
            }
        });
    }


    private getSelectedPermissions() {
        let per=[]
         this.allPermissions.forEach((p:any) =>
            {
                   p.features.forEach(p1 =>{
                        if(p1.isActive==true)
                        per.push(p1.featureCode)
                   })
            })
          //  console.log('44444444444',per)
            return per 

    }


    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }


    newRole(allPermissions: Permission[]) {
        this.canDiscount=false
      //  this.roleEdit.discountPercentage=this.auth.userInStorage.value.discountLimitValue
        if(this.checkgroup.checkGroup(7,4))
        this.canDiscount=true
        this.allPermissions = allPermissions;
        this.canSetPermissions=[]
        this.isNewRole = true;
        this.showValidationErrors = true;
        console.log('88888888888',this.allPermissions)
        this.allPermissions.forEach(g =>{
           // if( g.isActive==true){
                this.canSetPermissions.push(g.groupCode)
                 g.isActive=false
            //}
           
            g.features.forEach(element => {
               // if(element.isActive==true ||(element.isActive==false &&  )){
                    if(element.featureCode!='f-manage-discount-limit')
                    this.canSetPermissions.push(element.featureCode)
                    else if(element.featureCode=='f-manage-discount-limit'&&this.checkgroup.checkGroup(7,4))
                    this.canSetPermissions.push(element.featureCode)
                    
                  
                //}
                element.isActive=false
            });
        })
        
        this.editingRoleName = null;
      
        this.selectedValues = {};
        this.roleEdit = new Role();

        return this.roleEdit;
    }

    editRole(role: Role, allPermissions: any[]) {
        this.canDiscount=false
        this.isSuperAdmin=this.auth.userInStorage.value.roles.includes('superadmin')
        console.log(this.isSuperAdmin)
        if(this.checkgroup.checkGroup(7,4))
        this.canDiscount=true
        this.canSetPermissions=[]

        if (role) {
            this.isNewRole = false;
            this.showValidationErrors = true;

            this.editingRoleName = role.name;
          //  this.allPermissions =[]
            this.allPermissions =allPermissions
            Object.assign(this.allPermissions, allPermissions);
            this.changeDetectorRef.detectChanges()
            this.selectedValues = {};
            console.log(role)


            this.allPermissions.forEach(g =>{
                if( g.isActive==true){
                    this.canSetPermissions.push(g.groupCode)
                    // g.isActive=false
                }
               
                g.features.forEach(element => {
                  //  if(element.isActive==true){
                        if(element.featureCode!='f-manage-discount-limit')
                        this.canSetPermissions.push(element.featureCode)
                        else if(element.featureCode=='f-manage-discount-limit'&&this.checkgroup.checkGroup(7,4))
                        this.canSetPermissions.push(element.featureCode)
                        
                        
                    //}
                   // element.isActive=false
                });
            })




            role.featuresCode=[]
           // role.permissions=[]
            role.claims.forEach(c => role.featuresCode.push(c.claimValue) )
            this.allPermissions.forEach(element => {
                element.isActive=false
                element.features.forEach(f => {
                    if(role.featuresCode.includes(f.featureCode)){
                        console.log(true)
                        f.isActive=true
                        element.isActive=true
                       /* if(f.featureCode=='f-manage-discount-limit')
                        this.canDiscount=true*/
                    }
              
                    else
                    f.isActive=false
                });
            });
            console.log(allPermissions)
            this.roleEdit = new Role();
         
            Object.assign(this.roleEdit, role);
            this.roleEdit.permissions=[]
            return this.roleEdit;
        }
        else {
            return this.newRole(allPermissions);
        }
    }



    get canManageRoles() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission)
    }
    toggleFeature(f,c){
     //   if(f=='f-manage-discount-limit')
      //   this.canDiscount=c
    }
}
