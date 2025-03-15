
import { ProfitReportComponent } from "../reports/profit-report/profit-report.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountingComponent } from "./accounting.component";
import { AccountingTreeComponent } from "./accountingtree/accountingtree.component";
import { DailyAdvancedDocComponent } from "../shared/daily-advannced/daily-advanced.component";

import { AssetsComponent } from "./assets/assets/assets.component";
import { AddAssetComponent } from "./assets/add-asset/add-asset.component";
import { AuthGuardService } from "../shared/services/view-auth-guard.service";
import { AccountingGuard } from "../../services/accounting.guard";
import { DeliveryAppsComponent } from "./delivery-apps/delivery-apps.component";

const routes: Routes = [
    {
        path: "",
        component: AccountingComponent,
        children: [
            {
                path: "",
                redirectTo: "",
                pathMatch: "full"
            },
            {
                path: "accountingtree", //أنواع الفواتير
                component: AccountingTreeComponent,
                canActivate:[AccountingGuard],
                data: {feature: 1},
            },
            {
                path: "daily", // مقبوضات يومية
                component: DailyAdvancedDocComponent,
                canActivate:[AccountingGuard],
                data: {feature: 5},
            },
            {
                path: "daily-advanced", //يومية متقدمة
                component: DailyAdvancedDocComponent,
                canActivate:[AccountingGuard],
                data: {feature: 6},
            },
            {
                path: "deposits", //إيداعات
                component: DailyAdvancedDocComponent,
                canActivate:[AccountingGuard],
                data: {feature: 4},
            },
            {
                path: "receipts", // مقبوضات
                component: DailyAdvancedDocComponent,
                canActivate:[AccountingGuard],
                data: {feature: 2},
            },
            {
                path: "payments", // مقبوضات
                component: DailyAdvancedDocComponent,
                canActivate:[AccountingGuard],
                data: {feature: 3},
            },
         
          
            {
                path: "assets", //أصول المحاسبة
                component: AssetsComponent,
                canActivate:[AccountingGuard],
                data: {feature: 10},
            },
            {
                path: "newassets", //أصول المحاسبة
                component: AddAssetComponent,
                canActivate:[AccountingGuard],
                data: {feature: 9},
            },
            {
                path: "newassets/:id", //أصول المحاسبة
                component: AddAssetComponent,
                canActivate:[AccountingGuard],
                data: {feature: 9},
            },
            {
                path: "showassets/:id", //أصول المحاسبة
                component: AddAssetComponent,
                canActivate:[AccountingGuard],
                data: {feature: 10},
            },
            {
                path: "receipt-documents", //سند قبض
                component: DailyAdvancedDocComponent,
                canActivate: [AuthGuardService,AccountingGuard],
                data: {feature: 7},
            },
            {
                path: "payment-documents", //سند قبض
                component: DailyAdvancedDocComponent,
                canActivate: [AuthGuardService,AccountingGuard],
                data: {feature: 8},
            },
            {
                path: "delivery-apps", //سند قبض
                component: DeliveryAppsComponent,
                canActivate: [AuthGuardService,AccountingGuard],
                data: {feature: 11},
            },
        ]
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule {}
