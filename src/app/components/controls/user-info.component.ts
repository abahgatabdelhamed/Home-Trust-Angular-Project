import { AppTranslationService } from "./../../services/app-translation.service";
// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, ViewChild, Input } from "@angular/core";

import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AccountService } from "../../services/account.service";
import { Utilities } from "../../services/utilities";
import { User } from "../../models/user.model";
import { UserEdit } from "../../models/user-edit.model";
import { Role } from "../../models/role.model";
import { Permission } from "../../models/permission.model";
import { PermissionsUser } from "../../models/PermissionsUser.model";
import { T } from "@angular/core/src/render3";
import { AuthService } from "../../services/auth.service";
import { features } from "../../models/PermissionsUser.model";
import { ItemCatService } from "../../accounting/definitions/services/itemcat.service";
import { ItemService } from "../../accounting/definitions/services/item.service";

@Component({
    selector: "user-info",
    templateUrl: "./user-info.component.html",
    styleUrls: ["./user-info.component.css"]
})
export class UserInfoComponent implements OnInit {
    private isEditMode = false;
    private isNewUser = false;
    private isSaving = false;
    private isChangePassword = false;
    private isEditingSelf = false;
    private showValidationErrors = false;
    private editingUserName: string;
    private uniqueId: string = Utilities.uniqueId();
    private user: User = new User();
    private userEdit: UserEdit;
    private allRoles: Role[] = [];
    isAdmin:boolean=false
    editimg:boolean=false
    values:boolean[]=[true,false,true,false,true]
    logoPath;
    imgURL;
    uploadDone: boolean;
    fileToUpload: FormData;
    file: FormData;

    AllPermissions:PermissionsUser[]= [{
        id: 1,
        isActive: true,
        groupCode: "G1",
        features: [
          {
            id: 1,
            name: "F1",
            arabicName: "ميزة1",
            description: "des",
            featureCode: "F1",
            isActive: true
          },
          {
            id: 2,
            name: "F1",
            arabicName: "ميزة2",
            description: "des",
            featureCode: "F1",
            isActive: false
          }
        ],
        name: "g1",
        arabicName: "مجموعة1"
      },
      {
        id: 2,
        isActive: false,
        groupCode: "G2",
        features: [
          {
            id: 3,
            name: "F1",
            arabicName: "ميزة3",
            description: "des",
            featureCode: "F1",
            isActive: false
          },
          {
            id: 4,
            name: "F1",
            arabicName: "ميزة4",
            description: "des",
            featureCode: "F1",
            isActive: true
          },
          {
            id: 5,
            name: "F1",
            arabicName: "ميزة5",
            description: "des",
            featureCode: "F1",
            isActive: true
          }
        ],
        name: "g2",
        arabicName: "مجموعة2"
      }
    ]
    gT = (key: string) => this.translationService.getTranslation(key);

    public formResetToggle = true;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild("f")
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild("userName")
    private userName;

    @ViewChild("userPassword")
    private userPassword;

    @ViewChild("email")
    private email;

    @ViewChild("currentPassword")
    private currentPassword;

    @ViewChild("newPassword")
    private newPassword;

    @ViewChild("confirmPassword")
    private confirmPassword;

    @ViewChild("roles")
    private roles;

