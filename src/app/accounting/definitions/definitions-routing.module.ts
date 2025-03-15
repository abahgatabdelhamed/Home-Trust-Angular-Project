import { PrinterSettingsComponent } from "./printer-settings/printer-settings.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { BillTypeComponent } from "./billtype/billtype.component";
import { ItemCatComponent } from "./itemcat/itemcat.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { AddItemComponent } from "./add-item/add-item.component";
import { ItemComponent } from "./item/item.component";
import { AddBranchComponent } from "./add-branch/add-branch.component";
import { BranchComponent } from "./branch/branch.component";
import { AddVatTypeComponent } from "./add-vat-type/add-vat-type.component";
import { VatTypeComponent } from "./vat-type/vat-type.component";
import { ExpensesTemplateComponent } from "./expenses-template/expenses-template.component";
import { ExpensesTreeComponent } from "./expenses-tree/expenses-tree.component";
import { CostCenterComponent } from "./cost-center/cost-center.component";
import { AccountingTabelComponent } from "./daily-advannced/daily-advanced.component";


import { ServiceTypeComponent } from "./service-type/service-type.component";
import { DefinitionsGuard } from "../../services/definitions.guard";
import { ViewTablesComponent } from "./tables/view-tables/view-tables.component";
import { DiscountManagementComponent } from "./discount-management/discount-management.component";

const routes: Routes = [
    {
        path: "",
        component: DefinitionsComponent,
        children: [
            {
                path: "",
                redirectTo: "",
                pathMatch: "full"
            },
            {
                path: "item",
                component: ItemComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 2},
            },
            {
                path: "billtype", //أنواع الفواتير
                component: BillTypeComponent,
            },
            {
                path: "itemcat", //مجموعات الأصناف
                component: ItemCatComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 1},
            },
            {
                path: "supplier", //موردون
                component: SupplierComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 5},
            },
            {
                path: "customer", //عملاء
                component: SupplierComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 6},
            },
            {
                path: "item/add-item/:id", //تعديل صنف
                component: AddItemComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 2},
            },
            {
                path: "item/add-item", //إضافة صنف
                component: AddItemComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 2},
            },
            {
                path: "branch", //المخزون
                component: BranchComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 8},
            },
            {
                path: "branch/add-branch/:id", //تعديل فرع
                component: AddBranchComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 8},
            },
            {
                path: "branch/add-branch", //إضافة فرع
                component: AddBranchComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 8},
            },
            {
                path: "vat-type", //نوع الضريبة
                component: VatTypeComponent
            },
            {
                path: "vat-type/add-vat-type/:id", //إضافة ضريبة
                component: AddVatTypeComponent
            },
            {
                path: "vat-type/add-vat-type", //تعديل ضريبة
                component: AddVatTypeComponent
            },
            {
                path: "printer-settings", // إعدادات الطابعة
                component: PrinterSettingsComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 11},
            },
            {
                path: "discount-management", // إعدادات الطابعة
                component: DiscountManagementComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 10},
            },
            {
                path: "expenses-template",
                component: ExpensesTemplateComponent,
                canActivate: [DefinitionsGuard],
                data: {feature:9 },
            },
            {
                path: "expenses-template/expenses-tree/:headId",
                component: ExpensesTreeComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 9},
            },
            {
                path: "branch/cost-center/:branchId",
                component: CostCenterComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 12},
            },
            {
                path: "acc-table", //جدول الحسابات
                component: AccountingTabelComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 7},
            },
            {
                path: "tables", //جدول الحسابات
                component: ViewTablesComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 4},
            },
            {
                path: "service-type",
                component: ServiceTypeComponent,
                canActivate: [DefinitionsGuard],
                data: {feature: 3},
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefinitionsRoutingModule {}
