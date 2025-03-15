import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CheckPermissionsService } from './check-permissions.service';

@Injectable()
export class ToolsGuard implements CanActivate {
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
      if(!this.checkPermission.checkGroup(8,next.data.feature)){   
      this.router.navigate(['/home'])
    }/*else if(!this.authService.loggedInUser.value){
      
      return this.getuserPermissions(next)
      // console.log('22222222222')
      
      }*/else{
        return this.checkPermission.checkGroup(8, next.data.feature)
      }
  
    }
    async getuserPermissions(next){
      this.user= await this.accountService.getUser().toPromise()
      this.authService.loggedInUser.next(this.user)
      return this.checkPermission.checkGroup(8, next.data.feature)
  }
}
