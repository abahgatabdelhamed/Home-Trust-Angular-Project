import { ItemCat } from './../models/itemcat.model';
import { ReceiptDocument } from './../../../models/receipt-documents';
import { Injectable } from "@angular/core";

@Injectable()
export class PrintItemCatDocsService {
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


    private htmlBuilder(doc: ItemCat, printerLabel, header) {
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
    <p class="label">الملاحظات: </p>
    <p>${doc.notes? doc.notes: ''}</p>
  </div>

  <div class="pr-item">
    <p class="label">اسم التصنيف الأساسي: </p>
    <p>${doc.itemCategoryParentName? doc.itemCategoryParentName: ''}</p>
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
             font-size: 1.5rem; border: 1px solid black;

           }

           .label {
             font-weight: bolder;
           }
        `;
    }
}
