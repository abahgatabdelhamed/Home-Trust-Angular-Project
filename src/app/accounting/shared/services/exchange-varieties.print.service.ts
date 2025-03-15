import { ExchangeVar } from './../../../models/exchange-varieties';
import { Injectable } from "@angular/core";
import { SBillEndpoint } from "./sbill-endpoint.service";
import * as  writtenNumber from 'written-number';


@Injectable()
export class PrintExchangeService {
    constructor(private sbillEndPoint: SBillEndpoint) {}

    printDocument(doc: any, isSales, printerLabel, header) {
        console.log('doc to print', doc);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc, isSales, printerLabel, header)
        );
        newWindow.print();
        newWindow.close();
    }


    private htmlBuilder(doc: any, isSales, printerLabel, header) {
        var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        console.log(printerLabel)
        if(doc.fromCostCenter){
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
      <p class="label">${'من مركز التكلفة'}: </p>
      <p>${doc.fromCostCenter? doc.fromCostCenter: ''}</p>
    </div>
    
    
    <div class="pr-item">
      <p class="label">${'الفرع'}: </p>
      <p>${doc.branch? doc.branch: ''}</p>
    </div>
    
      <div class="pr-item">
        <p class="label">الصنف: </p>
        <p>${doc.itemName}</p>
      </div>
      <div class="pr-item">
        <p class="label">وحدة الصنف: </p>
        <p>${doc.itemUnitName}</p>
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
    <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
      </html>`
        }else{

        
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
  <p class="label">${'من الفرع'}: </p>
  <p>${doc.fromName? doc.fromName: ''}</p>
</div>


<div class="pr-item">
  <p class="label">${'إلى الفرع'}: </p>
  <p>${doc.toName? doc.toName: ''}</p>
</div>

  <div class="pr-item">
    <p class="label">الصنف: </p>
    <p>${doc.itemName}</p>
  </div>
  <div class="pr-item">
    <p class="label">وحدة الصنف: </p>
    <p>${doc.itemUnitName}</p>
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
<p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
  </html>`
        }
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
