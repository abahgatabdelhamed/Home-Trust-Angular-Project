import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class ReportsGuard implements CanActivate {
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
      console.log(this.checkPermission.checkGroup(5,next.data.feature))
      if(!this.checkPermission.checkGroup(5,next.data.feature)){   
      this.router.navigate(['/home'])
     
     }/*else if(!this.authService.loggedInUser.value){
      
      return this.getuserPermissions(next)
      // console.log('22222222222')
      
      }*/else{
        return this.checkPermission.checkGroup(5, next.data.feature)
      }
  
    }
    async getuserPermissions(next){
      this.user= await this.accountService.getUser().toPromise()
      this.authService.loggedInUser.next(this.user)
      return this.checkPermission.checkGroup(5, next.data.feature)
  }
  switchRoute(feature: any) {
    let url: string=null
    switch (feature) {
        case  "f-bills-history": {
          url ="bills"
          break;
        }
        case "f-production": {
          url = "production"
          break;
        }
        case "f-sold-items": {
          url = 'sold-items'
          break;
        }
        case "f-credit": {
          url = 'due-amount'
          break;
        }
        case "f-vat": {
          url = "vat-reports"
          break;
        }
        case "f-vat-on-purchases": {
          url = "vat-reports-purch"
          break;
        }
        case "f-vat-on-sales": {
          url = "vat-reports-sales"
          break;
        }
        case "f-inventory": {
          url = "storage"
          break;
        }
        
        case "f-supplier-statement": {
          url = "supplier-info"
          break;
        }
        case "f-customer-statement": {
          url = "customer-info"
          break;
        }
        case "f-item-history": {
          url = "item-report"
          break;
        }
        
        case "f-summary": {
          url = "abstract"
          break;
        }
        case "f-profit-balancer": {
          url = "profit-reports"
          break;
        }
        case "f-profit-balancer-branch": {
          url = "profit-branch-reports"
          break;
        }
        
        case "f-profit-balancer-cc": {
          url = "profit-cc-reports"
          break;
        }
      }
  return url
    }
}
