// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { PermissionsUser } from "./PermissionsUser.model";





export class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id?: string, userName?: string, fullName?: string, email?: string, jobTitle?: string, phoneNumber?: string, roles?: string[],permission?:any[],groups?:PermissionsUser[],profilePicture?:any,discountLimitValue?:any,password?,RemeberMe?) {

        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.Permissions=permission
        this.groups=groups
        this.profilePicture=profilePicture
        this.discountLimitValue=discountLimitValue
        this.Password=password
        this.RememberMe=RemeberMe
    }


    get friendlyName(): string {
        let name = this.fullName || this.userName;

        if (this.jobTitle)
            name = this.jobTitle + " " + name;

        return name;
    }


    public id: string;
    public userName: string;
    public fullName: string;
    public email: string;
    public jobTitle: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles?: string[];
    public Permissions?:any[];
    public groups?:PermissionsUser[];
    public profilePicture:any
    public discountLimitValue:any
    public Password:any
    public RememberMe:any
}
