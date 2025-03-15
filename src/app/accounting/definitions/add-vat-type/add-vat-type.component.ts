import { ActivatedRoute, Router } from "@angular/router";
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef,
    Input
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import * as XLSX from "xlsx";
import { element } from "protractor";

import { VatTypeInterface } from "../models/vat-type.model";
import { VatTypeService } from "../services/vattype.service";

@Component({
    selector: "app-add-vat-type",
    templateUrl: "./add-vat-type.component.html",
    styleUrls: ["./add-vat-type.component.css"]
})
export class AddVatTypeComponent {
    gT = (key: string) => this.translationService.getTranslation(key);

    vatType: VatTypeInterface = {
        name: "",
        isDefault: false,
        defaultValue: 0
    };
    editingMode: boolean = false;

    constructor(
        private vatTypeService: VatTypeService,
        private alertService: AlertService,
        private router: ActivatedRoute,
        private route: Router,
        private translationService: AppTranslationService
    ) {}

    ngOnInit() {
        this.router.params.subscribe(params => {
            if (params.id) {
                this.loadVatTypeDate(params.id);
            }
        });
    }

    loadVatTypeDate(id) {
        this.editingMode = true;
        this.vatTypeService.getCurrentVatType(id).subscribe(vatType => {
            this.vatType = vatType;
            console.log(this.vatType);
        });
    }

    handleSubmit() {
        console.log(this.vatType.id);
        if (this.editingMode) {
            this.vatTypeService
                .updatevattype(this.vatType, this.vatType.id)
                .subscribe(res => this.indicateSuccess(res));
        } else {
            this.vatTypeService
                .newVatType(this.vatType)
                .subscribe(res => this.indicateSuccess(res));
        }
    }

    indicateSuccess(res) {
        console.log(res);
        const msg = this.editingMode
            ? this.gT("messages.updateSuccess")
            : this.gT("messages.addSuccess");
     //   this.alertService.showMessage(msg);
        this.route.navigate(["/definitions/vat-type"]);
    }
}
