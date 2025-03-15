import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class AccountingGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router : Router,
    private checkPermission:CheckPermissionsService,
    private accountService:AccountService
  ) { }
  user:any
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     if(!this.checkPermission.checkGroup(3,next.data.feature)) {  
      this.router.navigate(['/home'])
    }/*else if(!this.authService.loggedInUser.value){
      
      return this.getuserPermissions(next)
      // console.log('22222222222')
      
      }*/else{
        return this.checkPermission.checkGroup(3, next.data.feature)
      }
  
    }
    async getuserPermissions(next){
      this.user= await this.accountService.getUser().toPromise()
      this.authService.loggedInUser.next(this.user)
      return this.checkPermission.checkGroup(3, next.data.feature)
  }

  switchRoute(feature){
    let f:any
    switch (feature){
      case "f-accounts-tree-manage": {
        f = "accountingtree"
        break;
      }
      case "f-receive-recipts-manage": {
        f = "receipts"
        break;
      }
      case  "f-payment-recipts-manage": {
        f ="payments"
        break;
      }
      case "f-deposit-recipts-manage": {
        f = "deposits"
        break;
      }
      case "f-daily-recipts-manage": {
        f = "daily"
        break;
      }
      case "f-advanced-daily-recipts-manage": {
        f = "daily-advanced"
        break;
      }
      
      case "f-recipt-documents-manage": {
        f = "receipt-documents"
        break;
      }
      case "f-creat-depreciation-asset": {
        f = "newassets"
        break;
      }
      case "f-assets-depreciation-manage": {
        f = "assets"
        break;
      }
    }
return f
  }
  
}
