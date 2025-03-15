import { Router } from '@angular/router';
//import { Bill } from "./../../purch/models/bill.model";
import { Injectable } from "@angular/core";
import { BillPost } from "../models/bill-post.model";
import { SBillEndpoint } from "./sbill-endpoint.service";
import { Observable } from "rxjs/Observable";
import { SBill } from "../models/sbill.model";
import { ThermalPrintOptions } from "../models/print-options.model";
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../services/configuration.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';

@Injectable()
export class ThermalPrintService {
    isVatEnable: boolean = false;
    logoPath: string;
    vatPercentage: number;
    private readonly _url: string = "/api/pdfcreator";
  isTobaccoExist: boolean;
  
    constructor(protected configurations: ConfigurationService,public http: HttpClient,private sbillEndpoint: SBillEndpoint, private router: Router,private auth:AuthService,
      private checkpermission:CheckPermissionsService) {}

    printBillInfo(bill: any, options: any, printerLabel, isVatEnable: boolean, logoPath: string,isOld?) {
      this.isTobaccoExist=false
        this.vatPercentage = bill.billItems && bill.billItems.length > 0 ? bill.billItems[0].vatTypeDefaultValue :
            bill.billService && bill.billService.length > 0 ? bill.billService[0].vatTypeDefaultValue : 0;
        this.isVatEnable = isVatEnable
        this.logoPath = logoPath;

        let newWindow = window.open("");
        var tobaccoExist = bill.billItems.find(i => (i.vatTypeTwoId >0 &&   i.vatTypeTwoId)||i.actualVatTwo>0);
         if(tobaccoExist &&  this.checkpermission.checkGroup(7,5))
          this.isTobaccoExist=true
       
        console.log(bill.billItems,bill);
        if(!bill.totalVatTow){
          bill.totalVatTow=0
          bill.billItems.forEach(e =>{
            if(e.actualVatTwo)
            bill.totalVatTow+=e.actualVatTwo
            console.log(bill.totalVatTow,e.actualVatTwo)
          })
        }
        newWindow.document.write(isOld?this.htmlBuilder(bill, options, printerLabel):this.htmlBuilderNew(bill, options, printerLabel));
        setTimeout(() => {
            newWindow.print();
             newWindow.close();
        }, 200);
        }

