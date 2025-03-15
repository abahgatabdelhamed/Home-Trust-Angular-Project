import * as writtenNumber from 'written-number';
import { Branch } from './../models/branch.model';
import { Injectable } from "@angular/core";
import { Item } from '../models/item.model';

@Injectable()
export class PrintItemService {
  constructor() { }

  printDocument(doc: any, printerLabel, header) {
    console.log('doc to print', doc);
    let newWindow = window.open("");
    newWindow.document.write(
      this.htmlBuilder(doc, printerLabel, header)
    );
    newWindow.print();
    newWindow.close();
  }


  htmlBuilder(doc, printerLabel, header) {
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
      <p>${doc.nameAr ? doc.nameAr : ''}</p>
    </div>


    <div class="pr-item">
      <p class="label">الاسم بالانكليزي: </p>
      <p>${doc.nameEn ? doc.nameEn : ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">الرمز: </p>
      <p>${doc.code ? doc.code : ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">اسم نوع الصنف : </p>
      <p class="left">${doc.itemCategoryName ? doc.itemCategoryName : ''}</p>
    </div>
    <div class="pr-item">
      <p class="label right">المواصفات : </p>
      <p class="left">${doc.specification ? doc.specification : ''}</p>
    </div>

    <div class="pr-item">
      <p class="label">الموردون: </p>
      <p>${this.getItemPeople(doc)}</p>
    </div>

    <div class="pr-item">
      <p class="label">ملاحظات: </p>
      <p>${doc.notes ? doc.notes : ''}</p>
    </div>
    <div class="pr-item">
      <p class="label">نوع الضريبة: </p>
      <p>${doc.vatTypeName ? doc.vatTypeName : ''}</p>
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

  getItemPeople(doc) {
    return doc.itemPeople.map(e => `<p style="display:inline-block;">${e.nameAr ? e.nameAr : ''}, </p>`)
  }

  populateData(item: Item) {
    return item.itemFeatures.map(e => `
     <tr>
      <td>${e['name']}</td>
      <td>${e['price']}</td>
      </tr>
          `).join(' ');
  }

  // populateUnitData(item: Item) {
  //   return item.itemUnits.map(e => `
  //           <tr>
  //               <td>${e.name}</td>
  //               <td>${
  //     writtenNumber(e.price, { lang: 'ar' })
  //     }</td>
  //               <td>${e.price ? e.price + ' ' + writtenNumber(e.price, { lang: 'ar' }) : 0}</td>
  //               <td>${e.cost ? e.cost + ' ' + writtenNumber(e.cost, { lang: 'ar' }) : 0}</td>
  //               <td>${e.transferAmount ? e.transferAmount + ' ' + writtenNumber(e.transferAmount, { lang: 'ar' }) : 0}</td>
  //               <td>${e.isDefaultPurchDisplay}</td>
  //               <td>${e.isDefaultSaleDisplay}</td>
  //               <td>${e.isWithVatDisplay}</td>
  //           </tr>
  //       `)
  // }

  populateUnitData(item: Item) {
    return item.itemUnits.map(e => `
            <tr>
                <td>${e.name}</td>
                <td>${e.price ? e.price + ' ' + writtenNumber(e.price, { lang: 'ar' }) : 0}</td>
                <td>${e.cost ? e.cost + ' ' + writtenNumber(e.cost, { lang: 'ar' }) : 0}</td>
                <td>${e.transferAmount ? e.transferAmount + ' ' + writtenNumber(e.transferAmount, { lang: 'ar' }) : 0}</td>
                <td>${e.isDefaultPurchDisplay}</td>
                <td>${e.isDefaultSaleDisplay}</td>
                <td>${e.isWithVatDisplay}</td>
            </tr>
        `)
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
