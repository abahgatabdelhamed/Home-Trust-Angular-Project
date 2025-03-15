import { SettingsEndpoint } from './../../services/settings-endpoint.service';
import { SettingsService } from './../../services/settings.service';
import { RouterModule } from '@angular/router';
import { DailyAdvancedDocComponent } from "./daily-advannced/daily-advanced.component";

import { NgModule } from "@angular/core";
import { ThemeModule } from "../../theme/theme.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";

//components
import { SBillInfoComponent } from "./sbill-info/sbill-info.component";
import { BranchCcFilterComponent } from "./branch-cc-filter/branch-cc-filter.component";

//services
import { ItemSearchService } from "./services/item-search.service";
import { PeopleSearchService } from "./services/people-search.service";
import { PrintService } from "./services/print.service";
import { SBillEndpoint } from "./services/sbill-endpoint.service";
import { AuthGuardService } from "../shared/services/view-auth-guard.service";
import { SBillService } from "./services/sbill.service";
import { ServiceSearchService } from "./services/service-search.service";
import { ThermalPrintService } from "./services/thermal-print.service";
import { FileService } from "./services/file.service";
import { DailyDocumentInfoComponent } from "./daily-advannced/modal/daily-advanced-info.component";
import { PrinterSettingsService } from "../definitions/services/printer-settings.service";
import { PrinterSettingsEndpoint } from "../definitions/services/printer-settings-endpoint.service";
import { PDFService } from "./services/pdf.service";
import { PrintDocsService } from "./services/receipt-docs.print.service";
import { PrintExchangeService } from "./services/exchange-varieties.print.service";
import { SbillPDFService } from './services/sbill.pdf.service';
import { QRCodeModule } from 'angularx-qrcode';
import { CostCenterService } from '../definitions/services/cost-center.service';
import { BranchService } from '../definitions/services/branch.service';
import { BranchEndpoint } from '../definitions/services/branch-endpoint.service';
import { ExportExcelService } from './services/export-excel.service';
import { TimepickerModule } from 'ngx-bootstrap';
import { ReportsService } from '../reports/services/reports.service';
import { ReportsEndpointService } from '../reports/services/reports-endpoint.service';
import { ServiceTypeService } from '../definitions/services/service-type.service';
import { ServiceTypeEndpoint } from '../definitions/services/service-type-endpoint.service';
import { NewBillService } from './services/NewBillprint.service';
import { AccountSearchService } from './services/account-search.service';

const SERVICES = [
    ItemSearchService,
    SBillEndpoint,
    SBillService,
    PrintService,
    ThermalPrintService,
    ServiceSearchService,
    PeopleSearchService,
    FileService,
    PrinterSettingsService,
    PrinterSettingsEndpoint,
    PDFService,
    AuthGuardService,
    PrintDocsService,
    PrintExchangeService,
    PrinterSettingsEndpoint,
    PrinterSettingsService,
    SbillPDFService,
    CostCenterService,
    BranchService,
    BranchEndpoint,
    ExportExcelService,
    ReportsService,
    ReportsEndpointService,
    ServiceTypeService,
    ServiceTypeEndpoint,
    NewBillService,
    AccountSearchService
];

const COMPONENTS = [
    SBillInfoComponent,
    DailyAdvancedDocComponent,
    DailyDocumentInfoComponent,
    BranchCcFilterComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        ThemeModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        NgSelectModule,
        RouterModule,
        QRCodeModule
    ],
    providers: [...SERVICES],
    exports: [...COMPONENTS, NgSelectModule]
})
export class SharedModule {}
