import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import * as writtenNumber from 'written-number';
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Branch } from '../models/brach.model';
declare var jsPDF: any;
@Injectable()
export class BranchPDFService extends EndpointFactory {
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
    <div class="pr-item">
      <p class="label">الاسم بالعربي: </p>
      <p>${doc.name? doc.name: ''}</p>
    </div>




    <div class="pr-item">
      <p class="label">رقم الهاتف: </p>
      <p>${doc.phone? doc.phone: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">افتراضي؟: </p>
      <p>${doc.isDefault? 'نعم': 'لا'}</p>
    </div>
    <div class="pr-item">
      <p class="label">ملاحظات: </p>
      <p>${doc.notes? doc.notes: ''}</p>
    </div>
    <table>
    <tr>
        <th>اسم الوحدة</th>
        <th>الاسم</th>
        <th>الكمية</th>
        <th>الكمية الحقيقية</th>
        <th>الرصيد الافتتاحي</th>
    </tr>
    ${this.populateData(doc)}
    </table>

  </div>
  <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
    </html>`


    }

    populateData(branch: Branch) {
        return branch['itemUnitBranches'].map(e => `
        <tr>
         <td>${e['itemUnitName']?e['itemUnitName']: ''}</td>
         <td>${e['itemName']? e['itemName']: ''}</td>
         <td>${e['quantity']? e['quantity'] + ' ' + writtenNumber(+e.quantity, {lang: 'ar'}): '0'}</td>
         <td>${e['realQuantity']? e['realQuantity'] + ' ' + writtenNumber(+e.realQuantity, {lang: 'ar'}): '0'}</td>
         <td>${e['initialQuantity']? e['initialQuantity'] + ' ' + writtenNumber(+e.initialQuantity, {lang: 'ar'}): '0'}</td>
         </tr>
             `).join(' ');
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

           p {
            display: inline-block;
          }
       .pr-item {
             grid-template-columns: minmax(auto, 100px) 0.7fr;
             color: #222;
             font-size: 1.5rem; border: 1px solid black;
           }
           .label {
             font-weight: bolder;
           }


table, th, td {
    text-align: center;
    border: 1px solid black;

}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    font-weight: bolder;
    padding: 5px 10px;
}

td {
    padding: 5px 10px;
}
        `
    }


}
