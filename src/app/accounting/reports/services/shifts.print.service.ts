import { ReceiptDocument } from '../../../models/receipt-documents';
import { Injectable } from "@angular/core";
import { DecimalPipe } from '@angular/common';
import { CheckPermissionsService } from '../../../services/check-permissions.service';





@Injectable()
export class ShiftsPrintService {
    constructor(private _decimalPipe: DecimalPipe,private checkPermission:CheckPermissionsService) {}

    printDocument(doc: any,printerLabel, header,thermalPrinter:boolean) {
        console.log('doc to print', doc);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc, printerLabel, header,thermalPrinter)
        );
        newWindow.print();
        newWindow.close();
    }

    htmlBuilder(data, printerLabel ,header,thermalPrinter) {
        return  `
        <html dir="rtl">
        <style>
        ${this.cssBuilder(thermalPrinter)}
      </style>
      <div class = "container">
      <div class='content'>
    <p> <span>${ 'الاسم:' }${data.userName +'  ' }  ${ '     '}</span> <span>${  '   ' +'وقت البدء:'} ${  this.formatDate(new Date (data.startedDate))}  </span>
   ${data.endDate?` <span>${  '   ' +'وقت الانتهاء:'} ${ this.formatDate(new Date (data.endDate))}  </span>`:``} <span>${ 'عدد الساعات:'  } ${''+ data.totalHour}</span></p>

   <div class="tbl-header">
        
      <table cellpadding="0" cellspacing="0" border="0">
          <thead>
              <tr>
                  <th>الصنف </th>
                  <th>الكمية</th>
                 ${this.checkPermission.checkGroup(9,2)?`<th>السعر</th>`:``}
                 

              </tr>
          </thead>
      </table>
  </div>
    <div  class="tbl-content">
      <table cellpadding="0" cellspacing="0" border="0">
          <tbody>
${this.populateData(data.items,'')}
            

          </tbody>
      </table>
  </div> 
  
${this.checkPermission.checkGroup(9,2)?`
<table class="table table-borderless">
<thead>
  <tr style="color: black;">
  
    <th style="color: black;">الرصيد المباع</th>
    <th style="color: black;">مجموع المدى</th>
    <th style="color: black;">مجموع الكاش</th>
    ${this.checkPermission.checkGroup(3,11)?`  <th style="color: black;">تطبيقات التوصيل</th>`:``}
 
  </tr>
</thead>
<tbody>
  <tr>
        <td >${data.soldBalance}</td>
        <td >${data.madaSoldBalance}</td>

    <td >${data.cashSoldBalance}</td>
   ${this.checkPermission.checkGroup(3,11)?`<td>${data.deliveryAppsTotalBalance}</td>`:``} 
   
 
  
  </tr>
 
</tbody>
</table>`:``}
 ${this.checkPermission.checkGroup(3,11)&&this.checkPermission.checkGroup(9,2)?`
 <p>تطبيقات التوصيل</p>    
 <div >
    <div class="container mt-3">
       
                
        <table class="table table-borderless">
          <thead>
            <tr style="color: black;">
              <th style="color: black;">الاسم</th>
              <th style="color: black;">المبلغ</th>
            </tr>
          </thead>
          <tbody>
          ${this.populateData2(data.deliveryApps,'')}
            
           
          </tbody>
        </table>
        </div>
     </div>
    
   
     `:``}<div class='flex-container'> <p> هذا النظام مستخرج من انظمة حلول الغد  </p><p>- 920012635 - 0550535715</p> </div>
  </div>
  </div>
  </div>



</html>`


    }
    private cssBuilder(t) {
        if(!t)
        return `
        @page { margin:0 }
        .header {
            display: flex;
            align-items: flex-start;
        }
        .container{
         display:flex;
         justify-content:center;
        }
        .content{
          width:70%;
          
       }
       table {
         width: 100%;
         table-layout: fixed;
     }
     .tbl-header {
         background: var(--user-theme);
     }
     .tbl-content {
        
         margin-top: 0px;
         border: 1px solid var(--user-theme);
     }
     .flex-element{
         display: flex;
         justify-content: space-between;
     }
     .table-buttons {
         margin-top: 50px;
     }
     .panel-warning{
         border: 3px solid red;
     }
     .file input {
         display: none;
       }
     
     
       .show-number {
         font-family: monospace;
         font-weight: bolder;
         font-size: 1.2rem;
     }
       .file label {
         border: 1px solid white;
         padding: 5px 10px;
         color: darkblue;
         background: orange;
       }
     
     .btns {
         display: grid;
         grid-gap: 10px;
     }
     th {
         padding: 20px 15px;
         text-align: left;
         font-weight: 500;
         font-size: 12px;
        
         text-transform: uppercase;
     }
     td {
         padding: 15px;
         text-align: left;
         vertical-align: middle;
         font-weight: 300;
         font-size: 12px;
         color: #222;
         border-bottom: solid 1px rgba(24, 0, 112, 0.425);
     }
     span{
    
     }
     p{
        display: flex;
        justify-content: space-evenly;
     }          .flex-container{
           display:flex;
           justify-content:center
         }
         
         `
         
         else 
         return `
         @page { margin:0 }
         .header {
             display: flex;
             align-items: flex-start;
         }
         .container{
          display:flex;
          justify-content:center;
         }
         .content{
           width:270px;
           margin-right:5px;
           
        }
        table {
          width: 100%;
          table-layout: fixed;
      }
      .tbl-header {
          background: var(--user-theme);
      }
      .tbl-content {
         
          margin-top: 0px;
          border: 1px solid var(--user-theme);
      }
      .flex-element{
          display: flex;
          justify-content: space-between;
      }
      .table-buttons {
          margin-top: 50px;
      }
      .panel-warning{
          border: 3px solid red;
      }
      .file input {
          display: none;
        }
      
      
        .show-number {
          font-family: monospace;
          font-weight: bolder;
          font-size: 1.2rem;
      }
        .file label {
          border: 1px solid white;
          padding: 5px 10px;
          color: darkblue;
          background: orange;
        }
      
      .btns {
          display: grid;
          grid-gap: 10px;
      }
      th {
          padding: 20px 15px;
          text-align: left;
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
      }
      td {
          padding: 15px;
          text-align: left;
          vertical-align: middle;
          font-weight: 300;
          font-size: 12px;
          color: #222;
          border-bottom: solid 1px rgba(24, 0, 112, 0.425);
      }
      span{
        font-size: 12px;
      }
      p{
         display: flex;
         justify-content: space-evenly;
      }          .flex-container{
        font-size: 12px;
        text-align:center;
          }
          
          `
    }
    populateData(i: any,printlabel) {
      return i.map(e => `
     <tr>
      <td>${e.name}</td>
      <td>${e.quantity}</td>
      ${this.checkPermission.checkGroup(9,2)?`<td>${e.price}</td>`:``}
           </tr>
          `).join(' ');
  }
  populateData2(i: any,printlabel) {
    return i.map(e => `
   ${ e.amount>0?`<tr>
    <td>${e.name}</td>
    <td>${e.amount}</td>
  
  </tr>`:``}
        `).join(' ');
}
formatDate(date: Date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() ;
  }
}
