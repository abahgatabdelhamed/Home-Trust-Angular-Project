import { PrinterSettingsService } from "./../definitions/services/printer-settings.service";
import { NgModule } from "@angular/core";

//BASE_MODULES
import { SalesRoutingModule } from "./sales-routing.module";

//COMPONENTS
import { SaleComponent } from "./sale.component";
import { AbstractComponent } from "./abstract/abstract.component";
import { SaleAbstractComponent } from "../reports/sales-abstract/abstract.component";
import { CustomersComponent } from "./customers/customers.component";
import { ClientPointsComponent } from "./client-points/client-points.component";
import { StorageComponent, MyFilterPipe } from "../reports/storage/storage.component";
import { ExchangeVarietiesComponent } from "./exchange-varieties/exchange-varieties.component";
import { ExchangeVarietiesInfoComponent } from "./exchange-varieties/modal/exchange-varieties-info.component";
import { ConvertVarietiesComponent } from "./convert-varieties/convert-varieties.component";
import { DismissalVarietyComponent } from "./dismissal-variety/dismissal-variety.component";
import { ReceiptDocumentInfoComponent } from "./receipt-documents/modal/receipt-doc-info.component";
import { ReceiptDocumentsComponent } from "./receipt-documents/receipt-documents.component";
import { TransferenceVarietiesComponent } from "./transference-varieties/transference-varieties.component";

//SERVICES
import { OfferEndpoint } from "./services/offer-endpoint.service";
import { OfferService } from "./services/offer.service";
import { ItemSearchService } from "./services/item-search.service";
import { SBillEndpoint } from "./services/sbill-endpoint.service";
import { SBillService } from "./services/sbill.service";
import { PrintService } from "./services/print.service";

import { FileService } from "./services/file.service";
import { ThermalPrintService } from "./services/thermal-print.service";
import { ReceiptDocEndpoint } from "./services/receipt-document-endpoint.service";
import { ReceiptDocService } from "./services/receipt-doc.service";
import { ExchangeVarService } from "./services/exchange-varieties.service";
import { ExchangeVarEndpoint } from "./services/exchange-varieties-endpoint.service";
import { ServiceSearchService } from "./services/service-search.service";
import { PeopleSearchService } from "./services/people-search.service";

//THEME
import { ThemeModule } from "../../theme/theme.module";
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

///shared
import { SharedModule } from "../shared/shared.module";
import { PrinterSettingsEndpoint } from "../definitions/services/printer-settings-endpoint.service";
import { SalesTabsComponent } from "./sales-tabs/sale-tabs.component";

import { BranchModalComponent } from "../definitions/branch/modal/branch-info.component";
import { BranchService } from "../definitions/services/branch.service";
import { BranchEndpoint } from "../definitions/services/branch-endpoint.service";
import { BranchPDFService } from "../definitions/services/branch.pdf.service";
import { PrintBranchService } from "../definitions/services/branch.print.service";
import { TranslateService } from "@ngx-translate/core";
import { ExcelService } from "../../services/excel.service";
import { ComponentSharedModule } from "../shared/component-shared.module";
import { QRCodeModule } from 'angularx-qrcode';
import { RsaleComponent } from './rsale/rsale.component';
import { NgSelectModule } from "@ng-select/ng-select";


const BASE_MODULES = [SalesRoutingModule];

const SERVICES = [
    OfferEndpoint,
    OfferService,
    ItemSearchService,
    SBillEndpoint,
    SBillService,
    PrintService,
    FileService,
    ThermalPrintService,
    ReceiptDocService,
    ReceiptDocEndpoint,
    ExchangeVarService,
    ExchangeVarEndpoint,
    ServiceSearchService,
    PeopleSearchService,
    PrinterSettingsService,
    PrinterSettingsEndpoint,
    BranchService,
    BranchEndpoint,
    BranchPDFService,
    PrintBranchService,
    TranslateService,
    ExcelService
];

const COMPONENTS = [
    SaleComponent,
    AbstractComponent,
    CustomersComponent,
    ClientPointsComponent,
    ExchangeVarietiesComponent,
    ExchangeVarietiesInfoComponent,
    ConvertVarietiesComponent,
    DismissalVarietyComponent,
    ReceiptDocumentsComponent,
    ReceiptDocumentInfoComponent,
    SalesTabsComponent,
    TransferenceVarietiesComponent,
    
];

@NgModule({
    imports: [...BASE_MODULES, ThemeModule.forRoot(), SharedModule, TimepickerModule.forRoot(), ComponentSharedModule,NgSelectModule, QRCodeModule],
    declarations: [...COMPONENTS, RsaleComponent],
    exports: [],
    providers: [...SERVICES]
})
export class SalesModule {}
