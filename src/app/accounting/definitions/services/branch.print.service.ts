import * as writtenNumber  from 'written-number';
import { Branch } from './../models/branch.model';
import { Injectable } from "@angular/core";

@Injectable()
export class PrintBranchService {
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


    private htmlBuilder(doc: Branch, printerLabel, header) {
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
  <p class="label">رقم الهاتف: </p>
  <p>${doc.phone? doc.phone: ''}</p>
</div>
<div class="pr-item">
  <p class="label">افتراضي؟: </p>
  <p>${doc.isDefault? 'نعم': 'لا'}</p>
</div>
<div class="pr-item">
  <p class="label">ملاحظات: </p>
  <p>${doc['notes']? doc['notes']: ''}</p>
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
        <td>${e['quantity']? e['quantity']: '0'}</td>
        <td>${e['realQuantity']? e['realQuantity']: '0'}</td>
        <td>${e['initialQuantity']? e['initialQuantity'] + ' ' + writtenNumber(e['initialQuantity'], {lang: 'ar'}): '0'}</td>
        </tr>
            `).join(' ');
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
        `;
    }
}
