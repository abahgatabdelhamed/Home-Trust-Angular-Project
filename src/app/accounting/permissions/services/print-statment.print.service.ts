import { ReceiptDocument } from '../../../models/receipt-documents';
import { Injectable } from "@angular/core";

@Injectable()
export class PrintStatmentService {
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
      <section>

      <h2 class="section-title">
          ${printerLabel}
      </h2>
      
<br>
      <div>
          <div  class=" d-inline-block">
              <label class="control-label col-md-2" for="careNumber">
                 رقم لوحة السيارة : ${doc.careNumber} 
              </label>
             
                 <div class="d-flex justify-content-between"> </div>
    
              </div>
          </div>

          <div class="row">
          <div class="col-md-12">
              <hr [class.edit-separator-hr]="true" />
          </div>
      </div>
      <div  class=" d-inline-block">
      <label class="control-label col-md-2" for="createdDate">
        تاريخ الانشاء: ${new Date().toLocaleDateString(
            "ar-EG",
            doc.createdDate
        )} 
      </label>
     
         <div class="d-flex justify-content-between"> </div>

      </div>
  </div>

  <div class="row">
  <div class="col-md-12">
      <hr [class.edit-separator-hr]="true" />
  </div>
</div>
          <!-- ااسم الاصل بالانكليزية -->
          <div class=" d-inline-block">
              <label class="control-label col-md-2" for="driverName">
                  اسم السائق:     ${doc.driverName} 
              </label>
              <div class="col-md-4">
            
              </div>
          </div>

          <div class="row">
              <div class="col-md-12">
                  <hr [class.edit-separator-hr]="true" />
              </div>
          </div>



          <!-- القيمة -->
          <div  class="d-inline-block">
              <label class="control-label col-md-2" for="driverId">
              هوية السائق : ${doc.driverId}    
              </label>
              
          </div>
          <div class="row">
          <div class="col-md-12">
              <hr [class.edit-separator-hr]="true" />
          </div>
      </div>
         
          <div  class="d-inline-block">
            <label class="control-label col-md-2" for="driverPhoneNumber">
            هاتف السائق:${doc.driverPhoneNumber}
            </label>
            <div class="col-md-4">
               
                  </div>
        </div>

<!--            ///////////////////////////////////////////////////////////////       -->

<div class="row">
  <div class="col-md-12">
      <hr [class.edit-separator-hr]="true" />
  </div>
</div>



<div  >
  <label class="control-label col-md-2" for="billId">
    رمز الفاتورة:   ${doc.bill.receiptCode}
  </label>
  <div class="col-md-6">
  
  </div>
</div>

      </div> 

  </section>
  <div class="row">
    <div class="col-md-12">
        <hr [class.edit-separator-hr]="true" />
    </div>
  </div>
  

</form>

<h2 *ngIf="isShow" class="section-title">
معلومات الفاتورة
</h2>
<div *ngIf="isShow" class="row">
    <div class="col-md-12">
        <hr [class.edit-separator-hr]="true" />
    </div>
</div>

<div *ngIf="isShow" class="tbl-header">
    
    <table cellpadding="0" cellspacing="0" border="0">
        <thead>
            <tr>
                <th>الاسم بالعربي</th>
                <th>الاسم بالانكليزي</th>
                <th>وحدة الصنف</th>
                <th>الكمية</th>
                <th> ${printerLabel=="تصريح خروج" ?  'الكمية المتبقية':''}</th>
                
                
              

            </tr>
        </thead>
    </table>
</div>
<div class="tbl-content">
    <table cellpadding="0" cellspacing="0" border="0">
        <tbody>

        ${this.populateData(doc,printerLabel)}

        </tbody>
    </table>
</div>

  </div>
 <div class='flex-container'> <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p> </div>
    </html>`


    }
    private cssBuilder() {
        return `
        .flex-container{
            display:flex;
            justify-content:center
          }
        .section-title {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
      }
      label{
        font-size:25px
      }
      table {
          width: 100%;
          table-layout: fixed;
      }
      .tbl-header {
          background: var(--user-theme);
      }
      .tbl-content {
         
          overflow-x: auto;
          margin-top: 0px;
          border: 1px solid var(--user-theme);
      }
      
      .table-buttons {
          margin-top: 50px;
      }
      
      th {
          padding: 20px 15px;
          text-align: left;
          font-weight: 500;
          font-size: 20px;
          color: #fff;
          text-transform: uppercase;
      }
      td {
          padding: 15px;
          text-align: left;
          vertical-align: middle;
          font-weight: 300;
          font-size: 20px;
          color: #222;
          border-bottom: solid 1px rgba(24, 0, 112, 0.425);
      } `;
    }
    populateData(bills: any,printlabel) {
      return bills['statementsBillItems'].map(e => `
     <tr>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.item.nameAr:e['billItem'].itemUnit.item.nameAr}</td>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.item.nameEn:e['billItem'].itemUnit.item.nameEn}</td>
      <td>${e['billItem'].itemUnitBranch?e['billItem'].itemUnitBranch.itemUnit.name:e['billItem'].itemUnit.name}</td>
      <td>${e['quantity']}</td>
      <td >${printlabel=="تصريح خروج" ?e['remainderQuantity']:''}</td>
      </tr>
          `).join(' ');
  }
}
