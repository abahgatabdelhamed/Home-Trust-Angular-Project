import { Component, OnInit } from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import * as XLSX from "xlsx";
import { element } from "protractor";
import { SBillService } from "../services/sbill.service";
import { BillSummary } from "../models/sbill-summary";

@Component({
    selector: "app-abstract",
    templateUrl: "./abstract.component.html",
    styleUrls: ["./abstract.component.css"]
})
export class AbstractComponent implements OnInit {
    serachModel: any = {
        from: new Date().toLocaleDateString(),
        to: new Date().toLocaleDateString()
    };
    editingName: { nameAr: string };
    sourceBillSummaryCat: BillSummary;
    excelLabel: string = 'Summary Report';
    mytime: Date = new Date();

    editedBillSummaryCat: BillSummary;
    rows: BillSummary[] = [];
    rowsCache: BillSummary[] = [];
    columns: any[] = [];
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        index: {
            title: this.gT("shared.index"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        receiptCode: {
            title: this.gT("shared.billCode"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        priceBeforeVat: {
            title: this.gT("shared.priceBeforeVat"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        priceAfterVat: {
            title: this.gT("shared.priceAfterVat"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        tag: {
            title: this.gT("shared.tag"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        price: {
            title: this.gT("shared.price"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        date: {
            title: this.gT("shared.date"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        }
    };

    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private sbillService: SBillService,
        private excelService: ExcelService,
        
    ) {}

    ngOnInit() {
        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 60,
                canAutoResize: false
            },
            {
                prop: "receiptCode",
                name: this.gT("shared.code"),
                width: 70
            },
            {
                prop: "priceBeforeVat",
                name: this.gT("shared.priceBeforeVat"),
                width: 70
            },
            {
                prop: "priceAfterVat",
                name: this.gT("shared.priceAfterVat"),
                width: 70
            },
            { prop: "tag", name: this.gT("shared.tag"), width: 70 },

            {
                prop: "date",
                name: this.gT("shared.date"),
                width: 70
            }
        ];
    }

    handleSubmit(e) {
        console.log(this.serachModel);
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.sbillService
            .getBillSummary(this.serachModel)
            .subscribe(
                res => this.onDataLoadSuccessful(res),
                err => this.onDataLoadFailed(err)
            );
    }

    onDataLoadSuccessful(items: BillSummary[]) {
        console.log(items);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        items.forEach((bt, index, itemcat) => {
            (<any>bt).index = index + 1;
        });

        this.rowsCache = [...items];
        this.rows = items;

        const initial = {
            index: null,
            receiptCode: this.gT("shared.total"),
            priceAfterVat: 0,
            priceBeforeVat: 0,
            date: "",
            tag: ""
        };
        const obj = this.rows.reduce((acc, e) => {
            acc["priceBeforeVat"] = acc["priceBeforeVat"] + e.priceBeforeVat;
            acc["priceAfterVat"] = acc["priceAfterVat"] + e.priceAfterVat;
            return acc;
        }, initial);

        this.rows.forEach((bt, index, itemcat) => {
            (<any>bt).index = index + 1;
            (<any>bt).date = new Date(bt.date).toLocaleDateString();
        });
        this.rows.push(obj);
    }

    onDataLoadFailed(error: any) {
       // this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

       /* this.alertService.showStickyMessage(
            "Load Error",
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

    getOrderedHeadersArray() {
        let list: string[] = [];
        let counter: number = 1;
        while (true) {
            let isFounded: boolean = false;
            for (var key in this.headers) {
                if (this.headers[key].order == counter) {
                    list.push(key);
                    isFounded = true;
                    break;
                }
            }
            if (!isFounded) {
                break;
            }
            counter++;
        }
        return list;
    }
    getRemovedHeadersArray() {
        let list: string[] = [];
        for (var key in this.headers) {
            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }
        return list;
    }

    exportAsXLSX() {
        let exportedRows: any[] = [];
        Object.assign(exportedRows, this.rows);
        let removedKeyArr: string[] = this.getRemovedHeadersArray();
        for (var removedKey of removedKeyArr) {
            for (var row of exportedRows) {
                delete row[removedKey];
            }
        }
        let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            exportedRows,
            { header: orderedKeyArr }
        );
        for (var key in this.headers) {
            if (
                this.headers[key].isVis &&
                this.headers[key].excel_cell_header != ""
            ) {
                worksheet[this.headers[key].excel_cell_header].v = this.headers[
                    key
                ].title;
            }
        }
        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);
    }
}
