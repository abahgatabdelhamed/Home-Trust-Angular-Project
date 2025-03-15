//BASE_MODULES
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

//EXTERNAL_MODULES
import { ToastyModule } from "ng2-toasty";
import { ChartsModule } from "ng2-charts";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

//NGX_MODULES
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

//Directives
import { EqualValidator } from "../directives/equal-validator.directive";
import { LastElementDirective } from "../directives/last-element.directive";
import { AutofocusDirective } from "../directives/autofocus.directive";
import { BootstrapTabDirective } from "../directives/bootstrap-tab.directive";
import { BootstrapToggleDirective } from "../directives/bootstrap-toggle.directive";
import { BootstrapSelectDirective } from "../directives/bootstrap-select.directive";

//COMPONENTS
import { SearchBoxComponent } from "../components/controls/search-box.component";


//TRANSLATER
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { CustomMaxDirective } from "../directives/custom-max.directive";
import { CustomMinDirective } from "../directives/custom-min.directive copy";


const BASE_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
];

const NGX_MODULES = [
    NgxDatatableModule,
    ModalModule,
    TooltipModule,
    PopoverModule,
    BsDropdownModule,
    CarouselModule,
    BsDatepickerModule
];

const EXTERNAL_MODULES = [ToastyModule, ChartsModule, NgMultiSelectDropDownModule,];

const COMPONENTS = [SearchBoxComponent];

const DIRECTIVES = [
    EqualValidator,
    CustomMaxDirective,
    CustomMinDirective,
    LastElementDirective,
    AutofocusDirective,
    BootstrapTabDirective,
    BootstrapToggleDirective,
    BootstrapSelectDirective
];

@NgModule({
    imports: [...BASE_MODULES, ...NGX_MODULES, ...EXTERNAL_MODULES],
    exports: [
        ...BASE_MODULES,
        ...NGX_MODULES,
        ...EXTERNAL_MODULES,
        ...COMPONENTS,
        ...DIRECTIVES,
        TranslateModule
    ],

    declarations: [...COMPONENTS, ...DIRECTIVES]
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ThemeModule,
            providers: [
                PopoverModule.forRoot().providers,
                TooltipModule.forRoot().providers,
                CarouselModule.forRoot().providers,
                ModalModule.forRoot().providers,
                BsDropdownModule.forRoot().providers,
                // BsDatepickerModule.forRoot().providers
            ]
        };
    }
}
