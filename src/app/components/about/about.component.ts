// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { SettingsService } from "../../services/settings.service";
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    animations: [fadeInOut]
})
export class AboutComponent implements OnInit {
    constructor(private alertService: AlertService, private settingsService: SettingsService,
        private authService: AuthService,
        private translationService: AppTranslationService) {
    }
    gT = (key: string) => this.translationService.getTranslation(key);
    isRegistered = null;
    isButtonClicked = false;
    clientId:string
    ReRegister() {
        this.isButtonClicked = true;
    }
    ngOnInit() {
        this.authService.isRegistered().subscribe(
            (data: any) => {
                this.isRegistered = data;
            }
        );
        this.clientId=this.authService.getClientId()
    }

    serial: any;
    appLogo = require("../../assets/images/about.png");
    Register = function () {
        this.settingsService.register(this.serial).subscribe(cv => {
            if (cv) {
               this.alertService.showMessage(
                    this.gT('shared.OperationSucceded'),
                    "تم تفعيل المنتج بنجاح",
                    MessageSeverity.success
                );
            } else {
                this.alertService.showMessage(this.gT("messages.Enbleproduct"),"", MessageSeverity.error);
            }
        });
    }

    
}
