import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { stat } from 'fs';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class DefinitionsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router : Router,
    private checkPermission:CheckPermissionsService,
    private accountService:AccountService
  ) { }
  user:any
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      console.log(next.data.feature)
      if(!this.checkPermission.checkGroup(6,next.data.feature)) {
        console.log('tohome')
        this.router.navigate(['/notFound'])
      }/*else if(!this.authService.loggedInUser.value){
      
        return this.getuserPermissions(next)
        // console.log('22222222222')
        
        }*/else{
          return this.checkPermission.checkGroup(6, next.data.feature)
        }
    
      }
      async getuserPermissions(next){
        this.user= await this.accountService.getUser().toPromise()
        this.authService.loggedInUser.next(this.user)
        return this.checkPermission.checkGroup(6, next.data.feature)
    }

  
  switchRoute(feature){
    let f:any
    switch (feature){
      case "f-item-groups-management": {
        f = "itemcat"
        break;
      }
      case "f-items-manage": {
        f = "item"
        break;
      }
      case "f-services-manage": {
        f = "service-type"
        break;
      }
      case "f-add-table": {
        f = "tables"
        break;
      }
      case "f-suppliers-manage": {
        f = "supplier"
        break;
      }
      case "f-customers-manage": {
        f = "customer"
        break;
      }
      case "f-accounts-manage": {
        f = "acc-table"
        break;
      }
      case "f-branches-manage": {
        f = "branch"
        break;
      }
      
      case "f-cost-hierarchy-manage": {
        f = "expenses-template"
        break;
      }
      case "f-printer-settings-manage": {
        f = "printer-settings"
        break;
      }
      case "f-discount-management": {
        f = "discount-management"
        break;
      }
      case "f-cc-manage": {
        f = "branch"// change
        break;
      }
    }
return f
  }
}
