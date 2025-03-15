import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Accounting } from "../models/accounting.model";
import * as XLSX from "xlsx";
import * as _ from 'underscore';
import { AccountingInfoComponent } from "./modal/accountingtree-modal.component";
import {
    AlertService,
    MessageSeverity,
    DialogType
} from "../../../services/alert.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { Utilities } from "../../../services/utilities";
import { AccountingService } from "../services/accounting.service";
import { AccountService } from "../../../services/account.service";
import { PDFService } from "../../shared/services/pdf.service";
import { TreeTableModule } from "ng-treetable";

@Component({
    selector: "accountingtree",
    templateUrl: "./accountingtree.component.html",
    styleUrls: ["./accountingtree.component.css"]
})
export class AccountingTreeComponent {
    isLoading = true;
    gT = (key: string) => this.translationService.getTranslation(key);
    data;
    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private accountingService: AccountingService,
        private excelService: ExcelService,
        private pdfService: PDFService
    ) {}

    ngOnInit() {
        this.loadData();
    }



    loadData() {
        this.accountingService.getTree().subscribe(res => {
            this.data = res['data'];
            this.isLoading = false;
        })
    }

    setBackgroundColor(currentTab) {
        const tree = document.querySelector(".tree");
        const table = document.querySelector(".m");
        if (currentTab == "tree") {
            tree.classList.add("current");
            table.classList.remove("current");
        } else if (currentTab == "m") {
            tree.classList.remove("current");
            table.classList.add("current");
        }
    }










    switchToTree() {
        this.setBackgroundColor("tree");
    }
}
