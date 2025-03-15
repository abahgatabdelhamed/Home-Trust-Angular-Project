import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class SalesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private checkPermission: CheckPermissionsService,
    private accountService:AccountService
  ) { }
  user:any
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    console.log(next.data.feature, state)
    
    if (!this.checkPermission.checkGroup(1, next.data.feature == 'unknow' ? this.setFeature(state.url) : next.data.feature)) {
      console.log('tohome')
      this.router.navigate(['/notFound'])
      return this.checkPermission.checkGroup(1, next.data.feature)
    }/*else if(!this.authService.loggedInUser.value){
      
    return this.getuserPermissions(next)
    // console.log('22222222222')
    
    }*/else{
      return this.checkPermission.checkGroup(1, next.data.feature)
    }

  }
  async getuserPermissions(next){
    this.user= await this.accountService.getUser().toPromise()
    this.authService.loggedInUser.next(this.user)
    return this.checkPermission.checkGroup(1, next.data.feature)
}
  setFeature(url) {
    
    if (url == '/sales/bill/quate/new'||(url.search('/sales/bill/quate/')!=-1))
      return 2
    if (url == '/sales/bill/sale/new'||(url.search('/sales/bill/sale/')!=-1))
      return 1
    
    if (url == '/sales/bill/exchange/new'||(url.search('/sales/bill/exchange/')!=-1))
      return 4
   
    return 3
  }
  switchRoute(feature: any) {
    let url: string=null
    switch (feature) {
      case "f-create-sales-invoice": {
        url = '/bill/sale/new'
        break;
      }
      case "f-create-offer-invoice": {
        url = '/bill/quate/new'
        break;
      }
      case "f-create-sales-invoice-refund": {
        url = '/rsale'
        break;
      }
      case "f-create-damage-invoice": {
        url = '/bill/exchange/new'
        break;
      }
      case "f-transfer-item-branche": {
        url = '/convert-varieties'
        break;
      }
      case "f-transfer-item-cc": {
        url = '/convert-cc'
        break;
      }
      case "f-create-damage-invoice-refund": {
        url = '/rsale'
        break;
      }
    }
    return url
  }
}
