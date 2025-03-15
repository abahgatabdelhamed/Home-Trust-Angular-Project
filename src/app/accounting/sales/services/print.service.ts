//import { Bill } from "./../../purch/models/bill.model";
import { Injectable } from "@angular/core";
import { BillPost } from "../models/bill-post.model";
import { OfferEndpoint } from "./offer-endpoint.service";
import { Observable } from "rxjs/Observable";
import { SBill } from "../models/sbill.model";
import { PrintOptions } from "../models/print-options.model";

@Injectable()
export class PrintService {
    constructor(private offerEndpoint: OfferEndpoint) {}

    printBillInfo(bill: SBill, options: PrintOptions) {
        console.log(bill);
        let newWindow = window.open("");
        newWindow.document.write(this.htmlBuilder(bill, options));
        newWindow.print();
        console.log(this.populateData(bill));
    }

    private htmlBuilder(bill: SBill, option: PrintOptions) {
        var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        return `
        <html >
       <style>
        ${this.cssBuilder()}
       </style>
       <header>
       ${option.header}
     </header>
     <table>
       <tr>
         <th colspan="10">عنوان رئيسي</th>
       </tr>
       <tr>
         <th class="inline" colspan="5">
           <span class="label">رقم الفاتورة : </span>
           <span class="result">${bill.receiptCode}</span>
         </th>
          <th class="inline" colspan="5">
           <span class="label">رمز العميل : </span>
           <span class="result">${bill.personCode}</span>
         </th>
       </tr>
       <tr>
         <th class="inline" colspan="5">
           <span class="label">التاريخ  : </span>
           <span class="result">${bill.billDate.toLocaleDateString(
               "ar-EG",
               dateOptions
           )}</span>
         </th>
          <th class="inline" colspan="5">
           <span class="label"> العميل : </span>
           <span class="result">${bill.personName}</span>
         </th>
       </tr>
       <tr>
         <th class="inline" colspan="5">
           <span class="label"> السداد : </span>
           <span class="result">${bill["isDebt"] ? "آجل" : "نقداً"}</span>
         </th>
          <th class="inline" colspan="5">
           <span class="label">الرقم الضريبي العميل : </span>
           <span class="result">${
               bill["vatNumber"] ? bill["vatNumber"] : "1000000"
           }</span>
         </th>
           <tr>
         <th class="inline" colspan="10">
                   <span class="label"> اسم البائع : </span>
           <span class="result">${
               bill["staffName"] ? bill["staffName"] : "1000000"
           }</span>
             </th>
       </tr>
       </tr>
       <tr>
         <th class="title-data" colspan="1">الاجمالي بعد الضريبة</th>
         <th class="title-data"  colspan="1">الضريبة</th>
         <th class="title-data"  colspan="1">نسبة الضريبة</th>
         <th class="title-data"  colspan="1">الاجمالي بعد الضريبة</th>
         <th class="title-data"  colspan="1">الخصم</th>
         <th class="title-data"  colspan="1">السعر</th>
         <th class="title-data"  colspan="1">الكمية</th>
         <th class="title-data"  colspan="1">الوحدة</th>
         <th class="title-data"  colspan="1">الصنف</th>
         <th class="title-data"  colspan="1">الرمز</th>

       </tr>
${this.populateData(bill)}
       <tr>
       <th colspan="1" class="inline">
           <span class="">2243</span>
         </th>
       <th colspan="2" class="inline">
           <span class="">2243</span>
         </th>
           <th colspan="1" class="inline">
           <span class="">2243</span>
         </th>
       <th colspan="6" class="inline">
           <span class="">الاجمالي : </span>
           <span class="result">2243</span>
         </th>
       </tr>

      <tr>
       <th colspan="1" class="inline">
           <span class=""> ${bill.totalAfterDiscount -
               bill.totalBeforeDiscount} </span>
         </th>
          <th colspan="1" class="inline">
           <span class="">الخصم  </span>
         </th>
       <th colspan="8" rowspan="2" class="inline notes">
           <span class="title-note">الملاحظات  </span>
           <p class="note-body">${option.notes}</p>
         </th>
       </tr>
       <tr>
            </th>
           <th colspan="1" class="inline">
           <span class="">${bill.totalAfterDiscount}</span>
         </th>    </th>
           <th colspan="1" class="inline">
           <span class="">المطلوب</span>
         </th>
       </tr>
     </table>
     <div class="footer">
       <p>

${option.footer}
       </p>
     </div>
     <footer>
       <div class="customer-signature">
         <p class="footer-title">توقيع الزبون</p>
         <p>............</p>
       </div>
         <div class="customer-stamp">
         <p class="footer-title">الختم</p>
         <p>............</p>
       </div>
         <div class="customer-sig">
         <p class="footer-title">توقيع </p>
         <p>............</p>
       </div>
     </footer>
     <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
     </html>
       `;
    }

    private cssBuilder() {
        return `


        table, td, th {
            border: 1px solid black;
            padding: 10px;
          }

          table {
            border-collapse: collapse;
          }

          .inline {
            text-align: right;
          }

          .result {
            margin-right: 20px;
            font-weight: 100;
          }

          td, th {
            width: 300px;
            text-align: center;
          }

          .notes {
            height: 200px;
            text-align: right;
            position: relative;
          }

          .title-note {

          }

          header, .footer {
            font-size: 1.3rem;
            font-weight: bold;
            text-align: center;
          }

          footer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 20px;
            font-size: 1.3rem;
          }

          .footer-title {
            margin-bottom: 100px;
          }

          .title-data {
            background: #ddd;
          }

          th > .label {
            text-align: left;
          }

          .note-body {
            word-wrap: break-word;

          }
        `;
    }

    private populateData(bill: SBill) {
        const result = bill.billItems.map(a => {
            return `
            <tr>
            <td>${a.priceWithVat}</td>
            <td>${a.actualVat}</td>
            <td>${a.vatTypeDefaultValue}</td>
            <td>${a.price}</td>
            <td>${a.discount}</td>
            <td>${a.price}</td>
            <td>${a.quantity}</td>
            <td>${a.vatTypeDefaultValue}</td>
            <td>${a.nameAr}</td>
            <td>${a.code}</td>
          </tr>
            `;
        });

        return result.join(" ");
    }
}
