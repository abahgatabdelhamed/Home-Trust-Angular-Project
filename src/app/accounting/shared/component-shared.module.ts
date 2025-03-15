import { SettingsEndpoint } from './../../services/settings-endpoint.service';
import { SettingsService } from './../../services/settings.service';
import { RouterModule } from '@angular/router';
import { DailyAdvancedDocComponent } from "./daily-advannced/daily-advanced.component";

import { NgModule } from "@angular/core";
import { ThemeModule } from "../../theme/theme.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { BranchModalComponent } from '../definitions/branch/modal/branch-info.component';
import { AlertService } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { PrinterSettingsService } from '../definitions/services/printer-settings.service';
import { BranchPDFService } from '../definitions/services/branch.pdf.service';
import { PrintBranchService } from '../definitions/services/branch.print.service';
import { ExcelService } from '../../services/excel.service';

//components


const SERVICES = [
    AlertService,
    AppTranslationService,
    PrinterSettingsService,
    BranchPDFService,
    PrintBranchService,
    ExcelService
];

const COMPONENTS = [
    BranchModalComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        ThemeModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgSelectModule,
        RouterModule
    ],
    providers: [...SERVICES],
    exports: [...COMPONENTS]
})
export class ComponentSharedModule { }
