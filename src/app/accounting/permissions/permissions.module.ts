import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsComponent } from './permissions.component';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ComponentSharedModule } from '../shared/component-shared.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TreeTableModule } from 'ng-treetable';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SharedModule } from "../shared/shared.module";
import {  StatementComponent } from './statement/statement.component';
import { StatmentsService } from './services/statments.service';
import { StatmentsEndpointService } from './services/statments-endpoint.service';
import { ReceiptDocService } from '../sales/services/receipt-doc.service';
import { ReceiptDocEndpoint } from '../sales/services/receipt-document-endpoint.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AlertService } from '../../services/alert.service';
import { AddEntrystatmentComponent } from './add-entrystatment/add-entrystatment.component';
import { SBillService } from '../shared/services/sbill.service';
import { SBillEndpoint } from '../shared/services/sbill-endpoint.service';
import { PrintStatmentService } from './services/print-statment.print.service';
const SERVICES = [
    StatmentsService,
    StatmentsEndpointService,
    ReceiptDocService,
    ReceiptDocEndpoint,
    AppTranslationService,
    AlertService,
    SBillService,
    SBillEndpoint,
    PrintStatmentService
]
@NgModule({
 
  imports: [
    PermissionsRoutingModule,
        ThemeModule.forRoot(),
        SharedModule

 
  ],
  declarations: [PermissionsComponent, StatementComponent, AddEntrystatmentComponent],
  providers:[SERVICES]
})
export class PermissionsModule { }
