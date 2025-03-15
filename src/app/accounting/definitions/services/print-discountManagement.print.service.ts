import { ReceiptDocument } from '../../../models/receipt-documents';
import { Injectable } from "@angular/core";
import { Discount } from '../models/discount.model';

@Injectable()
export class PrintDiscountService {
    constructor() {}

    printDocument(doc: Discount, printerLabel, header) {
        console.log('doc to print', doc);
        let newWindow = window.open("");
        newWindow.document.write(
            this.htmlBuilder(doc, printerLabel, header)
        );
        newWindow.print();
        newWindow.close();
    }

    htmlBuilder(doc:Discount, printerLabel ,header) {
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
                مجموعات الاصناف : ${doc.ItemCategories} 
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
                 الخدمات/ الاصناف:     ${doc.Items} 
              </label>
              <div class="col-md-4">
            
              </div>
          </div>

          <div class="row">
              <div class="col-md-12">
                  <hr [class.edit-separator-hr]="true" />
              </div>
          </div>



       
         
          <div  class="d-inline-block">
            <label class="control-label col-md-2" for="driverPhoneNumber">
         نوع الخصم:${doc.PercentageValue?'نسبة مئوية':'قيمة ثابتة'}
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
    القيمة:   ${doc.PercentageValue?doc.PercentageValue:doc.DiscountedValue}
  </label>
  <div class="col-md-6">
  
  </div>
</div>
<div class="row">
  <div class="col-md-12">
      <hr [class.edit-separator-hr]="true" />
  </div>
</div>



<div  >
  <label class="control-label col-md-2" for="billId">
    جميع الاصناف:   ${doc.AllItemsAndServices?'نعم':'لا'}
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
