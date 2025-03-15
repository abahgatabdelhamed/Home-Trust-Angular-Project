import { NgModule } from "@angular/core";

//BASE_MODULES
import { PurchRoutingModule } from "./purch-routing.module";

//COMPONENTS
import { PurchComponent } from "./purch.component";
import { ExpensesComponent } from "./expenses/expenses.component"

//SERVICES
import { ExpensesEndpoint } from "./services/expenses-endpoint.service";
import { ExpensesService } from "./services/expenses.service"
import { PeopleSearchService } from "../shared/services/people-search.service";
import { ExpensePDFService } from "./services/expense.pdf.service";
import { ExpensesInfoComponent } from "./expenses/modal/expenses-info.component";
import { ProductionService } from "./services/production.service";
import { CostCenterService } from "../definitions/services/cost-center.service";




//THEME
import { ThemeModule } from "../../theme/theme.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";


//shared
import { SharedModule } from "../shared/shared.module";
import { PrintExpensesService } from "./services/expense.print.service";
import { PrinterSettingsService } from "../definitions/services/printer-settings.service";
import { AddProductionBillComponent } from './add-production-bill/add-production-bill.component';
import { RpurchComponent } from './rpurch/rpurch.component';

const BASE_MODULES =[
    PurchRoutingModule
]

const SERVICES = [
    ExpensesEndpoint,
    ExpensesService,
    ExpensePDFService,
    PeopleSearchService,
    PrintExpensesService,
    PrinterSettingsService,
    ProductionService,
    CostCenterService
]

const COMPONENTS =[
    PurchComponent,
    ExpensesComponent,
    ExpensesInfoComponent,
    AddProductionBillComponent,
]

@NgModule({
    imports: [
        ...BASE_MODULES,
        ThemeModule.forRoot(),
        SharedModule,
        BsDatepickerModule.forRoot(),
        NgSelectModule
    ],
    declarations: [
        ...COMPONENTS,
        RpurchComponent,
        
    ],
    exports: [],
    providers: [...SERVICES]
})
export class PurchModule {}
