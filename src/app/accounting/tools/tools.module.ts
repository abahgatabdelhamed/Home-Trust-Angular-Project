import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { BarcodeInformationComponent } from './barcode-information/barcode-information.component';
import { SharedModule } from '../shared/shared.module';
import { Services } from '@angular/core/src/view';
import { AppTranslationService } from '../../services/app-translation.service';
import { ThemeModule } from '../../theme/theme.module';
import { ItemEndpointService } from '../definitions/services/item-endpoint.service';
import { ItemService } from '../definitions/services/item.service';
import { PrinterSettingsService } from '../definitions/services/printer-settings.service';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ReportsEndpointService } from '../reports/services/reports-endpoint.service';
import { ItemSearchService } from '../shared/services/item-search.service';
import { NgxPrintModule } from 'ngx-print';

//import { BarcodeGeneratorAllModule,QRCodeGeneratorAllModule,DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
const SERVICES = [
  ItemService,
  ItemEndpointService,
  AppTranslationService,
  PrinterSettingsService,
  ReportsEndpointService,
  ItemSearchService
  
]
@NgModule({
  
  imports: [
    CommonModule,
    ToolsRoutingModule,
    ThemeModule.forRoot(),
    SharedModule,
    NgxPrintModule,
    NgxBarcodeModule.forRoot()
  ],
  declarations: [ToolsComponent, BarcodeInformationComponent],
  providers:[SERVICES]
})
export class ToolsModule { }
