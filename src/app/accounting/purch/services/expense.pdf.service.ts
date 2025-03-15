import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
declare var jsPDF: any;
@Injectable()
export class ExpensePDFService extends EndpointFactory {
    private readonly _url: string = "/api/pdfcreator";
    constructor(public http: HttpClient,configurations: ConfigurationService,
        injector: Injector) {
        super(http, configurations, injector);
    }

    get url() {
        return this.configurations.baseUrl + this._url;
    }

    exportPDF() {
        var columns = [
            { title: "ID", dataKey: "id" },
            { title: "Name", dataKey: "name" },
            { title: "Country", dataKey: "country" }
        ];
        var rows = [
            { id: 1, name: "Shaw", country: "Tanzania" },
            { id: 2, name: "Nelson", country: "Kazakhstan" },
            { id: 3, name: "Garcia", country: "Madagascar" }
        ];
        var doc = new jsPDF("p", "pt");
        doc.autoTable(columns, rows);
        doc.save("table.pdf");
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
    <div class="pr-item">
      <p class="label">دائن: </p>
      <p>${doc.person? doc.person['nameAr']: ''}</p>
    </div>


    <div class="pr-item">
      <p class="label">رمز الفاتورة: </p>
      <p>${doc.receiptCode? doc.receiptCode: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">طريقة الدفع: </p>
      <p>${doc.accountId? doc.accountId: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">اسم الحساب: </p>
      <p class="left">${doc.accountId? doc.accountId: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">الفرع: </p>
      <p class="left">${doc.branchId? doc.branchId: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">بتاريخ: </p>
      <p>${doc.date? doc.date: ''}</p>
    </div>


    <div class="pr-item">
      <p class="label">المبلغ: </p>
      <p>${doc.amount? doc.amount: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">المبلغ الكامل: </p>
      <p>${doc.finalAmount? doc.finalAmount: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">الملاحظات: </p>
      <p>${doc.notes? doc.notes: ''}</p>
    </div>

  </div>
  <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
    </html>`


    }


    cssBuilder() {
        return `
        body {
            display: grid;
            width: 100vw;
            place-items: center;
          }
          .container {
            width: 100%;
           }

           .pr-item {
             display: flex;
             grid-template-columns: minmax(auto, 100px) 0.7fr;
             color: #222;
             font-size: 1.5rem;
           }

           p {
            display: inline-block;
          }

           .label {
             font-weight: bolder;
           }
        `
    }


}