    @ViewChild("rolesSelector")
    private rolesSelector;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private authService:AuthService,
        private cat:ItemService
    ) {}

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadCurrentUserData();
            
        }
       
       
    }

    loadData(){
        
     this.accountService.getAllgroup().subscribe({next :(res:PermissionsUser[])=>
        {  res.forEach(e=>{
            if(e.groupCode=='g-settings')
            e.features.forEach((e1,index) =>{
                if(e1.featureCode=="f-user-management"){
                    if(!this.isAdmin)
                    e.features.splice(index,1)
                }
            })
        })
            this.AllPermissions=res
            console.log(this.AllPermissions,res)  
            this.AllPermissions.forEach(e=>{
                e.isActive=false
                e.features.forEach((f:features) =>{
                    /*if(f.isActive)
                    this.userEdit.Permissions.push(f.id)*/
                    f.isActive=false
                })
            })
        }})
    }
    editimage(){
        this.editimg=!this.editimg
    }
    setPermissionGroup(groupCode,checked){
        this.AllPermissions.forEach(g=>{
            if(g.groupCode==groupCode){
                g.features.forEach(f =>{
                    f.isActive=checked
                    if(checked){
                        this.userEdit.Permissions.push(f.id)
                    }else
                    {this.userEdit.Permissions.forEach((element,index)=>{
                        if(element==f.id)  this.userEdit.Permissions.splice(index,1);
                     });
                    }
                })
            }
        })
    }
    setPermission(id,active){
        console.log(active,id)
     

       if(active){
           
        this.userEdit.Permissions.push(id)
        }else{
         this.userEdit.Permissions.forEach((element,index)=>{
             if(element==id)  this.userEdit.Permissions.splice(index,1);
          });
        
    }
    }
    private loadCurrentUserData() {

        this.alertService.startLoadingMessage();



        if (this.canViewAllRoles) {
            this.accountService
                .getUserAndRoles()
                .subscribe(
                    results =>
                        this.onCurrentUserDataLoadSuccessful(
                            results[0],
                            results[1]
                        ),
                    error => this.onCurrentUserDataLoadFailed(error)
                );
        } else {
            this.accountService
                .getUser()
                .subscribe(
                    user =>
                        this.onCurrentUserDataLoadSuccessful(
                            user,
                            user.roles.map(x => new Role(x)),
                           

                        ),
                    error => this.onCurrentUserDataLoadFailed(error)
                );
             
        }
    }

    private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
        this.alertService.stopLoadingMessage();
        this.user = user;
        this.imgURL=user.profilePicture
        this.allRoles = roles;
        console.log(this.allRoles)
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
     /*   this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );
*/
        this.user = new User();
    }

    private getRoleByName(name: string) {
        return this.allRoles.find(r => r.name == name);
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    public deletePasswordFromUser(user: UserEdit | User) {
        let userEdit = <UserEdit>user;
          
        delete userEdit.currentPassword;
        delete userEdit.newPassword;
        delete userEdit.confirmPassword;
    }

    private edit() {
        if (!this.isGeneralEditor) {
            this.isEditingSelf = true;
            this.userEdit = new UserEdit();
            this.userEdit.Permissions=[]
            //this.userEdit.roles=['user']
            Object.assign(this.userEdit, this.user);
          //  this.imgURL=this.userEdit.profilePicture
        } else {
            if (!this.userEdit) this.userEdit = new UserEdit();
            this.userEdit.Permissions=[]
            this.isEditingSelf = this.accountService.currentUser
                ? this.userEdit.id == this.accountService.currentUser.id
                : false;
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
        this.isChangePassword = false;
    }

    private save() {
   
        this.isSaving = true;
         this.alertService.startLoadingMessage(this.gT("shared.Saving"));
      //  this.userEdit.roles=['user']
        this.userEdit.groups=this.AllPermissions
          console.log(this.userEdit)
          if (this.fileToUpload) {
            this.accountService.uploadFile(this.fileToUpload).subscribe(res => {
                this.uploadDone = true;
                console.log('tttt',res)
                this.userEdit.profilePicture="uploads/"+res
                if (this.isNewUser) {
                    this.userEdit.currentPassword=this.userEdit.confirmPassword
              
                    this.accountService
                        .newUser(this.userEdit)
                        .subscribe(
                            user => this.saveSuccessHelper(user),
                            error => this.saveFailedHelper(error)
                        );
                } else {
                  //  this.userEdit.groups=this.AllPermissions
                  //this.userEdit.currentPassword=this.userEdit.confirmPassword
                    this.accountService
                        .updateUser(this.userEdit)
                        .subscribe(
                            response =>(this.saveSuccessHelper()) ,
                            error => this.saveFailedHelper(error)
                        );
                }
                //  this.deleteLogoDone = false;
            });
        }
        else{
            if (this.isNewUser) {
                this.userEdit.currentPassword=this.userEdit.confirmPassword
          
                this.accountService
                    .newUser(this.userEdit)
                    .subscribe(
                        user => this.saveSuccessHelper(user),
                        error => this.saveFailedHelper(error)
                    );
            } else {
              //  this.userEdit.groups=this.AllPermissions
              //this.userEdit.currentPassword=this.userEdit.confirmPassword
                this.accountService
                    .updateUser(this.userEdit)
                    .subscribe(
                        response =>(this.saveSuccessHelper()) ,
                        error => this.saveFailedHelper(error)
                    );
            }
        }
        
    }

    private saveSuccessHelper(user?: User) {
        this.testIsRoleUserCountChanged(this.user, this.userEdit);

        if (user) Object.assign(this.userEdit, user);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.isChangePassword = false;
        this.showValidationErrors = false;

        this.deletePasswordFromUser(this.userEdit);
        Object.assign(this.user, this.userEdit);
        this.userEdit = new UserEdit();
        this.resetForm();

        if (this.isGeneralEditor) {
            if (this.isNewUser)
                this.alertService.showMessage(
                    "Success",
                    `User \"${this.user.userName}\" was created successfully`,
                    MessageSeverity.success
                );
            else if (!this.isEditingSelf)
                this.alertService.showMessage(
                    "Success",
                    `Changes to user \"${
                        this.user.userName
                    }\" was saved successfully`,
                    MessageSeverity.success
                );
        }

        if (this.isEditingSelf) {
            this.alertService.showMessage(
                "Success",
                "Changes to your User Profile was saved successfully",
                MessageSeverity.success
            );
            this.refreshLoggedInUser();
        }

        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        // this.alertService.stopLoadingMessage();
        // this.alertService.showStickyMessage(
        //     "Save Error",
        //     "The below errors occured whilst saving your changes:",
        //     MessageSeverity.error,
        //     error
        // );
        // this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback) this.changesFailedCallback();
    }

    private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {
        let rolesAdded = this.isNewUser
            ? editedUser.roles
            : editedUser.roles.filter(
                  role => currentUser.roles.indexOf(role) == -1
              );
        let rolesRemoved = this.isNewUser
            ? []
            : currentUser.roles.filter(
                  role => editedUser.roles.indexOf(role) == -1
              );

        let modifiedRoles = rolesAdded.concat(rolesRemoved);

        if (modifiedRoles.length)
            setTimeout(() =>
                this.accountService.onRolesUserCountChanged(modifiedRoles)
            );
    }

    private cancel() {
        if (this.isGeneralEditor) this.userEdit = this.user = new UserEdit();
        else this.userEdit = new UserEdit();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage(
            "Cancelled",
            "Operation cancelled by user",
            MessageSeverity.default
        );
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor) this.isEditMode = false;

        if (this.changesCancelledCallback) this.changesCancelledCallback();
    }

    private close() {
        this.userEdit = this.user = new UserEdit();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback) this.changesSavedCallback();
    }

    private refreshLoggedInUser() {
        this.accountService.refreshLoggedInUser().subscribe(
            user => {
                this.loadCurrentUserData();
            },
            error => {
                // this.alertService.resetStickyMessage();
                // this.alertService.showStickyMessage(
                //     "Refresh failed",
                //     "An error occured whilst refreshing logged in user information from the server",
                //     MessageSeverity.error,
                //     error
                // );
            }
        );
    }

    private changePassword() {
        this.isChangePassword = true;
    }

    private unlockUser() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Unblocking user...");

        this.accountService.unblockUser(this.userEdit.id).subscribe(
            response => {
                this.isSaving = false;
                this.userEdit.isLockedOut = false;
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage(
                    "Success",
                    "User has been successfully unblocked",
                    MessageSeverity.success
                );
            },
            error => {
                this.isSaving = false;
                // this.alertService.stopLoadingMessage();
                // this.alertService.showStickyMessage(
                //     "Unblock Error",
                //     "The below errors occured whilst unblocking the user:",
                //     MessageSeverity.error,
                //     error
                // );
                // this.alertService.showStickyMessage(
                //     error,
                //     null,
                //     MessageSeverity.error
                // );
            }
        );
    }

    resetForm(replace = false) {
        this.isChangePassword = false;

        if (!replace) {
            this.form.reset();
        } else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    newUser(allRoles: Role[]) {
        this.imgURL=''
        this.fileToUpload=null
        this.loadData()
        this.isAdmin=false
       /* this.authService.loggedInUser.subscribe(res =>
            this.AllPermissions=res.groups)
        *///
       //  this.loadData()
        this.isGeneralEditor = true;
        this.isNewUser = true;

        this.allRoles = [...allRoles];
        this.editingUserName = null;
        this.user = this.userEdit = new UserEdit();
        this.userEdit.isEnabled = true;
        this.edit();

        return this.userEdit;
    }

    editUser(user: User, allRoles: Role[]) {
        if (user) {
            this.isGeneralEditor = true;
            this.isNewUser = false;
          /*  this.accountService.getAllgroup().subscribe((res:PermissionsUser[])=>
                this.AllPermissions=res)
            */
           this.accountService.getUser(user.id).subscribe({
                next:(res)=>{
                    console.log(res)
                    this.imgURL=res.profilePicture
                    /*this.isAdmin=res.roles[0]=='administrator'?true:false
                    res.groups.forEach(e=>{
                        if(e.groupCode=='g-settings')
                        e.features.forEach((e1,index) =>{
                            if(e1.featureCode=="f-user-management"){
                                if(!this.isAdmin)
                                e.features.splice(index,1)
                            }
                        })
                    })*/
                    this.AllPermissions=res.groups
                    
                    this.AllPermissions.forEach(e=>{
                        e.features.forEach((f:features) =>{
                            if(f.isActive)
                            this.userEdit.Permissions.push(f.id)
                        })
                    })
                }
            })
            this.setRoles(user, allRoles);
            this.editingUserName = user.userName;
            this.user = new User();
            this.userEdit = new UserEdit();
            Object.assign(this.user, user);
            Object.assign(this.userEdit, user);
            this.edit();

            return this.userEdit;
        } else {
            return this.newUser(allRoles);
        }
    }

    displayUser(user: User, allRoles?: Role[]) {
        this.user = new User();
        Object.assign(this.user, user);
        this.deletePasswordFromUser(this.user);
        this.setRoles(user, allRoles);

        this.isEditMode = false;
    }

    private setRoles(user: User, allRoles?: Role[]) {
        this.allRoles = allRoles ? [...allRoles] : [];

        if (user.roles) {
            for (let ur of user.roles) {
                if (!this.allRoles.some(r => r.name == ur))
                    this.allRoles.unshift(new Role(ur));
            }
        }

        if (allRoles == null || this.allRoles.length != allRoles.length)
            setTimeout(() => this.rolesSelector.refresh());
    }

    get canViewAllRoles() {
        return this.accountService.userHasPermission(
            Permission.viewRolesPermission
        );
    }

    get canAssignRoles() {
        return this.accountService.userHasPermission(
            Permission.assignRolesPermission
        );
    }


    handleFileChange(event) {
        /* this.fileToUpload = event.target.files[0]
        */let reader = new FileReader();
         if (event.target['files'] && event.target['files'].length > 0) {
             const file = new FormData();
             file.append('files', event.target['files'][0]);
             file.append('fileName', event.target['files'][0].name);
             this.preview(event.target['files']);
             this.fileToUpload = file;
             /*if(!this.isEditMode){
               
                this.accountService.uploadFile(this.fileToUpload).subscribe(res =>{
                  //  this.editimg=!this.editimg
                    this.accountService.uploadFile("uploads/"+res,true).subscribe()
                })
             }*/
             // console.log(file,e)
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
             this.accountService.uploadFile(this.fileToUpload).subscribe(res => {
                 this.uploadDone = true;
                 console.log('tttt',res)
                 //  this.deleteLogoDone = false;
             });
         }
     }
 
}
