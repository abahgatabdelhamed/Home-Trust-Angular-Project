import { AuthGuard } from "./../../services/auth-guard.service";
import { DailyAdvancedDocComponent } from "./../shared/daily-advannced/daily-advanced.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "../shared/services/view-auth-guard.service";
import { SaleComponent } from "./sale.component";
import { AbstractComponent } from "./abstract/abstract.component";
import { ClientPointsComponent } from "./client-points/client-points.component";
import { ConvertVarietiesComponent } from "./convert-varieties/convert-varieties.component";
import { CustomersComponent } from "./customers/customers.component";
import { DismissalVarietyComponent } from "./dismissal-variety/dismissal-variety.component";
import { ReceiptDocumentsComponent } from "./receipt-documents/receipt-documents.component";
import { StorageComponent } from "../reports/storage/storage.component";
import { NotFoundComponent } from "../../components/not-found/not-found.component";
import { ExchangeVarietiesComponent } from "./exchange-varieties/exchange-varieties.component";
import { SBillInfoComponent } from "../shared/sbill-info/sbill-info.component";
import { from } from "rxjs/observable/from";
import { SaleAbstractComponent } from "../reports/sales-abstract/abstract.component";
import { SalesTabsComponent } from "./sales-tabs/sale-tabs.component";
import { RsaleComponent } from './rsale/rsale.component';
import { SalesGuard } from "../../services/sales.guard";

const routes: Routes = [
    {
        path: "",
        component: SaleComponent,
         
        children: [
            {
                path: "",
                redirectTo: "",
                pathMatch: "full", 
                
            },
            {
                path: "rsale", //فاتورة الرجيع الجديدة
                component: RsaleComponent
                
            },
            {
                path: "bill/:type/:id",
                component: SBillInfoComponent,
                canActivate:[SalesGuard],
                data: {feature: 'unknow'},
             },
            // {
            //     path:  "bill/quate/new",
            //     component: SBillInfoComponent,
            //     canActivate:[SalesGuard],
            //     data: {feature: 2},
                
            // },
            // {
            //     path:  "bill/exchange/new",
            //     component: SBillInfoComponent,
            //     canActivate:[SalesGuard],
            //     data: {feature: 4},
                
            // },
            // {
            //     path:  "bill/sale/new",
            //     component: SBillInfoComponent,
            //     canActivate:[SalesGuard],
            //     data: {feature: 1},
                
            // },
           
            
            {
                path: "customers", //العملاء
                component: CustomersComponent,
            },
            {
                path: "convert-varieties", //تحويل أصناف
                component: ExchangeVarietiesComponent,
                canActivate:[SalesGuard],
                data: {feature: 5},
            },
            {
                path: "client-points", //نقاط العميل
                component: ClientPointsComponent,
            },
           
            
            {
                path: "exchange-varieties", //الفروع
                component: ExchangeVarietiesComponent
            },
            {
                path: "convert-cc", //تحويل أصناف
                component: ExchangeVarietiesComponent,
                canActivate:[SalesGuard],
                data: {feature: 6},
            },
            {
                path: "dismissal-variety",
                component: DismissalVarietyComponent,
            },
            {
                path: "sales-tabs",
                component: SalesTabsComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SalesRoutingModule {}
