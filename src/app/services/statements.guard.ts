import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class StatementsGuard implements CanActivate {
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
      console.log(next.data,state.url)
      console.log(this.checkPermission.checkGroup(4,next.data.feature))
      if(!this.checkPermission.checkGroup(4,next.data.feature)){   
      this.router.navigate(['/home'])
    }/*else if(!this.authService.loggedInUser.value){
      
      return this.getuserPermissions(next)
      // console.log('22222222222')
      
      }*/else{
        return this.checkPermission.checkGroup(4, next.data.feature)
      }
  
    }
    async getuserPermissions(next){
      this.user= await this.accountService.getUser().toPromise()
      this.authService.loggedInUser.next(this.user)
      return this.checkPermission.checkGroup(4, next.data.feature)
  }
  switchRoute(feature){
    let f:any
    switch (feature){
      case "f-create-entry-statement": {
        f = "newentrystatments"
        break;
      }
      case "f-statements-List": {
        f = "entrystatments"
        break;
      }
      case "f-create-exit-permission": {
        f = "entrystatments"
        break;
      }
    }
return f
  }
}
