import { NgModule, ErrorHandler } from "@angular/core";
import { AppErrorHandler } from "./app-error.handler";

//Base_Modules
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

//TRANSLATE
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import {
    AppTranslationService,
    TranslateLanguageLoader
} from "./services/app-translation.service";

//Services
import { AppTitleService } from "./services/app-title.service";
import { ConfigurationService } from "./services/configuration.service";
import { AlertService } from "./services/alert.service";
import { LocalStoreManager } from "./services/local-store-manager.service";
import { EndpointFactory } from "./services/endpoint-factory.service";
import { NotificationService } from "./services/notification.service";
import { NotificationEndpoint } from "./services/notification-endpoint.service";
import { AccountService } from "./services/account.service";
import { AccountEndpoint } from "./services/account-endpoint.service";
import { SettingsService } from "./services/settings.service";
import { SettingsEndpoint } from "./services/settings-endpoint.service";
import { ExcelService } from "./services/excel.service";
import { UserPreferencesService } from "./accounting/definitions/services/user-preferences.service";
import { StaticsServiceService } from "./services/New_Service/StaticsService.service";

//pips
import { GroupByPipe } from "./pipes/group-by.pipe";

//Components
import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { BannerDemoComponent } from "./components/controls/banner-demo.component";
import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { BackupManagementComponent } from "./components/controls/backup-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";

//THEME_MODULE
import { ThemeModule } from "./theme/theme.module";
import { AuthGuardService } from "./accounting/shared/services/view-auth-guard.service";
import { RequesthandlerInterceptor } from "./interceptor/requesthandler.interceptor";
import { HTTP_INTERCEPTORS ,HttpClientModule} from "@angular/common/http";
import { AssetService } from "./accounting/accounting/services/asset.service";
import { AssetEndpointService } from "./accounting/accounting/services/asset-endpoint.service";
import { ReportsGuard } from "./services/reports.guard";
import { SalesGuard } from "./services/sales.guard";
import { PurchGuard } from "./services/purch.guard";
import { StatementsGuard } from "./services/statements.guard";
import { AccountingGuard } from "./services/accounting.guard";
import { CheckPermissionsService } from "./services/check-permissions.service";
import { DefinitionsGuard } from "./services/definitions.guard";
import { SettingGuard } from "./services/setting.guard";
import { ToolsComponent } from './accounting/tools/tools.component';
import { ToolsGuard } from "./services/tools.guard";
import { ItemCatService } from "./accounting/definitions/services/itemcat.service";
import { ItemCatEndpoint } from "./accounting/definitions/services/itemcat-endpoint.service";
import { ItemService } from "./accounting/definitions/services/item.service";
import { ItemEndpointService } from "./accounting/definitions/services/item-endpoint.service";
import { SideBarMenuService } from "./services/side-bar-menu.service";
import { ReportsService } from "./accounting/reports/services/reports.service";
import { ReportsEndpointService } from "./accounting/reports/services/reports-endpoint.service";
import { SBillService } from "./accounting/shared/services/sbill.service";
import { SBillEndpoint } from "./accounting/shared/services/sbill-endpoint.service";
import { StatisticsComponent } from "./components/Statistics/Statistics.component";
import { ChartsComponent } from "./components/Statistics/Charts/Charts.component";
import { ReportsComponent } from "./components/Statistics/Reports/Reports.component";
import { ArabicMonthPipe } from './arabic-month.pipe';
import { MonthlyGoalServiceService } from "./services/New_Service/MonthlyGoalService.service";
import { FinancialGoalsComponent } from "./components/Statistics/FinancialGoals/FinancialGoals.component";


const BASE_MODULES = [BrowserModule, BrowserAnimationsModule, AppRoutingModule,HttpClientModule, ChartsModule ,FormsModule ];

const SERVICES = [
    AppTitleService,
    AppTranslationService,
    ConfigurationService,
    AlertService,
    LocalStoreManager,
    EndpointFactory,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    AccountEndpoint,
    ExcelService,
    SettingsService,
    AssetService,
    AssetEndpointService,
    SettingsEndpoint,
    UserPreferencesService,
    AuthGuardService,
    ReportsGuard,
    SalesGuard,
    PurchGuard,
    StatementsGuard,
    AccountingGuard,
    CheckPermissionsService,
    StatementsGuard,
    DefinitionsGuard,
    SettingGuard,
    ToolsGuard,
    ItemService,
    ItemEndpointService,
    SideBarMenuService,
    ReportsService,
    ReportsEndpointService,
    SBillService,
    SBillEndpoint,
    StaticsServiceService, 
    MonthlyGoalServiceService
    
    
];

const COMPONENTS = [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    AboutComponent,
    NotFoundComponent,
    BannerDemoComponent,
    StatisticsDemoComponent,
    NotificationsViewerComponent,
    UserInfoComponent,
    UserPreferencesComponent,
    UsersManagementComponent,
    RolesManagementComponent,
    BackupManagementComponent,
    RoleEditorComponent,
    StatisticsComponent,
    ChartsComponent , 
    ReportsComponent,
    FinancialGoalsComponent
];

const PIPS = [GroupByPipe];

@NgModule({
    imports: [
        ...BASE_MODULES,
        
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        ThemeModule.forRoot()
    ],
    declarations: [...COMPONENTS, ...PIPS, ArabicMonthPipe],
    providers: [
        { provide: "BASE_URL", useFactory: getBaseUrl },
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: RequesthandlerInterceptor, multi: true },
        ...SERVICES
    ],
    
    bootstrap: [AppComponent]
})
export class AppModule {}

export function getBaseUrl() {
    return document.getElementsByTagName("base")[0].href;
}
