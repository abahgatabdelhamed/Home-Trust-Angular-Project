import { ExportExcelService } from './../shared/services/export-excel.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ReportsAmountComponent } from './reports-amount/reports-amount.component';
import { NgSelectModule } from "@ng-select/ng-select"
import { BsDatepickerModule, TimepickerModule } from "ngx-bootstrap"
import { ThemeModule } from "../../theme/theme.module"
import { SharedModule } from "../shared/shared.module"
import { ReportsRoutingModule } from "./reports-routing.module"
import { NgModule } from "@angular/core";
import { ItemSearchService } from '../shared/services/item-search.service';

import { BillsComponent } from './bills/bills.component';
import { ReportsHomePageComponent } from './reports-home-page/reports-home-page.component';
import { PeopleDueAmountReportComponent } from './people-due-amount-report/people-due-amount-report.component';
import { ProductionBillComponent } from './production-bill/production-bill.component';

import { ReportsEndpointService } from './services/reports-endpoint.service';
import { ReportsService } from './services/reports.service';
import { ProductionService } from '../purch/services/production.service';
import { VatReportComponent } from './vat-report/vat-report.component';
import { VatReportEndpointService } from './services/vat-report.-endpoint.service';
import { VatReportService } from './services/vat-report.service';
import { MyFilterPipe, StorageComponent } from './storage/storage.component';
import { BranchService } from '../definitions/services/branch.service';
import { SupplierInfoComponent } from './supplier-report/supplier-info.component';
import { SupplierService } from '../definitions/services/supplier.service';
import { SupplierEndpointService } from '../definitions/services/supplier-endpoint.service';
import { PrinterSettingsEndpoint } from '../definitions/services/printer-settings-endpoint.service';
import { PrinterSettingsService } from '../definitions/services/printer-settings.service';
import { PrintSupDocsService } from '../definitions/services/supplier.print.service';
import { SupplierPDFService } from '../definitions/services/supplier.pdf.service';
import { AlertService } from '../../services/alert.service';
import { ItemsReportComponent } from './items-report/items-report.component';
import { ItemService } from '../definitions/services/item.service';
import { ItemEndpointService } from '../definitions/services/item-endpoint.service';
import { SaleAbstractComponent } from './sales-abstract/abstract.component';
import { SBillEndpoint } from '../sales/services/sbill-endpoint.service';
import { SBillService } from '../sales/services/sbill.service';
import { ExcelService } from '../../services/excel.service';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ViewShiftComponent } from './shifts/view-shift/view-shift.component';
import { PrintAbstractService } from './services/print-abstruct.print.service';
import { DecimalPipe } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ShiftsPrintService } from './services/shifts.print.service';
import { TobaccoReportComponent } from './tobacco-report/tobacco-report.component';
import { TobaccoAbstractService } from './services/tobacco-abstruct.print.service';
import { CostCenterReportComponent } from './cost-center-report/cost-center-report.component';
import { CostCenterProductionReportComponent } from './cost-center-production-report/cost-center-production-report.component';



const BASE_MODULES =[
    ReportsRoutingModule,

]

const SERVICES = [
    BranchService,
    ReportsService,
    ReportsEndpointService,
    ItemSearchService,
    ExportExcelService,
    ProductionService,
    VatReportEndpointService,
    VatReportService,
    SupplierService,
    SupplierEndpointService,
    PrinterSettingsEndpoint,
    PrinterSettingsService,
    PrintSupDocsService,
    SupplierPDFService,
    AlertService,
    ItemService,
    ItemEndpointService,
    SBillService,
    SBillEndpoint,
    ExcelService,
    PrintAbstractService,
    DecimalPipe,
    ShiftsPrintService,
    TobaccoAbstractService
    
]

const COMPONENTS =[
    ReportsAmountComponent,
    ReportsHomePageComponent,
    PeopleDueAmountReportComponent,
    BillsComponent,
    ProductionBillComponent,
    VatReportComponent,
    StorageComponent,
    MyFilterPipe,
    SupplierInfoComponent,
    ItemsReportComponent,
    SaleAbstractComponent,
    ProfitReportComponent,
    ShiftsComponent,
    ViewShiftComponent
]

@NgModule({
    imports: [
        ...BASE_MODULES,
        ThemeModule.forRoot(),
        SharedModule,
        BsDatepickerModule.forRoot(),
        NgSelectModule,
        TimepickerModule.forRoot(),
        NgxPrintModule,
        
    ],
    declarations: [
        ...COMPONENTS,
        ItemsReportComponent,
        ShiftsComponent,
        ViewShiftComponent,
        TobaccoReportComponent,
        CostCenterReportComponent,
        CostCenterProductionReportComponent,



    ],
    exports: [],
    providers: [...SERVICES]
})

export class ReportsModule {}
