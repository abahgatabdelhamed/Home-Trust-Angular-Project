import { Supplier } from './../models/supplier.model';
import { ItemCat } from './../models/itemcat.model';
import { ReceiptDocument } from './../../../models/receipt-documents';
import { Injectable } from "@angular/core";

@Injectable()
export class PrintSupDocsService {
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

    printDocumentReport(doc: any, printerLabel, header,footer,isBill) {
        console.log('doc to print', doc);
      
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilderReport(doc, printerLabel, header,footer,isBill)
        );
        newWindow.print();
        newWindow.close();
    }


    private htmlBuilder(doc: Supplier, printerLabel, header) {
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
  <p class="label">رقم الهاتف: </p>
  <p>${doc.phone? doc.phone: ''}</p>
</div>

<div class="pr-item">
  <p class="label right">رقم الجوال  : </p>
  <p class="left">${doc.mobile? doc.mobile: ''}</p>
</div>

<div class="pr-item">
  <p class="label"> الفاكس : </p>
  <p>${doc.fax? doc.fax: ''}</p>
</div>

<div class="pr-item">
  <p class="label">الرقم الضريبي: </p>
  <p>${doc.vatNumber? doc.vatNumber: ''}</p>
</div>
<div class="pr-item">
<p class="label">المدينة : </p>
<p>${doc.city? doc.city: ''}</p>
</div>

<div class="pr-item">
  <p class="label"> السماح بالآجل: </p>
  <p>${doc.canLoan? "نعم": 'لا'}</p>
</div>

<div class="pr-item">
  <p class="label"> حد الآجل: </p>
  <p>${doc.loanLimit? doc.loanLimit:'0'}</p>
</div>

<div class="pr-item">
  <p class="label">  العنوان: </p>
  <p>${doc.neighborhood? doc.neighborhood: ''}</p>
</div>

<div class="pr-item">
  <p class="label"> ملاحظات: </p>
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

    private htmlBuilderReport(report: any, printerLabel, header,footer,isBill) {
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
  <div class="row">
                        <div class="col-sm-2" style="float:right">الاسم: &nbsp</div>
                        <div class="col-sm-4" style="float:right">${report.name}</div>
                    </div>
<br/>
                    <div class="row">
                        <div class="col-sm-2" style="float:right">الرمز: &nbsp</div>
                        <div class="col-sm-4" style="float:right">${report.code}</div>
                    </div>
<br/>
                    <div class="row">
                        <div class="col-sm-2" style="float:right">العنوان: &nbsp</div>
                        <div class="col-sm-4" style="float:right">${report.address}</div>
                    </div>
<br/>
                    <div class="row">
                        <div class="col-sm-2" style="float:right">الجوال: &nbsp</div>
                        <div class="col-sm-4" style="float:right">${report.mobile}</div>
                    </div>
<br/>
                    <div class="row">
                        <table class="table" style="text-align:center">
                            <tr>
                                <th style="text-align:center; border: 1px solid black;">التاريخ</th>
                                <th style="text-align:center; border: 1px solid black;">وقت العملية</th>
                                <th style="text-align:center; border: 1px solid black;">رقم المستند</th>
                                <th style="text-align:center; border: 1px solid black;">النوع</th>
                                <th style="text-align:center; border: 1px solid black;">المبلغ</th>
                                <th style="text-align:center; border: 1px solid black;">الرصيد</th>
                            </tr>
                        ${this.getreportItems(report.items)}
                        </table>
                    </div>
                    ${isBill?
                      `
                      
                      <div class="col-sm-2" style="float:right">سجل الفواتير  </div>
                    <br>
                       <div class="row">
                      <table class="table" style="text-align:center">
                          <tr>
                              <th style="text-align:center; border: 1px solid black;">رمز الفاتورة</th>
                              <th style="text-align:center; border: 1px solid black;">التاريخ</th>
                              <th style="text-align:center; border: 1px solid black;">الفرع </th>
                              <th style="text-align:center; border: 1px solid black;">مركز التكلفة</th>
                              <th style="text-align:center; border: 1px solid black;">تم التسليم</th>
                              <th style="text-align:center; border: 1px solid black;">الخصم</th>
                              <th style="text-align:center; border: 1px solid black;">الاجمالي</th>
                          </tr>
                      ${this.getreportBills(report.bills.content)}
                      </table>
                  </div>`:``
                    }
<br/>
                    <div class="row">
                        <div class="col-sm-4" style="float:right">المستحق حتى تاريخه: &nbsp</div>
                        <div class="col-sm-2 show-number" style="float:right">${report.dueAmount}</div>
                    </div>
                    <br>
<p> ${footer}</p>
</div>
<p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
  </html>`

    }

    getreportItems(items: any[]) {
        return items.map(e => `
       <tr>
        <td style="border: 1px solid black;">${e['date']}</td>
        <td style="border: 1px solid black;">${e['time']}</td>
        <td style="border: 1px solid black;">${e['code']}</td>
        <td style="border: 1px solid black;">${e['type']}</td>
        <td style="border: 1px solid black;" class="show-number">${e['amount']}</td>
        <td style="border: 1px solid black;" class="show-number">${e['total']}</td>
        </tr>
            `).join('');
    }
    getreportBills(bills: any[]) {
      return bills.map(e => `
     <tr>
      <td style="border: 1px solid black;">${e['receiptCode']}</td>
      <td style="border: 1px solid black;">${e['date']}</td>
      <td style="border: 1px solid black;">${e.branch?e.branch.name:''}</td>
      <td style="border: 1px solid black;">${e.costCenter?e.costCenter.name:''}</td>
      <td style="border: 1px solid black;">${e['isDelivered']?'نعم':'لا'}</td>
      <td style="border: 1px solid black;" class="show-number">${e['discount']}</td>
      <td style="border: 1px solid black;" class="show-number">${e['totalPriceAfterVat']}</td>
      </tr>
          `).join('');
  }
    formatDate(date: Date) {
      return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }
    
}
