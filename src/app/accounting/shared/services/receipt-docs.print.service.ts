import { ReceiptDocument } from './../../../models/receipt-documents';
import { Injectable } from "@angular/core";
import { SBillEndpoint } from "./sbill-endpoint.service";
import * as  writtenNumber from 'written-number';


@Injectable()
export class PrintDocsService {
    constructor(private sbillEndPoint: SBillEndpoint) {}

    printDocument(doc: any, isSales, printerLabel, header,ispayment?) {
        console.log('doc to print', doc,ispayment);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc, isSales, printerLabel, header,ispayment)
        );
        newWindow.print();
        newWindow.close();
    }


    private htmlBuilder(doc: any, isSales, printerLabel, header,ispayment?) {
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
  <p class="label">${isSales?(ispayment?'طريقة الدفع': 'اسم العميل'): 'دائن'}: </p>
  <p>${doc.fromName? doc.fromName: ''}</p>
</div>


<div class="pr-item">
  <p class="label">${isSales?(ispayment?'اسم المورد': 'طريقة الدفع'): 'مدين'}: </p>
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
    <p class="label">${ispayment?'الرصيد المستحق للمورد:':'الرصيد المستحق على العميل: '}</p>
    <p>${doc.dueAmount!=null ? doc.dueAmount + ' ' + writtenNumber(doc.dueAmount, { lang: 'ar' }) : ''}</p>
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

    private cssBuilder() {
        return `

        .pr-item {
            border: 1px solid black;
        }
        body {
            display: grid;
            width: 100vw;
            place-items: center;
          }
          .container {
            width: 100%;
           }

           .pr-item {
             display: grid;
             grid-template-columns: minmax(auto, 100px) 0.7fr;
             color: #222;
             font-size: 1.5rem;
           }

           .label {
             font-weight: bolder;
           }
        `;
    }
}
