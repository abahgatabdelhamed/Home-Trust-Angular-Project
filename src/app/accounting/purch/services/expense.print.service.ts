import { ReceiptDocument } from './../../../models/receipt-documents';
import { Injectable } from "@angular/core";

@Injectable()
export class PrintExpensesService {
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
      <p>${doc.account? doc.accountType['name']: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">اسم الحساب: </p>
      <p class="left">${doc.account? doc.account['name']: ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">الفرع: </p>
      <p class="left">${doc.branch? doc.branch['name']: ''}</p>
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
      <p>${doc.amount + doc.vat}</p>
    </div>

    <div class="pr-item">
      <p class="label">الملاحظات: </p>
      <p>${doc.notes? doc.notes: ''}</p>
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
