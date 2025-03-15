// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Permission } from './permission.model';
import { PermissionsUser } from './PermissionsUser.model';


export class Role {

    constructor(name?: string, description?: string, permissions?: Permission[],featuresIds?:string[],featuresCode?:string[],discountPercentage?:number) {

        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.featuresIds=featuresIds
        this.featuresCode=featuresCode
        this.discountPercentage=discountPercentage

    }

    public id: string;
    public name: string;
    public description: string;
    public usersCount: string;
    public permissions: Permission[];
    public featuresIds:string[]
    public featuresCode:string[]
    public claims:any[]
    public discountPercentage:number
}
