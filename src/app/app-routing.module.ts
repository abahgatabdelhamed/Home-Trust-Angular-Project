import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./services/auth-guard.service";
import { AuthGuardService } from "./accounting/shared/services/view-auth-guard.service";
import { AccountingGuard } from "./services/accounting.guard";
import { PurchGuard  } from "./services/purch.guard";
import { PurchComponent } from "./accounting/purch/purch.component";
import { SalesGuard } from "./services/sales.guard";
import { ReportsGuard } from "./services/reports.guard";
import { StatementsGuard } from "./services/statements.guard";
import { DefinitionsGuard } from "./services/definitions.guard";
import { SettingGuard } from "./services/setting.guard";
import { ToolsGuard } from "./services/tools.guard";


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: "",
                component: HomeComponent,
                canActivate: [AuthGuard],
                data: { title: "Home" }
            },

            {
                path: "login",
                component: LoginComponent,
                data: { title: "Login" }
            },
            {
                path: "settings",
                component: SettingsComponent,
                canActivate: [AuthGuard, AuthGuardService],
                data: { title: "Settings" }
            },
            {
                path: "sales",
                loadChildren: "./accounting/sales/sales.module#SalesModule",
                canActivate: [AuthGuardService,SalesGuard],
                data: {feature: null},
            },
            {
                path: "purch",
                loadChildren: "./accounting/purch/purch.module#PurchModule",
                canActivate: [AuthGuardService,PurchGuard],
                data: {feature: null},
            },
            {
                path: "accounting",
                loadChildren:
                    "./accounting/accounting/accounting.module#AccountingModule",
                canActivate: [AuthGuardService,AccountingGuard],
                data: {feature: null},
            },
            {
                path: "reports",
                loadChildren:
                    "./accounting/reports/reports.module#ReportsModule",
                canActivate: [AuthGuardService,ReportsGuard],
                data: {feature: null},
            },
            {
                path: "definitions",
                loadChildren:
                    "./accounting/definitions/definitions.module#DefinitionsModule",
                canActivate: [AuthGuardService,DefinitionsGuard],
                data: {feature: null},
            },
            {
                path: "tools",
                loadChildren:
                    "./accounting/tools/tools.module#ToolsModule",
                canActivate: [AuthGuardService,ToolsGuard],
                data: {feature: null},
            },
            {
                path: "permissions",
                loadChildren:
                    "./accounting/permissions/permissions.module#PermissionsModule",
                canActivate: [AuthGuardService,StatementsGuard],
                data: {feature: null},
            },
            {
                path: "about",
                component: AboutComponent,
                data: { title: "About Us" }
            },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            {
                path: "**",
                component: NotFoundComponent,
                data: { title: "Page Not Found" }
            },
            {
                path: "notFound",
                component: NotFoundComponent,
                data: { title: "Page Not Found" }
            }
        ])
    ],
    exports: [RouterModule],
    providers: [AuthService, AuthGuard]
})
export class AppRoutingModule {}
