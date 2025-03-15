import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PurchComponent } from "./purch.component";
import { SBillInfoComponent} from "../shared/sbill-info/sbill-info.component";
import{ ExpensesComponent } from "./expenses/expenses.component"
import { AddProductionBillComponent } from "./add-production-bill/add-production-bill.component";
import { RpurchComponent } from "./rpurch/rpurch.component";
import { PurchGuard } from "../../services/purch.guard";
const routes: Routes = [
    {
        path: "",
        component: PurchComponent,
        children: [
            {
                path: "",
                redirectTo: "",
                pathMatch: "full"
            },
            {
                path: "bill/:type/:id", //فاتورة شراء
                component: SBillInfoComponent,
                canActivate:[PurchGuard],
                data: {feature: 'unknow'},
            },
            {
                path: "expenses",
                component: ExpensesComponent,
                canActivate:[PurchGuard],
                data: {feature: 3},
            },
            {
                path: "add-production-bill/:id",
                component: AddProductionBillComponent,
                canActivate:[PurchGuard],
                data: {feature: 4},
            },
            {
                path: "rpurch",
                component: RpurchComponent,
                // canActivate:[PurchGuard],
                // data: {feature: 2},
            }

        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchRoutingModule {}
