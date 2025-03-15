import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators/tap';
import { PermissionsUser } from '../models/PermissionsUser.model';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class PurchGuard implements CanActivate {
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
      if(!this.checkPermission.checkGroup(2,next.data.feature=='unknow'?this.setFeature(state.url): next.data.feature)){
        this.router.navigate(['/home'])
      }/*else if(!this.authService.loggedInUser.value){
      
        return this.getuserPermissions(next)
        // console.log('22222222222')
        
        }*/else{
          return this.checkPermission.checkGroup(2, next.data.feature)
        }
    
      }
      async getuserPermissions(next){
        this.user= await this.accountService.getUser().toPromise()
        this.authService.loggedInUser.next(this.user)
        return this.checkPermission.checkGroup(2, next.data.feature)
    }
  setFeature(url){
  
    if(url=='/purch/bill/purch/new'||(url.search('/purch/bill/purch/')!=-1)){

      return 1
    }
    
    return 2

  }
  
  switchRoute(feature: any) {
    let url: string=null
    switch (feature) {
      
        case "f-create-purchases-invoice": {
          url = '/bill/purch/new'
          break;
        }
        case "f-create-purchases-invoice-refund": {
          url = '/rpurch'
          break;
        }
        case "f-expenses-manage": {
          url = '/expenses'
          break;
        }
        case "f-create-production-invoice": {
          url = '/add-production-bill/new'
          break;
        }
        case "f-create-damage-invoice-refund":{
          url='/rpurch'
          break;
        }
        
    }
  return url
    }

}
