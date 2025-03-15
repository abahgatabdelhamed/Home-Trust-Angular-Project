import { ExportExcelService } from './../shared/services/export-excel.service';
import { PrintItemService } from './services/item.print.service';
import { PrintSupDocsService } from './services/supplier.print.service';
import { PrintItemCatDocsService } from './services/item-cat.print.service';
import { BranchPDFService } from './services/branch.pdf.service';
import { TreeTableModule } from "ng-treetable";
//Base Module
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { DefinitionsRoutingModule } from "./definitions-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";

//Components
import { DefinitionsComponent } from "./definitions.component";
import { BillTypeComponent } from "./billtype/billtype.component";
import { ItemCatComponent } from "./itemcat/itemcat.component";
import { BillTypeInfoComponent } from "./billtype/modal/billtype-info.component";
import { ItemCatInfoComponent } from "./itemcat/modal/itemcat-info.component";
import { AddItemComponent } from "./add-item/add-item.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { SupplierInfoComponent } from "./supplier/modal/supplier-info.component";
import { ItemModalComponent } from "./item/item-modal/item-modal.component";
import { ItemComponent } from "./item/item.component";
import { BranchComponent } from "./branch/branch.component";
import { BranchModalComponent } from "./branch/modal/branch-info.component";
import { AddBranchComponent } from "./add-branch/add-branch.component";
import { VatTypeComponent } from "./vat-type/vat-type.component";
import { VatTypeModalComponent } from "./vat-type/vat-type-modal/vat-type-info.component";
import { PrinterSettingsComponent } from "./printer-settings/printer-settings.component";
import { CustomerComponent } from "./customer/customer-person.component";
import { CustomerInfoComponent } from "./customer/modal/customer-person-info.component";
import { ServiceTypeComponent } from "./service-type/service-type.component";
import { ServiceTypeInfoComponent } from "./service-type/modal/service-type-info.component";

//Services
import { BillTypeService } from "./services/billtype.service";
import { BillTypeEndpoint } from "./services/billtype-endpoint.service";
import { ItemCatService } from "./services/itemcat.service";
import { ItemCatEndpoint } from "./services/itemcat-endpoint.service";
import { SupplierEndpointService } from "./services/supplier-endpoint.service";
import { SupplierService } from "./services/supplier.service";
import { ItemCatPDFService } from './services/item-cat.pdf.service';
import { CustomerService } from "./services/customer.service";
import { CustomerEndpointService } from "./services/customer-endpoint.service";
import { ItemEndpointService } from "./services/item-endpoint.service";
import { ItemService } from "./services/item.service";
import { VatTypeService } from "./services/vattype.service";
import { VatTypeEndpointService } from "./services/vattype-endpoint.service";
import { BranchEndpoint } from "./services/branch-endpoint.service";
import { BranchService } from "./services/branch.service";
import { BillService } from "./services/bill.service";
import { BillEndpoint } from "./services/bill-endpoint.service";
import { AddVatTypeComponent } from "./add-vat-type/add-vat-type.component";
import { UserPreferencesService } from "./services/user-preferences.service";
import { PrinterSettingsEndpoint } from "./services/printer-settings-endpoint.service";
import { PrinterSettingsService } from "./services/printer-settings.service";
import { ItemPDFService } from "./services/item.pdf.service";
import { ItemSearchService } from '../shared/services/item-search.service';
import { ExpensesTemplateService } from "./services/expenses-template.service";
import { ExpensesTreeService } from './services/expenses-tree.service';
import { CostCenterService } from './services/cost-center.service';
import { ServiceTypeEndpoint } from "./services/service-type-endpoint.service";
import { ServiceTypeService } from "./services/service-type.service";
import { ServiceTypePDFService } from "./services/service.type.pdf.service";
import { PrintSerService } from "./services/service.print.service";

//Theme
import { ThemeModule } from "../../theme/theme.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SupplierPDFService } from "./services/supplier.pdf.service";
import { PrintBranchService } from './services/branch.print.service';
import { ComponentSharedModule } from '../shared/component-shared.module';
import { WithVatModalComponent } from './add-item/with-vat-modal/with-vat-modal.component';
import { ExpensesTemplateComponent } from './expenses-template/expenses-template.component';
import { ExpensesTreeComponent } from './expenses-tree/expenses-tree.component';
import { CostCenterComponent } from './cost-center/cost-center.component';

import { AccountingTableInfoComponent } from './daily-advannced/modal/accountingtree-modal.component';
import { AccountingTabelComponent } from './daily-advannced/daily-advanced.component';
import { AccountingService } from '../accounting/services/accounting.service';
import { AccountEndpoint } from '../../services/account-endpoint.service';
import { AccountingEndpointService } from '../accounting/services/accounting-endpoint.service';
import { AccPDFService } from './services/accounting.pdf.service';
import { PrintAccService } from './services/acc.print.service';
import { ViewTablesComponent } from './tables/view-tables/view-tables.component';
import { TablesService } from './services/table.service';
import { TableEndpoint } from './services/table-endpoint.service';
import { AddTableComponent } from './tables/add-table/add-table.component';
import { BsModalRef } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { DiscountManagementComponent } from './discount-management/discount-management.component';
import { DiscountManagementService } from './services/discount-management.service';
import { DiscountManagementEndPoint } from './services/discount-management-endpoint.service';
import { PrintDiscountService } from './services/print-discountManagement.print.service';


const COMPONENTS = [
    DefinitionsComponent,
    BillTypeComponent,
    ItemCatComponent,
    BillTypeInfoComponent,
    ItemCatInfoComponent,
    ItemComponent,
    ItemModalComponent,
    SupplierComponent,
    SupplierInfoComponent,
    AddItemComponent,
    BranchComponent,
    AddBranchComponent,
    VatTypeComponent,
    VatTypeModalComponent,
    AddVatTypeComponent,
    PrinterSettingsComponent,
    CustomerComponent,
    CustomerInfoComponent,
    WithVatModalComponent,
    ExpensesTemplateComponent,
    ExpensesTreeComponent,
    CostCenterComponent,
    AccountingTabelComponent,
    AccountingTableInfoComponent,
    ServiceTypeComponent,
    ServiceTypeInfoComponent,
    ViewTablesComponent,
    AddTableComponent,
    DiscountManagementComponent
];

const SERVICES = [
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
    ExpensesTemplateService,
    ExpensesTreeService,
    CostCenterService,
    AccountingService,
    AccountingEndpointService,
    AccPDFService,
    PrintAccService,
    PrinterSettingsService,
    ServiceTypeEndpoint,
    ServiceTypeService,
    ServiceTypePDFService,
    PrintSerService,
    TablesService,
    TableEndpoint,
    BsModalRef,
    DiscountManagementService,
    DiscountManagementEndPoint,
    PrintDiscountService
];

@NgModule({
    imports: [
        DefinitionsRoutingModule,
        ThemeModule.forRoot(),
        BsDatepickerModule.forRoot(),
       
        ComponentSharedModule,
        TreeTableModule,
        SharedModule
        
    ],
    declarations: [...COMPONENTS, ViewTablesComponent, AddTableComponent, DiscountManagementComponent, ],
    providers: [...SERVICES],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DefinitionsModule {}