    createPdfBillInfo(bill: any, options: any, printerLabel, isVatEnable: boolean, logoPath: string ) {
      this.vatPercentage = bill.billItems && bill.billItems.length > 0 ? bill.billItems[0].vatTypeDefaultValue :
          bill.billService && bill.billService.length > 0 ? bill.billService[0].vatTypeDefaultValue : 0;
      this.isVatEnable = isVatEnable
      this.logoPath = logoPath;
      //let newWindow = window.open("");
      console.log(bill.billItems);
     // newWindow.document.write(this.htmlBuilder(bill, options, printerLabel));
     /* setTimeout(() => {
          newWindow.print();
          newWindow.close();
      }, 200);

      */
      var tobaccoExist = bill.billItems.find(i => (i.vatTypeTwoId >0 && ! !  i.vatTypeTwoId)||i.actualVatTwo||i.actualVatTwo      );
      if(tobaccoExist)
       this.isTobaccoExist=true
 
     console.log(bill.billItems,bill);
     if(!bill.totalVatTow){
       bill.totalVatTow=0
       bill.billItems.forEach(e =>{
         if(e.actualVatTwo)
         bill.totalVatTow+=e.actualVatTwo
         console.log(bill.totalVatTow,e.actualVatTwo)
       })
     }
   
      let newWindow = window.open("");
     // newWindow.document.write(this.htmlBuilder(bill, options, printerLabel,true));
      const obj = { htmlContent: this.htmlBuilder(bill, options, printerLabel,true), fileName: 'somename' }
      return this.http.post(this.url, obj, { responseType: 'blob' });
  }
  get url() {
    return this.configurations.baseUrl + this._url;
}
    allDiscount(bill): number {
        let discount = 0;
        const dataArray = [...bill['billService'], ...bill.billItems];
        dataArray.forEach(x => {
            discount += +x.discount
        });
        return discount;

    }


saveAndPrint(bill: any, options: ThermalPrintOptions) {
    // window.document.write(this.htmlBuilder(bill, options, printerLabel));
    // window.print();
    // this.htmlBuilder(bill, options);



}
    private htmlBuilder(bill: any, option: any, printerLabel,pdf?) {
        const initial = {
            price: 0,
            quantity: 0,
            vatTypeDefaultValue: 0,
            totalDiscount: 0,
            priceWithVat: 0
        };
        const dateOptions = {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        };
        const timeOptions = {
            hour: "numeric",
            minute: "numeric"
        };
        const arrayData = [...bill.billItems, ...bill.billService];
        const obj = arrayData.reduce((acc, e) => {
            acc["price"] = acc["price"] + e.price;
            acc["quantity"] = +acc["quantity"] + +e.quantity;
            acc["vatTypeDefaultValue"] =
            acc["vatTypeDefaultValue"] + e.vatTypeDefaultValue;
            acc["totalDiscount"] =
            acc["totalDiscount"] + e.discount;
            acc["priceWithVat"] = acc["priceWithVat"] + e.priceWithVat;
            return acc;
        }, initial);
        console.log(obj);
        return `
            <html dir="rtl">
            <style>
            ${this.cssBuilder()}
            </style>
           ${ pdf? `<div style="height:35px;"></div>
            <div style="display:flex; justify-content:center; ">`:``}
            <div class="content" ${pdf?`style="margin-right:30%;"`:``}>
            <header>
            ${this.logoPath && this.logoPath.length > 0 ? `
            <div style="text-align: center;">
                <img src='${window.location.origin}/${this.logoPath}' style="height:250px ">
            </div>
            ` : ""}
            <div class="header-item" style="text-align: center;">
               <h3>${option['shopName']}</h3>
                 <h3>${option['header']}</h3>
               <h3 style="margin-top: 0;">${printerLabel}</h3>
            </div>
            ${option['vatNumber']?(this.isVatEnable ? ` <div class="header-item">
              الرقم الضريبي : <span> ${option['vatNumber']}</span>

            </div>` : ""):``}
            
            <div class="header-item">
              رقم الفاتورة : <span> ${bill.receiptCode}</span>

            </div>
           
            <div class="header-item"">
            اسم البائع: <span> ${bill.userCreaterName}
            </div>

            </tr>    
        
            <table style="width:100%; border: none;">
                <tr style="border: none;">
                <td style="border: none; text-align:center;">
                    <div class="header-item">
                    التاريخ: <span> ${bill.date.toLocaleDateString(
                        "ar-EG"
                    )}
                    </span>
                    </div>
                </td>
                <td style="border: none; text-align:center;">
                    <div class="header-item">
                    الوقت: <span> ${bill.date.toLocaleTimeString(
                        "ar-EG"
                    )}
                    </div>
                </td>


                </tr>
                   <tr style="border: none;">
                    <td style="border: none; text-align:center;">
                        <div class="header-item">
                        اسم العميل: <span> ${bill.personName ? bill.personName : ''}</span>
                        </div>
                    </td>
                    <td style="border: none; text-align:center;">
                        <div class="header-item">
                        جوال العميل: <span> ${bill.personMobile ? bill.personMobile : ''}</span>
                        </div>
                    </td>
                </tr>

                <tr style="border: none;">
                    <td style="border: none; text-align:center;">
                        <div class="header-item">
                        رقم الجوال: <span> ${option.mobile}</span>

                        </div>
                    </td>
                    <td style="border: none; text-align:center;">
                        <div class="header-item">
                        رقم الهاتف : <span> ${option.phone}</span>
                        </div>
                    </td>
                </tr>
            </table>
          <table>
            <tr style="border-top: 1px black dashed; border-bottom: 1px black dashed;">
              <th>الصنف</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
            </tr>
            ${this.populateData(bill)}

            <tr style="border-top: 1px black dashed;">
            <td colspan="3" class="title">السعر ${this.isVatEnable ? this.isTobaccoExist?`قبل الضرائب`:`قبل الضريبة`: ""}</td>
            <td>${(+bill['serviceTotalWithoutVat']).toFixed(2)}ريال</td>
            <tr/>
            ${this.isTobaccoExist?`<tr>
            <td colspan="3">ضريبة التبغ</td>
            <td>${bill.totalVatTow.toFixed(2)} ريال</td>
            </tr>`:``} 
            ${this.isVatEnable ? `
          
            <tr>
            <td colspan="3">ضريبة القيمة المضافة</td>
            <td>${+bill['totalVat'].toFixed(2)} ريال</td>
            </tr>
            <tr>
           ${this.isTobaccoExist?`<td colspan="3">السعر بعد الضرائب</td>`:`<td colspan="3">السعر بعد الضريبة</td>`} 
            <td>${Math.round((+bill['serviceTotalWithoutVat'] + +bill['totalVat'] +bill['totalVatTow'])*100)/100} ريال</td>
            </tr>
            ` : ` ${this.isTobaccoExist?`<tr> <td colspan="3">السعر بعد الضريبة</td>
            <td>${(Math.round(bill['serviceTotalWithoutVat'] + +bill['totalVat'] +bill['totalVatTow'])*100)/100} ريال</td>
            </tr>
            `:``} 
            `}
            <tr>
            <td colspan="3">الخصم</td>
            <td>${(this.allDiscount(bill) + +bill.discount).toFixed(2)} ريال</td>
            </tr>
            <tr>
            <td colspan="3">السعر بعد الخصم</td>
            <td>${bill.totalAfterDiscount ? Math.round((bill['serviceTotalWithVat'] - bill['discount'])*100)/100 + ' ريال ' : ''}</td>
            </tr>
          
          </table>
          <table>
          <tr>
          <th>طريقة الدفع </th>
          <th>المبلغ</th>
        
        </tr>
        ${this.populatePayment(bill)}</table>
          ${this.isVatEnable ? `
          <br>
          <table>
               <tr>
                  <td colspan="6" style="text-align:center">
                  <canvas id="qrcode-canvas"  background-color:#E8E8E8"></canvas>
                  </td>
               </tr>
              <tr>
                  <td colspan="6">
                    <div style="vertical-align:top;margin-top:3px;">
                     السعر بعد الضريبة يشمل ضريبة القيمة المضافة ${this.vatPercentage * 100}%
                    </div>
                  </td>
              </tr>
              ${this.isTobaccoExist && bill?` <tr>
              <td colspan="6">
                <div style="vertical-align:top;margin-top:3px;">
                السعر بعد الضريبة يشمل ضريبة التبغ 100 %
                </div>
              </td>
          </tr>`:``}
             
          </table>
        `: `  ${this.isTobaccoExist?` <tr>
        <td colspan="6">
          <div style="vertical-align:top;margin-top:3px;marginn-top:10px">
          السعر بعد الضريبة يشمل ضريبة التبغ 100 %
          </div>
        </td>
    </tr>`:``}`}
            <div style="style="border-top: 1px black dashed;"> </div>
          <footer>
            <div class="footer-item">
              ${option.terms?` <h3> شروط الاستبدال والاسترجاع </h3>
              <p>${option.terms}</p>`:``} 
                <br/>
                <p style="text-align: center;">${option.footer}</p>
                <p style="text-align: center;">${option.address}</p>
          </div>

        </footer>
       ${pdf? `</div>
        <div style="width:200px"></div>
        </div>`:``}

        <script src="/qrcodegen.js"></script>
        <script type="text/javascript">
       
         function drawCanvas(qr, scale, border, canvas) {
             const width = (qr.size + border * 2) * scale;
             canvas.width = width;
             canvas.height = width;
             let ctx = canvas.getContext("2d")
             for (let y = -border; y < qr.size + border; y++) {
               for (let x = -border; x < qr.size + border; x++) {
                 ctx.fillStyle = qr.getModule(x, y) ? "#000" : "#fff";
                 ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
               }
             }
           }
     
           (function() {
            const QRC = qrcodegen.QrCode;
            const qr0 = QRC.encodeText(${this.generateQRData(option, bill)}, QRC.Ecc.MEDIUM);
            canvas = document.getElementById("qrcode-canvas")
            drawCanvas(qr0, 5, 0, canvas)
          })();
       </script>
      
          </html>
           `;
    }


