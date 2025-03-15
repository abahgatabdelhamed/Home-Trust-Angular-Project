import { ReceiptDocument } from './../../../models/receipt-documents';
import { HttpClient } from "@angular/common/http";
import * as writtenNumber from 'written-number';
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
declare var jsPDF: any;
@Injectable()
export class PDFService extends EndpointFactory {
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


    createPDF(docs: any, isSales,  printerLabel ,header,ispayment?) {
        const obj = {htmlContent: this.htmlBuilder(docs , isSales,printerLabel ,header,ispayment), fileName: 'somename'}
        return this.http.post(this.url, obj, {responseType: 'blob'});
    }


    htmlBuilder(doc, isSales, printerLabel ,header,ispayment?) {
      var dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    if (isSales)
  return `

  <html dir="rtl">
  <style>
  ${this.cssBuilder()}
</style>
<div>
<h2>${header? header: ''}</h2>
<br/>
<h1>${printerLabel? printerLabel: ''} </h1>

</div>

<div dir="rtl" class="container">
<div class="pr-item">
<p class="label">${isSales?(ispayment?'اسم المورد': 'اسم العميل'): 'دائن'}: </p>
<p>${doc.fromName? doc.fromName: ''}</p>
</div>


<div class="pr-item">
<p class="label">${isSales? 'طريقة الدفع': 'مدين'}: </p>
<p>${doc.toName? doc.toName: ''}</p>
</div>
<div class="pr-item">
<p class="label">الرمز: </p>
<p>${doc.code? doc.code: ''}</p>
</div>
<div class="pr-item">
<p class="label">المبلغ: </p>
<p>${doc.amount? doc.amount  + ' ' + writtenNumber(doc.amount, {lang: 'ar'}): ''}</p>
</div>
<div class="pr-item">
<p class="label">${ispayment?'الرصيد المستحق للمورد:':'الرصيد المستحق على العميل: '} </p>
<p>${doc.dueAmount!=null  ? doc.dueAmount + ' ' + writtenNumber(doc.dueAmount, { lang: 'ar' }) : ''}</p>
</div>
<div class="pr-item">
<p class="label">الملاحظات: </p>
<p>${doc.notes? doc.notes: ''}</p>
</div>

<div class="pr-item">
<p class="label">بتاريخ: </p>
<p>${doc? doc.date: ''}</p>
</div>

</div>
</html>`
    else
        return `

  <html dir="rtl">
  <style>
  ${this.cssBuilder()}
</style>
<div>
<h2>${header ? header : ''}</h2>
<br/>
<h1>${printerLabel ? printerLabel : ''} </h1>

</div>

<div dir="rtl" class="container">
<div class="pr-item">
<p class="label">${isSales ? (ispayment?'اسم المورد':'اسم العميل') : 'دائن'}: </p>
<p>${doc.fromName ? doc.fromName : ''}</p>
</div>


<div class="pr-item">
<p class="label">${isSales ? 'طريقة الدفع' : 'مدين'}: </p>
<p>${doc.toName ? doc.toName : ''}</p>
</div>
<div class="pr-item">
<p class="label">الرمز: </p>
<p>${doc.code ? doc.code : ''}</p>
</div> 
<div class="pr-item">
<p class="label">المبلغ: </p>
<p>${doc.amount ? doc.amount + ' ' + writtenNumber(doc.amount, { lang: 'ar' }) : ''}</p>
</div>
<div class="pr-item">
<p class="label">الملاحظات: </p>
<p>${doc.notes ? doc.notes : ''}</p>
</div>

<div class="pr-item">
<p class="label">بتاريخ: </p>
<p>${doc ? doc.date : ''}</p>
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
            
      
          border: 1px solid black;
      
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
