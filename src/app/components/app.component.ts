import { UserPreferencesService } from "./../accounting/definitions/services/user-preferences.service";
// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ViewChildren,
    AfterViewInit,
    QueryList,
    ElementRef,
    ChangeDetectorRef
} from "@angular/core";
import { NavigationStart, ChildActivationStart, ActivatedRoute } from "@angular/router";
import {
    ToastyService,
    ToastyConfig,
    ToastOptions,
    ToastData
} from "ng2-toasty";
import { ModalDirective } from "ngx-bootstrap/modal";

import {
    AlertService,
    AlertDialog,
    DialogType,
    AlertMessage,
    MessageSeverity
} from "../services/alert.service";
import { NotificationService } from "../services/notification.service";
import { AppTranslationService } from "../services/app-translation.service";
import { AccountService } from "../services/account.service";
import { LocalStoreManager } from "../services/local-store-manager.service";
import { AppTitleService } from "../services/app-title.service";
import { AuthService } from "../services/auth.service";
import { ConfigurationService } from "../services/configuration.service";
import { SettingsService } from "../services/settings.service";
import { Permission } from "../models/permission.model";
import { LoginComponent } from "../components/login/login.component";
import { AuthGuardService } from "../accounting/shared/services/view-auth-guard.service";
import { AssetService } from "../accounting/accounting/services/asset.service";
import { query } from "@angular/core/src/render3/instructions";
import { PermissionsUser } from "../models/PermissionsUser.model";
import { CheckPermissionsService } from "../services/check-permissions.service";
import { SalesGuard } from "../services/sales.guard";
import { LoginResponse } from "../models/login-response.model";
import { User } from "../models/user.model";
import { Event, RouterEvent, Router } from '@angular/router';
import { filter } from "rxjs/operators";
import { SideBarMenuService } from "../services/side-bar-menu.service";
import { NgIf } from "@angular/common";
var alertify: any = require("../assets/scripts/alertify.js");

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
    currentVersion: any;
    latestVersion: string;
    isAppLoaded: boolean;
    isThereIsUpdate: boolean;
    isUserLoggedIn: boolean;
    shouldShowLoginModal: boolean;
    removePrebootScreen: boolean;
    Permissions: PermissionsUser[] = null
    newNotificationCount = 0;
    userinit: boolean = false
    gT = (key: string) => this.translationService.getTranslation(key);
    appTitle = "Trust";
    appLogo = require("../assets/images/logo.png");
    whiteLogo = require("../assets/images/white-logo.png");
    StatrTimer: boolean = false
    stickyToasties: number[] = [];
    userr: any
        ;
    baseUrl =this.configurations.baseUrl
    pageHeader: string = ''
    dataLoadingConsecutiveFailurs = 0;
    notificationsLoadingSubscription: any;
    isOpen: boolean = false
    @ViewChildren("loginModal,loginControl")
    modalLoginControls: QueryList<any>;
    mainTaps = []
    iconHeader: string = ''
    loginModal: ModalDirective;
    loginControl: LoginComponent;
    interval: NodeJS.Timer;
    sideMenu = []
    logo: any;
    get notificationsTitle() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        if (this.newNotificationCount)
            return `${gT("app.Notifications")} (${this.newNotificationCount
                } ${gT("app.New")})`;
        else return gT("app.Notifications");
    }

    constructor(
        storageManager: LocalStoreManager,
        private preferService: UserPreferencesService,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private accountService: AccountService,
        private alertService: AlertService,
        private notificationService: NotificationService,
        private appTitleService: AppTitleService,
        private authService: AuthService,
        private translationService: AppTranslationService,
        public configurations: ConfigurationService,
        public router: Router,
        public activeRouter: ActivatedRoute,
        private settingsService: SettingsService,
        private checkPermissions: CheckPermissionsService,
        public sideMenuService: SideBarMenuService,
        private ref:ChangeDetectorRef
    ) {
        storageManager.initialiseStorageSyncListener();

        translationService.addLanguages(["en", "fr", "de", "pt", "ar", "ko"]);
        // translationService.setDefaultLanguage("ar");
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'ar');
        }

        this.toastyConfig.theme = "bootstrap";
        this.toastyConfig.position = "top-right";
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;

        this.appTitleService.appName = this.appTitle;
        this.isThereIsUpdate = false;
      
    }



    ngAfterViewInit() {
        this.modalLoginControls.changes.subscribe(
            (controls: QueryList<any>) => {
                controls.forEach(control => {
                    if (control) {
                        if (control instanceof LoginComponent) {
                            this.loginControl = control;
                            this.loginControl.modalClosedCallback = () =>
                                this.loginModal.hide();

                        } else {
                            this.loginModal = control;
                            this.loginModal.show();
                        }
                    }
                });
            }
        );
    }

    async getcurrentVersion() {
        this.currentVersion = await this.settingsService.getCurrentVersion().toPromise()
           this.authService.saveClientId(this.currentVersion.clientId)
        console.log(this.currentVersion)
        //this.ReloadData()

    }
    ngAfterContentInit() {

    }

    onLoginModalShown() {

    }

    async isAuth() {
        // to do
        return await this.authService.currentUser
    }

    onLoginModalHidden() {
        this.alertService.resetStickyMessage();
        this.loginControl.reset();
        this.shouldShowLoginModal = false;

        if (this.authService.isSessionExpired)
            this.alertService.showStickyMessage(
                "Session Expired",
                "Your Session has expired. Please log in again to renew your session",
                MessageSeverity.warn
            );
    }

    onLoginModalHide() {
        this.alertService.resetStickyMessage();
    }

    getActiveTab(url) {
        if (url.includes('/sale'))
            return this.sideMenuService.salesMenu
        if (url.includes('/purch'))
            return this.sideMenuService.purchMenu
        if (url.includes('/report'))
            return this.sideMenuService.reportsMenu
        if (url.includes('/definitions'))
            return this.sideMenuService.definitionsMenu
        if (url.includes('/accounting'))
            return this.sideMenuService.accountingMenu
        if (url.includes('/permissions'))
            return this.sideMenuService.statementMenu
        if (url.includes('/settings'))
            return this.sideMenuService.settingsMenu
            if (url.includes('/tools'))
            return this.sideMenuService.toolsMenu

        return { taps: [], pageHeader: '', icon: '' }
    }

    openMenu() {
        //this.isOpen = !this.isOpen
        this.sideMenuService.openMenu.next(true)
        
    }
    closeMenu(){
       
        this.sideMenuService.openMenu.next(false)
        console.log(this.sideMenuService.openMenu.value)
        this.ref.detectChanges()
    }
    ngOnInit() {
        this.sideMenuService.openMenu.subscribe(res =>{
            this.isOpen=res
        })
        console.log('--------------------- no cach 0 -------------------------------')
        this.mainTaps = this.sideMenuService.getMainTaps()
        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((e: NavigationStart) => {
            this.prepareSideMenu(e)
        });

        this.ReloadData()

        if (!localStorage.getItem('printerType')) {
            localStorage.setItem('printerType', 'normal');
        }

        this.isUserLoggedIn = this.authService.isLoggedIn;

        // 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
        setTimeout(() => (this.isAppLoaded = true), 1000);
        setTimeout(() => (this.removePrebootScreen = true), 1500);

        setTimeout(() => {
            if (this.isUserLoggedIn) {
                this.alertService.resetStickyMessage();

            }

        }, 2000);

        this.alertService
            .getDialogEvent()
            .subscribe(alert => this.showDialog(alert));
        this.alertService
            .getMessageEvent()
            .subscribe(message => this.showToast(message, false));
        this.alertService
            .getStickyMessageEvent()
            .subscribe(message => this.showToast(message, true));
            
         
        this.authService.reLoginDelegate = () =>
        (this.shouldShowLoginModal = true
            , this.logout());

        this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;

            if (this.isUserLoggedIn) {
                this.initNotificationsLoading();
            } else {
                this.unsubscribeNotifications();
            }

            setTimeout(() => {
                if (!this.isUserLoggedIn) {
                    this.alertService.showMessage(
                        this.gT("shared.Session Ended!"),
                        "",
                        MessageSeverity.default
                    );
                }
            }, 500);
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                let url = (<NavigationStart>event).url;

                if (url !== url.toLowerCase()) {
                    this.router.navigateByUrl(
                        (<NavigationStart>event).url.toLowerCase()
                    );
                }
            }
        });
    }
    prepareSideMenu(e: NavigationStart){
        this.sideMenu = this.getActiveTab(e.url).taps
        this.pageHeader = this.getActiveTab(e.url).pageHeader
        this.iconHeader = this.getActiveTab(e.url).icon
        if (this.pageHeader != 'pageHeader.Settings')
            this.sideMenu.map(val => val.isActive = val.featureNumber instanceof (Array) ? (this.checkPermissions.checkGroup(val.groupNumber, val.featureNumber[0]) || this.checkPermissions.checkGroup(val.groupNumber, val.featureNumber[1])) : this.checkPermissions.checkGroup(val.groupNumber, val.featureNumber))

        else {
            this.sideMenu[2].isActive = this.authService.userInStorage.value.roles.includes('superadmin')
            this.sideMenu[3].isActive = this.accountService.userHasPermission('users.view')
            this.sideMenu[4].isActive = this.accountService.userHasPermission('roles.view')
            this.sideMenu[6].isActive = this.accountService.userHasPermission('manageVat')
            this.sideMenu[5].isActive = this.checkPermissions.checkGroup(7, 2)
            this.sideMenu[7].isActive = this.checkPermissions.checkGroup(7, 3)
        }
         

    }
    ngOnDestroy() {
        this.unsubscribeNotifications();
        this.pauseTimer()
    }
    pauseTimer() {
        clearInterval(this.interval);
        this.StatrTimer = false
    }
    private unsubscribeNotifications() {
        if (this.notificationsLoadingSubscription)
            this.notificationsLoadingSubscription.unsubscribe();
    }

    initNotificationsLoading() {
        this.notificationsLoadingSubscription = this.notificationService
            .getNewNotificationsPeriodically()
            .subscribe(
                notifications => {
                    this.dataLoadingConsecutiveFailurs = 0;
                    this.newNotificationCount = notifications.filter(
                        n => !n.isRead
                    ).length;
                },
                error => {
                    this.alertService.logError(error);

                    if (this.dataLoadingConsecutiveFailurs++ < 20)
                        setTimeout(() => this.initNotificationsLoading(), 5000);
                    else
                        this.alertService.showStickyMessage(
                            this.gT("messages.loadError"),
                            "Loading new notifications from the server failed!",
                            MessageSeverity.error
                        );
                }
            );
    }

    markNotificationsAsRead() {
        let recentNotifications = this.notificationService.recentNotifications;

        if (recentNotifications.length) {
            this.notificationService
                .readUnreadNotification(
                    recentNotifications.map(n => n.id),
                    true
                )
                .subscribe(
                    response => {
                        for (let n of recentNotifications) {
                            n.isRead = true;
                        }

                        this.newNotificationCount = recentNotifications.filter(
                            n => !n.isRead
                        ).length;
                    },
                    error => {

                    }
                );
        }
    }

    showDialog(dialog: AlertDialog) {
        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);

                break;
            case DialogType.confirm:
                alertify.confirm(dialog.message, e => {
                    if (e) {
                        dialog.okCallback();
                    } else {
                        if (dialog.cancelCallback) dialog.cancelCallback();
                    }
                });

                break;
            case DialogType.prompt:
                alertify.prompt(
                    dialog.message,
                    (e, val) => {
                        if (e) {
                            dialog.okCallback(val);
                        } else {
                            if (dialog.cancelCallback) dialog.cancelCallback();
                        }
                    },
                    dialog.defaultValue
                );

                break;
        }
    }

    showToast(message: AlertMessage, isSticky: boolean) {
        if (message == null) {
            for (let id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        let toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };

        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) =>
                this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                let index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        }

        switch (message.severity) {
            case MessageSeverity.default:
                this.toastyService.default(toastOptions);
                break;
            case MessageSeverity.info:
                this.toastyService.info(toastOptions);
                break;
            case MessageSeverity.success:
                this.toastyService.success(toastOptions);
                break;
            case MessageSeverity.error:
                this.toastyService.error(toastOptions);
                break;
            case MessageSeverity.warn:
                this.toastyService.warning(toastOptions);
                break;
            case MessageSeverity.wait:
                this.toastyService.wait(toastOptions);
                break;
        }
    }

    logout() {
        console.log('looogout')
        // this.authService.logout();
      
        this.authService.redirectLogoutUser();
    }

    getYear() {
        return new Date().getUTCFullYear();
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    get fullName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.fullName
            : "";
    }
    async loadData() {
        this.getcurrentVersion()
        this.settingsService.getSetting().subscribe(res => {
            this.logo = res.logoPath;
        })
      
        this.settingsService.getLatestVersion().subscribe(lt => {
            console.log(lt);
            if (+lt > +this.currentVersion)
                this.isThereIsUpdate = true;
        },
            // Errors will call this callback instead:
            err => {
                console.log('Something went wrong!');
            });

        console.log(this.userr, this.authService.userInStorage.value)
    

        this.mainTaps.map((val, index) => val.active = this.checkPermissions.checkGroup(val.groupNumber, null))
        console.log(this.mainTaps)
    }
    async ReloadData() {


        let isChange: boolean = false

        //  let permission:PermissionsUser[]=this.authService.userInStorage.value.Permissions
        let permission: string[] = this.authService.userPermissions
        // permission.push('f-accounts-tree-manage')
        console.log(permission)
        if (permission.length > 0) {
            // permission.push('f-accounts-tree-manage')
            await this.authService.refreshLogin().toPromise()
            // check if permissions has chenged
            permission.forEach(element => {
                if (!this.authService.userInStorage.value.Permissions.includes(element))
                    isChange = true
            });
            this.authService.userInStorage.value.Permissions.forEach(element => {
                if (!permission.includes(element))
                    isChange = true
            });
            console.log(isChange, permission, this.authService.userInStorage.value.Permissions, permission == this.authService.userInStorage.value.Permissions)
            if (isChange) {
                this.logout()


            }

        }






        this.authService.userInStorage.subscribe(val => {
            if (val && this.authService.loadingData.value == false) {
                this.authService.loadingData.next(true)
                this.loadData()
                this.reloadPreference()
                console.log(this.translationService.getCurrentLanguage(), this.configurations.language)
                //  this.translationService.changeLanguage(this.translationService.getCurrentLanguage())
                if ((this.StatrTimer == false)) {
                    this.StatrTimer = true

                    this.startTimer(val)

                }
            }

        })
    }

    reloadPreference() {

        this.accountService.getUserPreferences().subscribe(
            (results: any) => {
                this.alertService.stopLoadingMessage();

                this.configurations.import(results);
                console.log(results)
                const root = document.documentElement;
                const theme = this.preferService.getTheme();
                root.style.setProperty("--user-theme", this.getColor[results.theme.toLowerCase()] || '#16AFDD');
                root.style.setProperty('--user-theme-secoundary', this.getSecondaryColor[results.theme.toLowerCase()] || '#143367')
                root.style.setProperty('--user-theme-background',  '#FAFAFA')

                console.log(results.theme, this.getColor[results.theme], this.getSecondaryColor[results.theme.toLowerCase()], this.getBackgroundColor[results.theme.toLowerCase()])
            },
            error => {
            }
        );
    }

    startTimer(val) {
        //this.refresh = true;
        this.interval = setInterval(async () => {
            //this.loginService.login(this.loginService.user.value.email, this.loginService.user.value.password, false).subscribe({
            //  next: (res) => {

            console.log(val)
            this.authService.login(val.email, val.Password, val.RememberMe, true).subscribe({
                next: (res) => {
                    console.log(res, 'login')
                }, error: () => {
                    console.log('*************************S')
                    this.logout()
                    this.pauseTimer()

                }
            });







            //   }})

        }, 1200000)
        //1200000)
    }
    getColor: { [key: string]: string } = {
        "purple": '#e79cc9de',
        "red": '#981717',
        "blue": '#16AFDD',
        "pink": 'rgb(234 146 166)',
        "gray": 'gray'
    }
    getSecondaryColor: { [key: string]: string } = {
        "purple": 'rgb(122 4 77)',
        "red": '#731313',
        'blue': '#143367',
        "pink": 'rgb(227, 22, 111)',
        "gray": '#3d3d3d'
    }
    getBackgroundColor: { [key: string]: string } = {
        "purple": '#FAFAFA',
        "red": '#FAFAFA',
        "blue": '#FAFAFA',
        "pink": '#FAFAFA',
        "gray": '#FAFAFA'
    }

}