    redirect() {
        this.router.navigate(["/"]);
    }

    private cssBuilder() {
        return `
        body {
      
        }
        @media print {
         body {transform: scale(0.7);}
   
}
       .global-container{
       
       width:100%;
       display:flex;
       justify-content:center; 
       }
        .content {
        margin-left:12%;
            width: 300px;
        }
        table, th, td {
            border: none;
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
            grid-template-columns: 1fr;
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

        const dataArray = [...bill['billService'], ...bill.billItems];

        const result = dataArray.map(a => {
            return `
            <tr>
            <td>${a.nameAr}</td>
            <td>${a.price}</td>
            <td>${a.quantity}</td>
            <td>${(a.quantity * a.price).toFixed(2)}</td>
          </tr>
            `;
        });

        return result.join(" ");
    }

    private populatePayment(bill: SBill) {

        const dataArray = [...bill.paymentMethods];

        const result = dataArray.map(a => {
            return `
            <tr>
            <td>${a.name}</td>
            <td>${a.amount}</td>
           
          </tr>
            `;
        });
       result.push(`
        <tr>
        <td>مجموع الدفعات</td>
        <td>${bill.totalAfterDiscount}</td>
       
      </tr>
        `)
        return result.join(" ");
    }
    /*generateQRData(options:any, bill:any){
        let data = "اسم المورد: " + options['shopName'] + ' | '
        data += "رقم تسجيل ضريبة القيمة المضافة للمورد: " + options['vatNumber'] + ' | '
        data += "الطابع الزمني للفاتورة: " + bill['date'] + ' | '
        data += "إجمالي الفاتورة: " + `${bill.totalAfterDiscount ? +(bill['serviceTotalWithVat'] - bill['discount']).toFixed(2) : ''}` + ' | '
        data += "إجمالي ضريبة القيمة المضافة: " + `${+bill['totalVat'].toFixed(2)}` + ' | '
         return `'${data}'`
        
       }*/

       generateQRData(printOptions:any, bill:any){
        
          let sallerNameBuf = this.getTLVForValue("1", String(printOptions['shopName']));
          let vatReistrationNumBuf = this.getTLVForValue("2", String(printOptions['vatNumber']))
          let dateTimeBuf = this.getTLVForValue("3",new Date(String(bill['date'])).toISOString())
          let totalWithVat = bill.totalAfterDiscount ? Math.round((bill['serviceTotalWithVat'] - bill['discount'])*100)/100 : ''
          let invoiceAmountBuf = this.getTLVForValue("4", String(totalWithVat))
          let vatAmountBuf = this.getTLVForValue("5", String(bill['totalVat'].toFixed(2)))
          let tagsBufArray = [sallerNameBuf, vatReistrationNumBuf, dateTimeBuf, invoiceAmountBuf, vatAmountBuf]
          let qrCodeBuf = Buffer.concat(tagsBufArray)
          let qrCodeB64 = qrCodeBuf.toString('base64');
          return `'${qrCodeB64}'`
         
        }
        generateQRData1(printOptions:any, bill:any){
        
          let sallerNameBuf = this.getTLVForValue("1", String(printOptions['shopName']));
          let vatReistrationNumBuf = this.getTLVForValue("2", String(printOptions['vatNumber']))
          let dateTimeBuf = this.getTLVForValue("3",new Date(String(bill['date'])).toISOString())
          let totalWithVat = bill.totalAfterDiscount ? Math.round((bill['totalAfterDiscount'])*100)/100 : ''
          let invoiceAmountBuf = this.getTLVForValue("4", String(totalWithVat))
          let vatAmountBuf = this.getTLVForValue("5", String(bill['totalVat'].toFixed(2)))
          let tagsBufArray = [sallerNameBuf, vatReistrationNumBuf, dateTimeBuf, invoiceAmountBuf, vatAmountBuf]
          let qrCodeBuf = Buffer.concat(tagsBufArray)
          let qrCodeB64 = qrCodeBuf.toString('base64');
          return `'${qrCodeB64}'`
         
        }
       
        getTLVForValue(tagNum, tagValue:string){
         var tagBuf =  Buffer.from([tagNum]);
         var tagValueBuf = Buffer.from(tagValue , 'utf8')
         var tagValueLenBuf = Buffer.from([tagValueBuf.length])
         var bufsArray = [tagBuf, tagValueLenBuf, tagValueBuf]
         return Buffer.concat(bufsArray);
        }

        private htmlBuilderNew(bill: any, option: any, printerLabel,pdf?) {
          const initial = {
              price: 0,
              quantity: 0,
              vatTypeDefaultValue: 0,
              totalDiscount: 0,
              priceWithVat: 0
          };
          const dateOptions = {
              year: "numeric",
              month: "numeric",
              day: "numeric"
          };
          const timeOptions = {
              hour: "numeric",
              minute: "numeric"
          };
          const arrayData = [...bill.billItems, ...bill.billService];
          const obj = arrayData.reduce((acc, e) => {
              acc["price"] = acc["price"] + e.price;
              acc["quantity"] = +acc["quantity"] + +e.quantity;
              acc["vatTypeDefaultValue"] =
              acc["vatTypeDefaultValue"] + e.vatTypeDefaultValue;
              acc["totalDiscount"] =
              acc["totalDiscount"] + e.discount;
              acc["priceWithVat"] = acc["priceWithVat"] + e.priceWithVat;
              return acc;
          }, initial);
          console.log(obj);
          return `
              <html dir="rtl">
              <style>
              ${this.cssBuilder()}
              </style>
             ${ pdf? `<div style="height:35px;"></div>
              <div style="display:flex; justify-content:center; ">`:``}
              <div class="global-container">
              <div class="content" ${pdf?`style="margin-right:30%;"`:``}>
              <header>
              ${this.logoPath && this.logoPath.length > 0 ? `
              <div style="text-align: center;">
                  <img src='${window.location.origin}/${this.logoPath}' style="height:250px">
              </div>
              ` : ""}
              <div class="header-item" style="text-align: center;">
                 <h3>${option['shopName']}</h3>
                   <h3>${option['header']}</h3>
                 <h3 style="margin-top: 0;">${printerLabel}</h3>
              </div>
              ${option['vatNumber']?(this.isVatEnable ? ` <div class="header-item">
                الرقم الضريبي : <span> ${option['vatNumber']}</span>
  
              </div>` : ""):``}
              
              <div class="header-item">
                رقم الفاتورة : <span> ${bill.receiptCode}</span>
  
              </div>
             
              <div class="header-item"">
              اسم البائع: <span> ${bill.userCreaterName}
              </div>
  
              </tr>    
          
              <table style="width:100%; border: none;">
                  <tr style="border: none;">
                  <td style="border: none; text-align:center;">
                      <div class="header-item">
                      التاريخ: <span> ${bill.date.toLocaleDateString(
                          "ar-EG"
                      )}
                      </span>
                      </div>
                  </td>
                  <td style="border: none; text-align:center;">
                      <div class="header-item">
                      الوقت: <span> ${bill.date.toLocaleTimeString(
                          "ar-EG"
                      )}
                      </div>
                  </td>
  
  
                  </tr>
                     <tr style="border: none;">
                      <td style="border: none; text-align:center;">
                          <div class="header-item">
                          اسم العميل: <span> ${bill.personName ? bill.personName : ''}</span>
                          </div>
                      </td>
                      <td style="border: none; text-align:center;">
                          <div class="header-item">
                          جوال العميل: <span> ${bill.personMobile ? bill.personMobile : ''}</span>
                          </div>
                      </td>
                  </tr>
  
                  <tr style="border: none;">
                      <td style="border: none; text-align:center;">
                          <div class="header-item">
                          رقم الجوال: <span> ${option.mobile}</span>
  
                          </div>
                      </td>
                      <td style="border: none; text-align:center;">
                          <div class="header-item">
                          رقم الهاتف : <span> ${option.phone}</span>
                          </div>
                      </td>
                  </tr>
              </table>
            <table>
              <tr style="border-top: 1px black dashed; border-bottom: 1px black dashed;">
                <th>الصنف</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th>الإجمالي</th>
              </tr>
              ${this.populateData(bill)}
  
              <tr style="border-top: 1px black dashed;">
              <td colspan="3" class="title">السعر ${this.isVatEnable ? this.isTobaccoExist?`قبل الضرائب`:`قبل الضريبة`: ""}</td>
              <td>${(+bill['totalPriceBeforeVat'])}ريال</td>
              <tr/>
              ${this.isTobaccoExist?`<tr>
              <td colspan="3">ضريبة التبغ</td>
              <td>${bill.totalVatTow.toFixed(2)} ريال</td>
              </tr>`:``} 
              ${this.isVatEnable ? `
            
              <tr>
              <td colspan="3">ضريبة القيمة المضافة</td>
              <td>${+bill['totalVat'].toFixed(2)} ريال</td>
              </tr>
              <tr>
             ${this.isTobaccoExist?`<td colspan="3">السعر بعد الضرائب</td>`:`<td colspan="3">السعر بعد الضريبة</td>`} 
              <td>${Math.round((+bill['totalPriceAfterVat'])*100)/100} ريال</td>
              </tr>
              ` : ` ${this.isTobaccoExist?`<tr> <td colspan="3">السعر بعد الضريبة</td>
              <td>${Math.round((+bill['totalPriceAfterVat'])*100)/100}  ريال</td>
              </tr>
              `:``} 
              `}
              <tr>
              <td colspan="3">الخصم</td>
              <td>${(this.allDiscount(bill) + +bill.discount).toFixed(2)} ريال</td>
              </tr>
              <tr>
              <td colspan="3">الاجمالي </td>
              <td>${bill.totalAfterDiscount ? Math.round((bill['totalPriceAfterVat'] )*100)/100 + ' ريال ' : ''}</td>
              </tr>
            
            </table>
            <table>
            <tr>
            <th>طريقة الدفع </th>
            <th>المبلغ</th>
          
          </tr>
          ${this.populatePayment(bill)}</table>
            ${this.isVatEnable ? `
            <br>
            <table>
                 <tr>
                    <td colspan="6" style="text-align:center">
                    <canvas id="qrcode-canvas"  background-color:#E8E8E8"></canvas>
                    </td>
                 </tr>
                <tr>
                    <td colspan="6">
                      <div style="vertical-align:top;margin-top:3px;">
                       السعر بعد الضريبة يشمل ضريبة القيمة المضافة ${this.vatPercentage * 100}%
                      </div>
                    </td>
                </tr>
                ${this.isTobaccoExist?` <tr>
                <td colspan="6">
                  <div style="vertical-align:top;margin-top:3px;">
                  السعر بعد الضريبة يشمل ضريبة التبغ 100 %
                  </div>
                </td>
            </tr>`:``}
               
            </table>
          `: `  ${this.isTobaccoExist?` <tr>
          <td colspan="6">
            <div style="vertical-align:top;margin-top:3px;marginn-top:10px">
            السعر بعد الضريبة يشمل ضريبة التبغ 100 %
            </div>
          </td>
      </tr>`:``}`}
              <div style="style="border-top: 1px black dashed;"> </div>
            <footer>
              <div class="footer-item">
                ${option.terms?` <h3> شروط الاستبدال والاسترجاع </h3>
                <p>${option.terms}</p>`:``} 
                  <br/>
                  <p style="text-align: center;">${option.footer}</p>
                  <p style="text-align: center;">${option.address}</p>
            </div>
  </div>
          </footer>
          ${pdf? `</div>
          <div style="width:200px"></div>
          </div>`:``}
  
          <script src="/qrcodegen.js"></script>
          <script type="text/javascript">
         
           function drawCanvas(qr, scale, border, canvas) {
               const width = (qr.size + border * 2) * scale;
               canvas.width = width;
               canvas.height = width;
               let ctx = canvas.getContext("2d")
               for (let y = -border; y < qr.size + border; y++) {
                 for (let x = -border; x < qr.size + border; x++) {
                   ctx.fillStyle = qr.getModule(x, y) ? "#000" : "#fff";
                   ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
                 }
               }
             }
       
             (function() {
              const QRC = qrcodegen.QrCode;
              const qr0 = QRC.encodeText(${this.generateQRData1(option, bill)}, QRC.Ecc.MEDIUM);
              canvas = document.getElementById("qrcode-canvas")
              drawCanvas(qr0, 5, 0, canvas)
            })();
         </script>
        
            </html>
             `;
      }
  
  
}
