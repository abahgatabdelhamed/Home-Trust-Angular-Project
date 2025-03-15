// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";

import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../services/alert.service";
import { ConfigurationService } from "../../services/configuration.service";
import { AppTranslationService } from "../../services/app-translation.service";
import { BootstrapSelectDirective } from "../../directives/bootstrap-select.directive";
import { AccountService } from "../../services/account.service";
import { Utilities } from "../../services/utilities";
import { Permission } from "../../models/permission.model";

@Component({
    selector: "user-preferences",
    templateUrl: "./user-preferences.component.html",
    styleUrls: ["./user-preferences.component.css"]
})
export class UserPreferencesComponent implements OnInit, OnDestroy {
    themeSelectorToggle = true;
    gT = (key: string) => this.translationService.getTranslation(key);

    languageChangedSubscription: any;

    @ViewChild("languageSelector")
    languageSelector: BootstrapSelectDirective;

    @ViewChild("homePageSelector")
    homePageSelector: BootstrapSelectDirective;

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        public configurations: ConfigurationService
    ) {}

    ngOnInit() {
        this.languageChangedSubscription = this.translationService
       
            .languageChangedEvent()
            .subscribe(data => {
                this.themeSelectorToggle = false;

                setTimeout(() => {
                    this.languageSelector.refresh();
                    //this.homePageSelector.refresh();
                    this.themeSelectorToggle = true;
                });
            });
    }

    ngOnDestroy() {
        this.languageChangedSubscription.unsubscribe();
    }

    reloadFromServer() {
     //   this.alertService.startLoadingMessage();

        this.accountService.getUserPreferences().subscribe(
            results => {
                this.alertService.stopLoadingMessage();

                this.configurations.import(results);

                this.alertService.showMessage(
                    "Defaults loaded!",
                    "",
                    MessageSeverity.info
                );
            },
            error => {
                // this.alertService.stopLoadingMessage();
                // this.alertService.showStickyMessage(
                //     this.gT("messages.loadError"),
                //     `Unable to retrieve user preferences from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                //         error
                //     )}"`,
                //     MessageSeverity.error,
                //     error
                // );
            }
        );
    }

    setAsDefault() {
        const root = document.documentElement;
        if (this.configurations.theme == "Default") {
           // root.style.setProperty("--user-theme", "gray");
        } else if (this.configurations.theme == "Pink") {
            root.style.setProperty("--user-theme", "rgb(234 146 166)");
            root.style.setProperty("--user-theme-secoundary", "#E3166F");
            root.style.setProperty('--user-theme-background',"rgb(248 248 248)")
       
            
        } else if (this.configurations.theme == "Blue") {
            root.style.setProperty("--user-theme", "#16AFDD");
            root.style.setProperty("--user-theme-secoundary", "#143367");
            root.style.setProperty('--user-theme-background',"rgb(255 255 255)")
        }else if (this.configurations.theme == "Gray") {
            root.style.setProperty("--user-theme",this.configurations.theme.toLowerCase());
            root.style.setProperty("--user-theme-secoundary", "#3d3d3d");
            root.style.setProperty('--user-theme-background',"rgb(253 253 253)")
        }else if (this.configurations.theme == "Red") {
            root.style.setProperty("--user-theme",'#981717');
            root.style.setProperty("--user-theme-secoundary", '#731313');
            root.style.setProperty('--user-theme-background',"rgb(253 253 253)")
        }
        else if (this.configurations.theme == "Purple") {
            root.style.setProperty("--user-theme",'#e79cc9de');
            root.style.setProperty("--user-theme-secoundary", 'rgb(122 4 77)');
            root.style.setProperty('--user-theme-background',"rgb(253 253 253)")
        }
        else{
            root.style.setProperty("--user-theme", "#16AFDD");
            root.style.setProperty("--user-theme-secoundary", "#143367");
            root.style.setProperty('--user-theme-background',"#FAFAFA")
        }
        // else  {
            
        //     root.style.setProperty(
        //         "--user-theme",
        //         this.configurations.theme.toLowerCase()
        //     );
        // }
     /*   console.log(
            "the user theme now is: ",
            root.style.getPropertyValue("--user-theme")
        );*/
        this.alertService.showDialog(
            "Are you sure you want to set the current configuration as your new defaults?",
            DialogType.confirm,
            () => this.setAsDefaultHelper(),
            () =>
                this.alertService.showMessage(
                    "Operation Cancelled!",
                    "",
                    MessageSeverity.default
                )
        );
    }

    setAsDefaultHelper() {
      //  this.alertService.startLoadingMessage("",this.gT("shared.Saving"));

        this.accountService
            .updateUserPreferences(this.configurations.export())
            .subscribe(
                response => {
                    this.alertService.stopLoadingMessage();
                    this.alertService.showMessage(
                        "New Defaults",
                        "Account defaults updated successfully",
                        MessageSeverity.success
                    );
                },
                error => {
                    // this.alertService.stopLoadingMessage();
                    // this.alertService.showStickyMessage(
                    //     "Save Error",
                    //     `An error occured whilst saving configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(
                    //         error
                    //     )}"`,
                    //     MessageSeverity.error,
                    //     error
                    // );
                }
            );
    }

    resetDefault() {
        this.alertService.showDialog(
            "Are you sure you want to reset your defaults?",
            DialogType.confirm,
            () => this.resetDefaultHelper(),
            () =>
                this.alertService.showMessage(
                    "Operation Cancelled!",
                    "",
                    MessageSeverity.default
                )
        );
    }

    resetDefaultHelper() {
        this.alertService.startLoadingMessage("", "Resetting defaults");

        this.accountService.updateUserPreferences(null).subscribe(
            response => {
                this.alertService.stopLoadingMessage();
                this.configurations.import(null);
                this.alertService.showMessage(
                    "Defaults Reset",
                    "Account defaults reset completed successfully",
                    MessageSeverity.success
                );
            },
            error => {
                // this.alertService.stopLoadingMessage();
                // this.alertService.showStickyMessage(
                //     "Save Error",
                //     `An error occured whilst resetting configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(
                //         error
                //     )}"`,
                //     MessageSeverity.error,
                //     error
                // );
            }
        );
    }

    get canViewCustomers() {
        return this.accountService.userHasPermission(
            Permission.viewUsersPermission
        ); //eg. viewCustomersPermission
    }

    get canViewProducts() {
        return this.accountService.userHasPermission(
            Permission.viewUsersPermission
        ); //eg. viewProductsPermission
    }

    get canViewOrders() {
        return true; //eg. viewOrdersPermission
    }
}
