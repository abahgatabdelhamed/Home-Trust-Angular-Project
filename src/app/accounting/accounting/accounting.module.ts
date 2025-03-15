
//Base Module
import { NgModule } from "@angular/core";
import { AccountingRoutingModule } from "./accounting-routing.module";

//Components
import { AccountingComponent } from "./accounting.component";
import { AccountingTreeComponent } from "./accountingtree/accountingtree.component";
import { AccountingInfoComponent } from "./accountingtree/modal/accountingtree-modal.component";
//import { DailyAdvancedDocComponent } from "./daily-advannced/daily-advanced.component";




//Services
import { AccountingService } from "./services/accounting.service";
import { AccountingEndpointService } from "./services/accounting-endpoint.service";
import { ReceiptDocEndpoint } from "../sales/services/receipt-document-endpoint.service";
import { ReceiptDocService } from "./../sales/services/receipt-doc.service";
import { VatReportEndpointService } from "../reports/services/vat-report.-endpoint.service";


//Theme
import { ThemeModule } from "../../theme/theme.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedModule } from "../shared/shared.module";

import { TreeTableModule } from "ng-treetable";

import { AccPDFService } from "../definitions/services/accounting.pdf.service";
import { AssetService } from './services/asset.service';
import { AssetEndpointService } from './services/asset-endpoint.service';
import { AssetsComponent } from './assets/assets/assets.component';
import { AddAssetComponent } from './assets/add-asset/add-asset.component';
import { PrinterSettingsEndpoint } from '../definitions/services/printer-settings-endpoint.service';
import { PrinterSettingsService } from '../definitions/services/printer-settings.service';
import { FileService } from '../sales/services/file.service';
import { PrintExchangeService } from '../shared/services/exchange-varieties.print.service';
import { ItemSearchService } from '../shared/services/item-search.service';
import { PDFService } from '../shared/services/pdf.service';
import { PeopleSearchService } from '../shared/services/people-search.service';
import { PrintService } from '../shared/services/print.service';
import { PrintDocsService } from '../shared/services/receipt-docs.print.service';
import { SBillEndpoint } from '../shared/services/sbill-endpoint.service';
import { SbillPDFService } from '../shared/services/sbill.pdf.service';
import { SBillService } from '../shared/services/sbill.service';
import { ServiceSearchService } from '../shared/services/service-search.service';
import { ThermalPrintService } from '../shared/services/thermal-print.service';
import { AuthGuardService } from '../shared/services/view-auth-guard.service';
import { BillEndpoint } from '../definitions/services/bill-endpoint.service';
import { BillService } from '../definitions/services/bill.service';
import { BillTypeEndpoint } from '../definitions/services/billtype-endpoint.service';
import { BillTypeService } from '../definitions/services/billtype.service';
import { BranchEndpoint } from '../definitions/services/branch-endpoint.service';
import { BranchPDFService } from '../definitions/services/branch.pdf.service';
import { PrintBranchService } from '../definitions/services/branch.print.service';
import { BranchService } from '../definitions/services/branch.service';
import { CustomerEndpointService } from '../definitions/services/customer-endpoint.service';
import { CustomerService } from '../definitions/services/customer.service';
import { ItemCatPDFService } from '../definitions/services/item-cat.pdf.service';
import { PrintItemCatDocsService } from '../definitions/services/item-cat.print.service';
import { ItemEndpointService } from '../definitions/services/item-endpoint.service';
import { PrintItemService } from '../definitions/services/item.print.service';
import { ItemService } from '../definitions/services/item.service';
import { ItemCatEndpoint } from '../definitions/services/itemcat-endpoint.service';
import { ItemCatService } from '../definitions/services/itemcat.service';
import { SupplierEndpointService } from '../definitions/services/supplier-endpoint.service';
import { SupplierPDFService } from '../definitions/services/supplier.pdf.service';
import { PrintSupDocsService } from '../definitions/services/supplier.print.service';
import { SupplierService } from '../definitions/services/supplier.service';
import { UserPreferencesService } from '../definitions/services/user-preferences.service';
import { VatTypeEndpointService } from '../definitions/services/vattype-endpoint.service';
import { VatTypeService } from '../definitions/services/vattype.service';
import { ExportExcelService } from '../shared/services/export-excel.service';
import { ItemPDFService } from './services/vat-report.purch.pdf.service';
import { ExchangeVarService } from '../sales/services/exchange-varieties.service';
import { ExchangeVarEndpoint } from '../sales/services/exchange-varieties-endpoint.service';
import { VatReportService } from '../reports/services/vat-report.service';
import { DeliveryAppsComponent } from './delivery-apps/delivery-apps.component';
import { AddDeliveryAppComponent } from './delivery-apps/add-delivery-app/add-delivery-app.component';

const COMPONENTS = [
    AccountingComponent,
    AccountingTreeComponent,
    AccountingInfoComponent,
  DeliveryAppsComponent,
  AddDeliveryAppComponent,
    // DailyAdvancedDocComponent
];


const SERVICES = [
    ReceiptDocService,
    ReceiptDocEndpoint,
    AccPDFService,
    AccountingEndpointService,
    AccountingService,
    AssetService,
    AssetEndpointService,
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
    BillTypeService,
    BillTypeEndpoint,
    ItemCatService,
    ItemCatEndpoint,
    ItemEndpointService,
    ItemService,
    SupplierEndpointService,
    SupplierService,
    CustomerEndpointService,
    CustomerService,
    VatTypeService,
    VatTypeEndpointService,
    ItemCatPDFService,
    BranchEndpoint,
    PrintSupDocsService,
    SupplierPDFService,
    BranchService,
    BillService,
    BillEndpoint,
    UserPreferencesService,
    PrinterSettingsEndpoint,
    PrinterSettingsService,
    ItemPDFService,
    BranchPDFService,
    PrintBranchService,
    PrintItemCatDocsService,
    PrintItemService,
    ItemSearchService,
    ExportExcelService,
    ExchangeVarService,
    ExchangeVarEndpoint,
    VatReportService,
    VatReportEndpointService
];

@NgModule({
    imports: [
        AccountingRoutingModule,
        ThemeModule.forRoot(),
        BsDatepickerModule.forRoot(),
        SharedModule,
        TreeTableModule
    ],
    declarations: [...COMPONENTS, AssetsComponent, AddAssetComponent, DeliveryAppsComponent, AddDeliveryAppComponent],
    providers: [...SERVICES]
})
export class AccountingModule {}
