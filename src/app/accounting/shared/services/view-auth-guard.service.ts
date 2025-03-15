import { AuthService } from './../../../services/auth.service';
import {
    AlertService,
    MessageSeverity
} from "./../../../services/alert.service";
import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AppTranslationService } from "../../../services/app-translation.service";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {
    gT = (key: string) => this.translationService.getTranslation(key);
    result = false;
    res = false;

    constructor(
        public router: Router,
        private alerService: AlertService,
        private translationService: AppTranslationService,
        private authService: AuthService
    ) {}
    canActivate(): Observable<boolean>{
        // const permessions = sessionStorage.getItem("user_permissions");
        // if (!permessions) return false;
        // const roles = JSON.parse(permessions);
        // const isAuth = roles.some(e => e == "roles.view");
        return this.authService.isRegistered().map((cv) => {
            if (!cv) {
                this.alerService.showMessage(
                    "ERROR",
                    "المنتج غير مسجل، يرجى التواصل مع مؤسسة حلول الغد لتجديد العقد",
                    MessageSeverity.error
                );
                console.log(cv)
                this.router.navigate(["/about"]);
                return false;
            }
            else {

                if (!this.authService.isLoggedIn) {
                    // this.alerService.showMessage(
                    //     "403 ERROR",
                    //     this.gT("shared.unAuthorizedToView"),
                    //     MessageSeverity.error
                    // );
                    this.router.navigate(["/login"]);
                    return false;
                } else {
                    return true;
                }
            }
        }, err => {
            return false;
            });  
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
