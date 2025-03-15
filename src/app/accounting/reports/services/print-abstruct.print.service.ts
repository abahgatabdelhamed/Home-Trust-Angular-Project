import { ReceiptDocument } from '../../../models/receipt-documents';
import { Injectable } from "@angular/core";
import { DecimalPipe } from '@angular/common';





@Injectable()
export class PrintAbstractService {
    constructor(private _decimalPipe: DecimalPipe) {}

    printDocument(doc: any,NetResult,filters, printerLabel, header,thermalPrinter:boolean) {
        console.log('doc to print', doc);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc,NetResult,filters, printerLabel, header,thermalPrinter)
        );
        newWindow.print();
        newWindow.close();
    }

    htmlBuilder(billSummary,NetResult,filters, printerLabel ,header,thermalPrinter) {
//         return !thermalPrinter? `
//         <html dir="rtl">
//         <style>
//         ${this.cssBuilder(thermalPrinter)}
//       </style>
//       <div class="content">
//       <div>
//       <div class=filters> 
//       <p *ngIf=${filters.selectedBranch}>${filters.selectedBranch?'اسم الفرع:':''}${filters.selectedBranch?filters.branchName:''}</p>
//       <p *ngIf=${filters.selectedCC}>${filters.selectedCC?'مركز التكلفة:':''}${filters.selectedCC?filters.costCenterName:''}</p>
//       <p *ngIf=${filters.serachModel}>من تاريخ:${filters.serachModel.from.toLocaleString()}</p>
//       <p *ngIf=${filters.serachModel}>الى تاريخ:${filters.serachModel.to.toLocaleString()}</p>
//       </div>
//       <table>
//     <tr >
//       <th colspan="7" class="main-header">ملخص المبيعات للفترة</th>
//     </tr>

//     <tr>
    
//       <th>نقدا</th>
//       <th>الشبكة</th>
//       <th>البنك</th>
//       <th>آجل</th>
//       <th>الضريبة</th>
//       <th *ngIf="${this._decimalPipe.transform(billSummary.sWithoutVAt)}">بدون ضريبة</th>
//       <th *ngIf="${this._decimalPipe.transform(billSummary.sWithVAt)}">مع ضريبة</th>
//     </tr>

//     <tr>
//         <td>${this._decimalPipe.transform(billSummary.sCash)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sNetwork)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sBank)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sDept)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sVat)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sWithoutVAt)}</td>
//         <td>${this._decimalPipe.transform(billSummary.sWithVAt)}</td>
  
//         <th class="row-type">مبيعات</th>
//     </tr>

//     <tr>
//         <td>${this._decimalPipe.transform(billSummary.rCash)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rNetwork)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rBank)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rDept)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rVat)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rsWithoutVAt)}</td>
//         <td>${this._decimalPipe.transform(billSummary.rsWithVAt)}</td>
//         <th class="row-type">رجيع</th>
//     </tr>

//     <tr>
//         <td>${this._decimalPipe.transform(NetResult.ncash)}</td>
//         <td>${this._decimalPipe.transform(NetResult.nnetwork)}</td>
//         <td>${this._decimalPipe.transform(NetResult.nbank)}</td>
//         <td>${this._decimalPipe.transform(NetResult.ndebt)}</td>
//         <td>${this._decimalPipe.transform(NetResult.nvat)}</td>
//         <td >${this._decimalPipe.transform(NetResult.ntotal,"1.2-2")}</td>
//         <td>${ this._decimalPipe.transform(NetResult.ntotalWithVat,"1.2-2")}</td>
//         <th class="row-type">صافي</th>
//     </tr>
//   </table>
//   <div class='flex-container'> <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p> </div>
// </div>
//   </div>
 
//     </html>`:
   return ` <html dir="rtl">
    <style>
    ${this.cssBuilder(thermalPrinter)}
  </style>
  <div class="content">
  <div>
  <div class=filters> 
  <p *ngIf=${filters.selectedBranch}>${filters.selectedBranch?'اسم الفرع:':''}${filters.selectedBranch?filters.branchName:''}</p>
  <p *ngIf=${filters.selectedCC}>${filters.selectedCC?'مركز التكلفة:':''}${filters.selectedCC?filters.costCenterName:''}</p>
  <p *ngIf=${filters.serachModel}>من تاريخ:${filters.serachModel.from.toLocaleString()}</p>
  <p *ngIf=${filters.serachModel}>الى تاريخ:${filters.serachModel.to.toLocaleString()}</p>
  </div>
  <table>
<tr >
  <th colspan="7" class="main-header">ملخص المبيعات للفترة</th>
</tr>

<tr>

<th>صافي</th>
  <th>رجيع</th>
  <th>مبيعات</th>
  <th></th>
  </tr>

  <tr>


<td>${ this._decimalPipe.transform(NetResult.ntotalWithVat,"1.2-2")}</td>
<td>${this._decimalPipe.transform(billSummary.rsWithVAt)}</td>
<td>${this._decimalPipe.transform(billSummary.sWithVAt)}</td>

<th class="row-type">مع ضريبة</th>
</tr>

  <tr>
  <td >${this._decimalPipe.transform(NetResult.ntotal,"1.2-2")}</td>
  <td>${this._decimalPipe.transform(billSummary.rsWithoutVAt)}</td>
  <td>${this._decimalPipe.transform(billSummary.sWithoutVAt)}</td>
  <th class="row-type">بدون ضريبة</th>
  </tr>
  
  
  <tr>
  <td>${this._decimalPipe.transform(NetResult.nvat)}</td>
  <td>${this._decimalPipe.transform(billSummary.rVat)}</td>
  <td>${this._decimalPipe.transform(billSummary.sVat)}</td>
  
  <th class="row-type">الضريبة</th>
  </tr>
  
  <tr>
  <td>${this._decimalPipe.transform(NetResult.ndebt)}</td>
  <td>${this._decimalPipe.transform(billSummary.rDept)}</td>
  <td>${this._decimalPipe.transform(billSummary.sDept)}</td>
  
  
  <th class="row-type">آجل</th>
  </tr>
  
  <tr>
  <td>${this._decimalPipe.transform(NetResult.nbank)}</td>
  <td>${this._decimalPipe.transform(billSummary.rBank)}</td>
  <td>${this._decimalPipe.transform(billSummary.sBank)}</td>
  
  <th class="row-type">البنك</th>
</tr>


  <tr>
  <td>${this._decimalPipe.transform(NetResult.nnetwork)}</td>
  <td>${this._decimalPipe.transform(billSummary.rNetwork)}</td>
  <td>${this._decimalPipe.transform(billSummary.sNetwork)}</td>
 
  <th class="row-type">الشبكة</th>
</tr>

<tr>
    <td>${this._decimalPipe.transform(NetResult.ncash)}</td>
    <td>${this._decimalPipe.transform(billSummary.rCash)}</td>
    <td>${this._decimalPipe.transform(billSummary.sCash)}</td>
    
    <th class="row-type">نقداً</th>
</tr>





</table>
<div class='flex-container'> <p> هذا النظام مستخرج من انظمة حلول الغد </p>  <p>   920012635 - 0550535715 </p></div>


</div>
</div>

</html>`


    }
    private cssBuilder(t) {
        // if(!t)
        // return `
        // @page { margin:0 }
        // .header {
        //     display: flex;
        //     align-items: flex-start;
        // }
       
        // .form-group {
        //     margin-right: 20px;
        // }
        // table, tr, th, td {
        //     border: 1px solid black;
        //   }
        
        //   table {
        //     width: 100%;
        //     border-collapse: collapse;
        //   }
        
        //   th, td {
        //       padding: 5px;
        //       font-weight: bolder;
        //       font-size: 1.8rem;
        //     text-align: center;
        //   }
        // td{
        //   font-size: 1.5rem;
        // }
        //   .row-type, th {
          
        //     font-weight: bold;
        //   }
        
        //   .main-header {
           
        //       font-weight: bold;
        //   }
        //   .flex-container{
        //     display:flex;
        //     justify-content:center
        //   }
        //  `
        //  else 
         return `
         @page { margin:0 }
         .header {
             display: flex;
             align-items: flex-start;
         }
         .content{
           width:100%;
            display:flex;
            justify-content:center;
        }
        .filters{
          text-align: center;
          width:270px;
          margin-right: 5px;
        }
         .form-group {
             margin-right: 20px;
         }
         table, tr, th, td {
             border: 1px solid black;

           }
         
           table {
             width: 270px;
             border-collapse: collapse;
           }
         
           th, td {
               padding: 5px;
               font-weight: bolder;
               font-size: 0.6rem;
             text-align: center;
           }
           td{
            font-size: 0.5rem;
          }
           .row-type, th {
            
             font-weight: bold;
           }
         
           .main-header {
             
               font-weight: bold;
           }
           
          .flex-container{
            text-align: center;
          }
          p{
            display:flex;
            justify-content:center;
            width:270px;
          }
          `;
    }
    populateData(bills: any,printlabel) {
      return bills['statementsBillItems'].map(e => `
     <tr>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.item.nameAr:e['billItem'].itemUnit.name}</td>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.item.nameEn:e['billItem'].itemUnit.name}</td>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.name:e['billItem'].itemUnit.name}</td>
      <td>${e['quantity']}</td>
      <td >${printlabel=="تصريح خروج" ?e['remainderQuantity']:''}</td>
      </tr>
          `).join(' ');
  }
}
