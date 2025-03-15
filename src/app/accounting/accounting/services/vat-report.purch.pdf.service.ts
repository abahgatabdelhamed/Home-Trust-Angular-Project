import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
declare var jsPDF: any;
@Injectable()
export class ItemPDFService extends EndpointFactory {
    private readonly _url: string = "/api/pdfcreator";
    constructor(public http: HttpClient,configurations: ConfigurationService,
        injector: Injector) {
        super(http, configurations, injector);
    }

    get url() {
        return this.configurations.baseUrl + this._url;
    }

    createPDF(docs: any,  printerLabel ,header) {
        const obj = {htmlContent: this.htmlBuilder(docs ,printerLabel ,header), fileName: 'somename'}
        return this.http.post(this.url, obj, {responseType: 'blob'});
    }


    htmlBuilder(doc, printerLabel ,header) {
        return `
        <html dir="rtl">
        <style>
        ${this.cssBuilder()}
      </style>
      <div>
    <h2>${header}</h2>
    <br/>
    <h1>${printerLabel} </h1>
      </div>

    <div dir="rtl" class="container">
    <table *ngIf="isPurch && purchReports">
    <tr class="titles">
        <th # </th>
        <th>رقم الفاتورة</th>
        <th>تصنيف الضريبة</th>
        <th>التاريخ</th>
        <th>رمز المورد</th>
        <th>اسم المورد</th>
        <th>الرقم الضريبي</th>
        <th>رقم الحساب</th>
        <th>الحساب</th>
        <th>السعر قبل الضريبة</th>
        <th>الضريبة</th>
        <th>السعر بعد الضريبة</th>

    </tr>
    <tr class="annotation">
        <th colspan="12">{{ "shared.purchTagLabel" | translate }}</th>
    </tr>
    <tr *ngFor="let report of purchReports[0].bills" class="data">
        <th>{{ report.index }}</th>
        <th>{{ report.receiptCode }}</th>

        <td>{{ report.vatType }}</td>
        <td>{{ report.date | date: "dd/MM/yyyy" }}</td>
        <td>{{ report.personCode }}</td>

        <td>{{ report.personName }}</td>
        <td>{{ report.vatNumber }}</td>
        <td>{{ report.accountNumber }}</td>
        <td>{{ report.accountName }}</td>
        <td>{{ report.priceBeforeVat }}</td>
        <td>{{ report.vat }}</td>
        <td>{{ report.priceAfterVat }}</td>
    </tr>
    <tr class="annotation">
        <th colspan="12">{{ "shared.purchConsumeLabel" | translate }}</th>
    </tr>
    <tr *ngFor="let report of purchReports[1].bills" class="data">
        <th>{{ report.index }}</th>
        <th>{{ report.receiptCode }}</th>

        <td>{{ report.vatType }}</td>
        <td>{{ report.date | date: "dd/MM/yyyy" }}</td>
        <td>{{ report.personCode }}</td>
        <td>{{ report.personName }}</td>
        <td>{{ report.vatNumber }}</td>
        <td>{{ report.accountNumber }}</td>
        <td>{{ report.accountName }}</td>
        <td>{{ report.priceBeforeVat }}</td>
        <td>{{ report.vat }}</td>
        <td>{{ report.priceAfterVat }}</td>
    </tr>
    <tr class="results">
        <td colspan="9"></td>
        <td>{{purchReports[1].total}}</td>
        <td>{{purchReports[1].vat}}</td>
        <td>{{purchReports[1].totalAfterVat}}</td>
    </tr>
</table>

  </div>
  <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
    </html>`


    }


    cssBuilder() {
        return `

table,
th,
td {
    border: 1px solid rgb(145, 141, 141);
    padding: 10px;
    text-align: center;
}
table {
    border-collapse: collapse;
    width: 100%;
}
.titles {
    background: var(--user-theme);
    color: white;
}
.annotation {
    background: rgb(24, 23, 23);
    color: #fff;
}
        `
    }


}
