import { ReportsHomePageComponent } from './reports-home-page/reports-home-page.component';
import { ReportsAmountComponent } from './reports-amount/reports-amount.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PeopleDueAmountReportComponent } from './people-due-amount-report/people-due-amount-report.component';
import { BillsComponent } from './bills/bills.component';
import { ProductionBillComponent } from './production-bill/production-bill.component';
import { VatReportComponent } from './vat-report/vat-report.component';
import { StorageComponent } from './storage/storage.component';
import { SupplierInfoComponent } from './supplier-report/supplier-info.component';
import { ItemsReportComponent } from './items-report/items-report.component';
import { SaleAbstractComponent } from './sales-abstract/abstract.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ReportsGuard } from '../../services/reports.guard';
import { ShiftsComponent } from './shifts/shifts.component';
import { SBillInfoComponent } from '../shared/sbill-info/sbill-info.component';
import { TobaccoReportComponent } from './tobacco-report/tobacco-report.component';
import { CostCenterReportComponent } from './cost-center-report/cost-center-report.component';
import { CostCenterProductionReportComponent } from './cost-center-production-report/cost-center-production-report.component';

const routes: Routes = [
    {
        path: '',
        component: ReportsHomePageComponent,
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: "full"
            },
            {
                path: "bills",
                component: BillsComponent,
                canActivate: [ReportsGuard],
                data: {feature: 1},
            },
            {
                path: "bills/bill/:type/:id", //فاتورة شراء
                component: SBillInfoComponent,
                canActivate:[ReportsGuard],
                data: {feature: 1},
            },
            {
                path: "production",
                component: ProductionBillComponent,
                canActivate: [ReportsGuard],
                data: {feature: 2},
            },
            {
                path: 'sold-items',
                component: ReportsAmountComponent,
                canActivate: [ReportsGuard],
                data: {feature: 3},
            },
            {
                path: 'due-amount',
                component: PeopleDueAmountReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 4},
            },
            {
                path: "vat-reports", //تقارير الضرائب
                component: VatReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 5},
            },
            {
                path: "vat-reports-purch", //تقارير الضرائب
                component: VatReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 6},
            },
            {
                path: "vat-reports-sales", //تقارير الضرائب
                component: VatReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 7},
            },
            {
                path: "storage", //جرد المستودع
                component: StorageComponent,
                canActivate: [ReportsGuard],
                data: {feature: 8},
            },
            {
                path: "supplier-info",//كشف حساب
                component: SupplierInfoComponent,
                canActivate: [ReportsGuard],
                data: {feature: 9},

            },
            {
                path: "customer-info",//كشف حساب
                component: SupplierInfoComponent,
                canActivate: [ReportsGuard],
                data: {feature: 10},

            },
            {
                path: "item-report",//كشف حساب
                component: ItemsReportComponent,
                canActivate: [ReportsGuard],
                data: {feature:11},

            },
            {
                path: "abstract", //ملخص
                component: TobaccoReportComponent,
                canActivate: [ReportsGuard],
                data: {feature:12},
            },
            {
                path: "abstract-tobacco", //ملخص
                component: VatReportComponent,
                canActivate: [ReportsGuard],
                data: {feature:17},
            },
            {
                path: "profit-reports", //تقارير الضرائب
                component: ProfitReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 13},
            },
            
            {
                path: "profit-cc-reports", //تقارير الضرائب
                component: ProfitReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 15},
            },
            {
                path: "profit-branch-reports",
                component: ProfitReportComponent,
                canActivate: [ReportsGuard],
                data: {feature: 14},
            },
            {
                path: 'shifts',
                component: ShiftsComponent,
                canActivate: [ReportsGuard],
                data: {feature: 16},
            },
            
            {
                path: 'cost-center',
                component: CostCenterReportComponent,
                canActivate: [ReportsGuard],
               data: {feature: 19},
            },
               
            {
                path: 'cost-center-production',
                component: CostCenterProductionReportComponent,
                canActivate: [ReportsGuard],
               data: {feature: 19},
            },
        ],
    }

]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportsRoutingModule { }
