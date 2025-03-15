//import { Bill } from "./../../purch/models/bill.model";
import { Injectable } from "@angular/core";
import { BillPost } from "../models/bill-post.model";
import { OfferEndpoint } from "./offer-endpoint.service";
import { Observable } from "rxjs/Observable";
import { SBill } from "../models/sbill.model";
import { ThermalPrintOptions } from "../models/print-options.model";

@Injectable()
export class ThermalPrintService {
    constructor(private offerEndpoint: OfferEndpoint) {}

    printBillInfo(bill: SBill, options: ThermalPrintOptions) {
        let newWindow = window.open("");
        console.log(bill.billItems);
        newWindow.document.write(this.htmlBuilder(bill, options));
        newWindow.print();
        this.htmlBuilder(bill, options);
    }

    private htmlBuilder(bill: SBill, option: ThermalPrintOptions) {
        const initial = {
            price: 0,
            quantity: 0,
            vatTypeDefaultValue: 0,
            priceWithVat: 0
        };
        const dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        const obj = bill.billItems.reduce((acc, e) => {
            acc["price"] = acc["price"] + e.price;
            acc["quantity"] = acc["quantity"] + e.quantity;
            acc["vatTypeDefaultValue"] =
                acc["vatTypeDefaultValue"] + e.vatTypeDefaultValue;
            acc["priceWithVat"] = acc["priceWithVat"] + e.priceWithVat;
            return acc;
        }, initial);
        console.log(obj);
        return `
            <html dir="rtl">
            <style>
            ${this.cssBuilder()}
            </style>
            <header>
            <div class="header-item">
              <h3>اسم المحل بالعربية: <span>${option.branchName}</span> </h3>

            </div>
              <div class="header-item">
              <h3>العنوان: <span>${option.address}</span> </h3>

            </div>
            <div class="header-item">
              <h3>رقم الجوال: <span> ${option.phone}</span> </h3>

            </div>

          <div class="header-item">
              <h3>رقم الهاتف : <span> ${option.mobile}</span> </h3>

            </div>
            <div class="header-item">
              <h3> التاريخ : <span> ${new Date().toLocaleDateString(
                  "ar-EG",
                  dateOptions
              )}</span> </h3>

            </div>
            <div class="header-item">
              <h3>الرقم الضريبي : <span> 78888</span> </h3>

            </div>
              <div class="header-item">
              <h3>رقم الفاتورة : <span> ${bill.receiptCode}</span> </h3>

            </div>
                <div class="header-item">
              <h3>رقم الكاشير : <span> 78888</span> </h3>

            </div>
          </header>
          <table>
            <tr>
              <th>رقم الصنف</th>
              <th>اسم الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th> الضريبة</th>
              <th>المبلغ</th>
            </tr>
            ${this.populateData(bill)}

            <tr>
            <td class="title" colspan="2">المجموع</td>
            <td>${obj["quantity"]}</td>
            <td>${obj["price"]}</td>
            <td>${obj["vatTypeDefaultValue"]}</td>
            <td>${obj["priceWithVat"]}</td>
            </tr>

            <tr>
            <td class="title" colspan="5">الخصم</td>
              <td>${bill.discount}</td>
            </tr>

            <tr>
            <td class="title" colspan="5">الإجمالي بعد الخصم</td>
              <td>${bill.totalAfterDiscount}</td>
            </tr>
          </table>

          <footer>
            <div class="footer-item">
                <p>شكراً لتسوقكم معنا و نتمنى زيارتكم مرة أخرى</p>
            </div>
            <div class="footer-item">
                <p> شروط الإرجاع </p>
                <p>${option.terms}</p>
            </div>  <div class="footer-item">
                <p>شروط الاستبدال </p>
                <p> ${option.replacementTerms} </p>
            </div>
          </footer>
           </html>
           `;
    }

    private cssBuilder() {
        return `
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }

          th, td {
            width: 70px;
            text-align:center;
          }

          th {
            background: #ccc;
          }

          .header-item span{
            font-weight: 200;
          }


          header {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          footer {
            font-size: 1.2rem;
          }

          .title {
            font-size: 1.1rem;
          }

`;
    }

    private populateData(bill: SBill) {
        const result = bill.billItems.map(a => {
            return `
            <tr>
            <td>${a.price}</td>

            <td>${a.nameAr}</td>
            <td>${a.quantity}</td>
            <td>${a.price}</td>
            <td>${a.vatTypeDefaultValue}</td>
            <td>${a.priceWithVat}</td>

          </tr>
            `;
        });

        return result.join(" ");
    }
}
