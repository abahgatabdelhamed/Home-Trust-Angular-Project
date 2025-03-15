import { Item } from './../models/item.model';
import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import * as writtenNumber from 'written-number';
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
    <div class="pr-item">
      <p class="label">الاسم بالعربي: </p>
      <p>${doc.nameAr? doc.nameAr: ''}</p>
    </div>


    <div class="pr-item">
      <p class="label">الاسم بالانكليزي: </p>
      <p>${doc.nameEn? doc.nameEn: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">الرمز: </p>
      <p>${doc.code? doc.code: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">اسم نوع الصنف : </p>
      <p class="left">${doc.itemCategoryName? doc.itemCategoryName: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label right">المواصفات : </p>
      <p class="left">${doc.specification? doc.specification: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">الموردون: </p>
      <p>${this.getItemPeople(doc)}</p>
    </div>

    <div class="pr-item">
      <p class="label">ملاحظات: </p>
      <p>${doc.notes? doc.notes: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">نوع الضريبة: </p>
      <p>${doc.vatTypeName? doc.vatTypeName: ''}</p>
    </div>
        <hr/>
        <h1>الإضافات</h1>
    <table>
    <tr>
        <th>الاسم</th>
        <th>السعر</th>
    </tr>
    ${this.populateData(doc)}
  </table>
  <hr/>
  <h1>وحدات الصنف</h1>
<table>
<tr>
<th>اسم الوحدة</th>
<th>السعر</th>
<th>التكلفة</th>
<th>الكمية المنقولة	</th>
<th>شراء افتراضي	</th>
<th>بيع افتراضي	</th>
<th>مع ضريبة	</th>
</tr>
${this.populateUnitData(doc)}
</table>
  </div>
  <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
    </html>`


    }

    populateData(item: Item) {
        return item.itemFeatures.map(e => `
       <tr>
        <td>${e['name']}</td>
        <td>${e['price']}</td>
        </tr>
            `).join(' ');
    }

    populateUnitData(item: Item) {
        return item.itemUnits.map(e => `
            <tr>
            <td>${e.name}</td>
            <td>${e.price + ' ' + writtenNumber(e.price, {lang: 'ar'})}</td>
            <td>${e.cost + ' ' + writtenNumber(e.cost, {lang: 'ar'})}</td>
            <td>${e.transferAmount + ' ' + writtenNumber(e.transferAmount, {lang: 'ar'})}</td>
            <td>${e.isDefaultPurchDisplay}</td>
            <td>${e.isDefaultSaleDisplay}</td>
            <td>${e.isWithVatDisplay}</td>
            </tr>
        `)
    }

    getItemPeople(item: Item) {
        return item.itemPeople.map(e => `<p>${e.nameAr? e.nameAr: ''}, </p>`)
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
