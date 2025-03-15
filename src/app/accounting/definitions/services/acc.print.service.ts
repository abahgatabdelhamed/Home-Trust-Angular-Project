import * as writtenNumber  from 'written-number';
import { Injectable } from "@angular/core";
import { Accounting } from '../../accounting/models/accounting.model';

@Injectable()
export class PrintAccService {
    constructor() {}

    printDocument(doc: any, printerLabel, header) {
        console.log('doc to print', doc);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc, printerLabel, header)
        );
        newWindow.print();
        newWindow.close();
    }


    private htmlBuilder(doc: Accounting, printerLabel, header) {
        var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
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
  <p class="label">الاسم بالعربي: </p>
  <p>${doc.name? doc.name: ''}</p>
</div>
<div class="pr-item">
  <p class="label">افتراضي؟: </p>
  <p>${doc.isDefault? 'نعم': 'لا'}</p>
</div>
<div class="pr-item">
  <p class="label">الكمية المبدئية: </p>
  <p>${doc.InitialBalance? doc.InitialBalance + ' ' + writtenNumber(doc.InitialBalance, {lang: 'ar'}): 'صفر'}</p>
</div>
<div class="pr-item">
  <p class="label"> فئة الحساب: </p>
  <p>${doc.accountCategoryName? doc.accountCategoryName: ''}</p>
</div>
<div class="pr-item">
  <p class="label">المالك: </p>
  <p>${doc.personName? doc['personName']: ''}</p>
</div>
</div>
<p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
  </html>`

    }

    private cssBuilder() {
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
             display: grid;
             grid-template-columns: minmax(auto, 200px) 0.7fr;
             color: #222;
             font-size: 1.5rem;              border: 1px solid black;

           }

           .label {
             font-weight: bolder;
           }
        `;
    }
}
