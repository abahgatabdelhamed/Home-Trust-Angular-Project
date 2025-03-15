import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
declare var jsPDF: any;
@Injectable()
export class ServiceTypePDFService extends EndpointFactory {
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
      <p class="label right">  التكلفة الافتراضية : </p>
      <p class="left">${doc.defaultCost? doc.defaultCost: ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">ملاحظات: </p>
      <p>${doc.notes? doc.notes: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">معرف نوع الضريبة: </p>
      <p>${doc.vatTypeId? doc.vatTypeId: ''}</p>
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
        `
    }


}
