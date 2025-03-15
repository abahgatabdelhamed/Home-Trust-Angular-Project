//import { Bill } from "./../../purch/models/bill.model";
import { Injectable } from "@angular/core";
import { BillPost } from "../models/bill-post.model";
import { SBillEndpoint } from "./sbill-endpoint.service";
import { Observable } from "rxjs/Observable";
import { SBill } from "../models/sbill.model";
import { PrintOptions } from "../models/print-options.model";
import { SettingsService } from "../../../services/settings.service";
import { Bill } from "../../purch/models/bill.model";
import { CheckPermissionsService } from "../../../services/check-permissions.service";
import { Calc } from "calc-js";

@Injectable()
export class NewBillService {
    isDiscountExist: boolean = false;
    isTobaccoExist: boolean = false;
    isVatEnable: boolean = false;
    logoPath: string;
    vatPercentage: number;
    alltobaaccoVat=0
    accounttype=''
    constructor(private sbillEndPoint: SBillEndpoint,private checkpermission:CheckPermissionsService) {

    }

    printBillInfo(bill, options: any, printerLabel, isVatEnable: boolean, logoPath: string) {
      this.accounttype=''
      bill.paymentMethods.forEach((e ,i)=>{
        this.accounttype+=''+ e.name+':'+e.amount+ (i==bill.paymentMethods.length-1?' . ':' - ')
      })
      bill.discount=0
      bill.discount=bill.billItems.forEach(item => {
        console.log(item)
        bill.discount+=item.discount
      });

      console.log('****************',bill)
      bill.accountType
      this.vatPercentage = bill.billItems && bill.billItems.length > 0 ? bill.billItems[0].vatTypeDefaultValue :
            bill.billService && bill.billService.length > 0 ? bill.billService[0].vatTypeDefaultValue : 0;
        this.isVatEnable = isVatEnable
        this.logoPath = logoPath;
        let seriable = false;
        let cols = 0;
        console.log('billservices', bill.billService);
        const a = [{ id: 0, name: 'dude' }, { id: 1, name: 'mood' }];


        bill.billItems.forEach(element => {
            if (element.serialNo) {
                seriable = true;
                cols = 1;
            }
        });
        console.log(seriable);
        let newWindow = window.open("");
        var itemsDiscount = bill.billItems.find(i => i.discount > 0);
        var tobaccoExist = bill.billItems.find(i => (i.vatTypeTwoId >0 && ! !  i.vatTypeTwoId)||i.actualVatTwo||i.actualTwoVat      );
        var servicesDiscount = bill.billService.find(i => i.discount > 0);
        if(tobaccoExist && this.checkpermission.checkGroup(7,5))
          this.isTobaccoExist=true
        if (itemsDiscount) {
            this.isDiscountExist = true
        }
        else if (servicesDiscount) {
            this.isDiscountExist = true
        }
        else {
            this.isDiscountExist = false
        }
        newWindow.document.write(
            this.htmlBuilder(bill, options, printerLabel, seriable, cols)
        );
        setTimeout(() => {
            newWindow.print();
            this.isTobaccoExist=false
          //  newWindow.close();
        }, 200);
        

    }

    saveAndPrint(bill, options) {
        return Observable.of(this.printBillInfo);
    }

    allDiscount(bill): number {
        let discount = 0;
        const dataArray = [...bill['billService'], ...bill.billItems];
        dataArray.forEach(x => {
            discount =new Calc (discount).sum(+x.discount).finish()
        });
        return discount;

    }


    private htmlBuilder(bill, options: any, printerLabel, seriable, cols) {


        var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        if (printerLabel != "صرف أصناف") {
            return `
        <html dir="rtl" >
        
        
        
       <style>
        ${this.cssBuilder()}
       </style>
       </head>
       <div class="main-container">
      <div class="global" style="width: 710px;"> 
       <table style="width: -webkit-fill-available; margin-bottom: 10px;"" colspan="12">
       <tr>
       <th style="width: 50%;">
${this.logoPath && this.logoPath.length > 0 ? `
            <img style="width: 300px;
            height: 145px;" src='${window.location.origin}/${this.logoPath}' style="height:100px">
            ` : ""}
            </th>
            <th>
      
${options.header}
</th>
</tr>
</table>
          
     <table style="width:  -webkit-fill-available; margin-top: -11px;" colspan="12">
       <tr>
         <th colspan=${12 + cols}>${printerLabel}</th>
       </tr>
       <tr>

          <th class="inline" style="width: 50%;" colspan="7">
           <span class="label">العميل : </span>
           <span class="result">${bill.personName ? bill.personName : ''}</span>

         </th>
         <th class="inline" colspan="5">
         <span class="label">رقم الفاتورة : </span>
         <span class="result">${bill.receiptCode ? bill.receiptCode : ''}</span>

       </th>
       </tr>
       <tr>
          <th class="inline" colspan="7">
           <span class="label"> جوال العميل : </span>
           <span class="result">${bill.personMobile ? bill.personMobile : ''}</span>

         </th>
         <th class="inline" colspan="5">
         <span class="label">التاريخ  : </span>
         <span class="result">${bill.date ? bill.date.toLocaleDateString(
                "ar-EG",
                dateOptions
            ) : ''}</span>
       </th>
       </tr>
       <tr>
       <th class="inline"  colspan="7">
        ${this.isVatEnable ? `<span class="label">الرقم الضريبي العميل : </span>
       <span class="result">${
                    bill["vatNumber"] ? bill["vatNumber"] : ""
                    }</span>` : ""}
       

     </th>
         <th class="inline" colspan="5">
           <span class="label"> السداد : </span>
           <span class="result">${this.accounttype}</span>
         </th>

           <tr>
         <th class="inline" colspan="7">
                   <span class="label"> عنوان العميل: </span>
           <span class="result">${
                bill["address"] ? bill["address"] : ""
                }</span>
             </th>

             <th class="inline" colspan="5">
             <span class="label"> اسم البائع: </span>
     <span class="result">${
            bill.userCreaterName
          }</span>
       </th>
             
       </tr>
       </tr>
       </table>
       <br>
       <br>
       <table style="width: 710px;">
       <tr>
       <th class="title-data"  colspan="1">
           <p>الرمز</p>
           <p>Code</p>
       </th>
       <th class="title-data"  colspan="${bill.receiptCode.includes('EX')?'1':(!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`)}">
       <p>الصنف</p>
       <p>Item</p>
       </th>
       <th class="title-data"  colspan="1">
       <p>الوحدة</p>
       <p>Unit</p>
       </th>
       <th class="title-data"  colspan="1">
       <p>الكمية</p>
       <p>Qty</p>
       </th>
       ${seriable ? `<th class="title-data"  colspan="1">
       <p>SerialNo</p>
       </th>`: ""}
       ${!bill.receiptCode.includes('EX')?`
       <th class="title-data"  colspan="1">
       <p>السعر</p>
       <p>Price</p>
       </th>
       ${this.isDiscountExist ? `<th class="title-data"  colspan="1">
       <p>الخصم</p>
       <p>Dis</p>
       </th>`: ""}
      
        ${this.isVatEnable  ? `
       ${this.isTobaccoExist?`<th class="title-data" colspan="1">
       <p> الإجمالي قبل الضرائب</p>
       <p> Total Before Taxes</p>
       </th>
       
       <th class="title-data"  colspan="1">
        <p>ضريبة التبغ</p>
        <p>Tobacco Tax</p>
        </th>
        <th class="title-data"  colspan="1">
        <p> الضريبة المضافة</p>
        <p>  VAT</p>
        </th> 
        `:`<th class="title-data" colspan="1">
       <p> الإجمالي قبل الضريبة</p>
       <p> Total Before VAT</p>
       </th>
       
       <th class="title-data"  colspan="1">
       <p> الضريبة المضافة</p>
       <p>  VAT</p>
       </th>
       
       `} `: `${this.isTobaccoExist?`<th class="title-data"  colspan="1">
       <p>ضريبة التبغ</p>
       <p>Tobacco Tax</p>
       </th>`:``} `} 
       
       
        ${this.isTobaccoExist?`  <th class="title-data"  colspan="${this.isVatEnable ? `1` : `3`}">
        <p>${this.isVatEnable ? `الإجمالي بعد الضرائب` : `الإجمالي`}</p>
        <p>${this.isVatEnable?`Total After Taxes`:`Total`}</p>
        </th>`:`  <th class="title-data"  colspan="${this.isVatEnable ? `1` : `3`}">
        <p>${this.isVatEnable ? `الإجمالي بعد الضريبة` : `الإجمالي`}</p>
        <p>${this.isVatEnable?`Total After VAT`:`Total`}</p>
        </th>`}
        
      

       </tr>
`:``}
${this.populateData(bill, seriable)}
${!bill.receiptCode.includes('EX')?`
<tr>
${(this.isDiscountExist && !this.isTobaccoExist)||(!this.isDiscountExist && this.isTobaccoExist)? `<th colspan=${(this.isVatEnable?!this.isDiscountExist? 8: 9:8) + cols} class="inline">
<span class="">الاجمالي Total: </span>
</th>`:((this.isDiscountExist && this.isTobaccoExist) ?`<th colspan=${(this.isVatEnable ? 9 : 9) + cols} class="inline">
<span class="">الاجمالي Total: </span>
</th>`:`<th colspan=${(this.isVatEnable ? 8 : 8) + cols} class="inline">
<span class="">الاجمالي Total: </span>
</th>`)}


${this.isVatEnable ? `
<th colspan="1" class="title-data">
<span class="">${(bill['totalPriceBeforeVat'])} ريال </span>
    
  </th>
 ${this.isTobaccoExist?`<th colspan="1" class="title-data">
 <span class="">${+this.alltobaaccoVat.toFixed(2)}  ريال </span>
     
   </th>`:``} 
<th colspan="1" class="title-data">
<span class="">${+bill['totalVat']} ريال </span>
    
  </th>` : `  `}

  ${this.isTobaccoExist&&!this.isVatEnable?`<th colspan="1" class="title-data">
  <span class="">${bill['totalVatTwo']}  ريال </span>
      
    </th>`:``}
    <th colspan="${this.isVatEnable ? `1` : `3`}" class="title-data">
    <span class="">${bill['totalPriceAfterVat']} ريال </span>
  </th>
</tr>
`:``}
      <tr>
      ${this.isVatEnable?`  ${(this.isDiscountExist && !this.isTobaccoExist)||(!this.isDiscountExist && this.isTobaccoExist) ? `<th colspan=${10 + cols} rowspan="2" class="inline notes">
      <span class="title-note">الملاحظات Notes: </span>
      <p class="note-body">${bill['notes']}</p>
    </th>`: ((this.isDiscountExist && this.isTobaccoExist)?`      <th colspan=${11 + cols} rowspan="2" class="inline notes">
    <span class="title-note">الملاحظات Notes: </span>
    <p class="note-body">${bill['notes']}</p>
  </th>`:`      <th colspan=${9 + cols} rowspan="2" class="inline notes">
    <span class="title-note">الملاحظات Notes: </span>
    <p class="note-body">${bill['notes']}</p>
  </th>`)}
`:`  ${(this.isDiscountExist && !this.isTobaccoExist)||(!this.isDiscountExist && this.isTobaccoExist) ? `<th colspan=${8 + cols} rowspan="2" class="inline notes">
<span class="title-note">الملاحظات Notes: </span>
<p class="note-body">${bill['notes']}</p>
</th>`: ((this.isDiscountExist && this.isTobaccoExist)?`      <th colspan=${9 + cols} rowspan="2" class="inline notes">
<span class="title-note">الملاحظات Notes: </span>
<p class="note-body">${bill['notes']}</p>
</th>`:`      <th colspan=${8 + cols} rowspan="2" class="inline notes">
<span class="title-note">الملاحظات Notes: </span>
<p class="note-body">${bill['notes']}</p>
</th>`)}
`}
${!bill.receiptCode.includes('EX')?`
      <th colspan="1" class="inline" style="text-align: center;">
      <span class="" >الخصم  </span>
    </th>
       <th colspan="1" class="inline" style="text-align: center;" >
           <span class=""> ${Math.round(this.allDiscount(bill)*100)/100}  ريال  </span>
         </th>
       </tr>
       <tr>
            </th>
            <th colspan="1" class="inline" style="text-align: center;">
            <span class="" style="text-align: center;">المطلوب</span>
          </th>
           <th colspan="1" class="inline" style="text-align: center;">
           <span class="">${bill.totalPriceAfterVat  +' ريال'  }</span>
         </th>    </th>

       </tr>
       ${this.isVatEnable ? `
          <tr style="border:none">
            <th colspan="2" class="inline" >
            <div style="font-size:20px;display:flex;justify-content:space-around;">   
            <p style="width: 82px;">نسبة ضريبة القيمة المضافة:</p> <p style="padding-top: 15%;">${this.vatPercentage * 100}%</p>
            </div>
            </th>
            ${this.isTobaccoExist?`<th colspan="2" class="inline" >
            <div style="font-size:20px;display:flex;justify-content:space-around;">   
            <p style="width: 82px;"> نسبة ضريبة التبغ:</p> <p style="padding-top: 15%;"> 100%</p>
            </div>
            </th>`:``}
            <th   ${seriable &&!this.isDiscountExist&&!this.isTobaccoExist?`colspan="8"`:(seriable &&this.isDiscountExist&&!this.isTobaccoExist?`colspan="7"`:!seriable &&this.isDiscountExist&&!this.isTobaccoExist?`colspan="8"`:this.isTobaccoExist&&!seriable &&this.isDiscountExist?`colspan="5"`:this.isTobaccoExist&&seriable &&!this.isDiscountExist?`colspan="6"`:this.isTobaccoExist&&seriable &&this.isDiscountExist?`colspan="8"`:(`colspan="7"`))} class="inline">
           <div  style="font-size:20px;display:flex;justify-content:space-around;" >
            <p style="width: 62px;">الرقم الضريبي:</p> <p>${options['vatNumber']}</p>
            </div>
            </th>
           
            <th  ${seriable &&!this.isDiscountExist&&!this.isTobaccoExist?`colspan="3"`:(seriable &&this.isDiscountExist&&!this.isTobaccoExist?`colspan="4"`:!seriable &&this.isDiscountExist&&!this.isTobaccoExist?`colspan="3"`:this.isTobaccoExist&&!seriable &&this.isDiscountExist?`colspan="4"`:this.isTobaccoExist&&seriable &&!this.isDiscountExist?`colspan="4"`:this.isTobaccoExist&&seriable &&this.isDiscountExist?`colspan="5"`:this.isTobaccoExist&&!seriable &&!this.isDiscountExist?`colspan="3"`:(`colspan="2"`))} class="inline">
            <canvas id="qrcode-canvas" style="margin-right: 25px; height: 150px; width: 150px;"  background-color:#E8E8E8"></canvas>
            </th>
        </tr> `: `${this.isTobaccoExist?`<th colspan="12" class="inline" >
        <div style="font-size:20px;display:flex;justify-content:space-around;">   
        <p style="">   نسبة ضريبة التبغ:100%</p> 
        </div>
        </th>`:``}`}
        ${options.tobaccoTrade?`<tr >
        <th vertical-align: top;" colspan="12"> نسبة ضريبة التبغ 100 %</th>
        </tr> `:``} 
        `:``}
     </table>
     
    
     <div class="footer">
     <p style="font-size: 16px;text-align:right;">

${options.footer}
     </p>
   </div>
   </div>
   </div>
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
        const qr0 = QRC.encodeText(${this.generateQRData(options, bill)}, QRC.Ecc.LOW);
        canvas = document.getElementById("qrcode-canvas")
        drawCanvas(qr0, 2, 0, canvas)
      })();
  </script>
     </html>
       `;
        }
        else {
            return `
        <html dir="rtl" >
       <style>
        ${this.cssBuilder()}
       </style>
       <header>
       ${options.header}
     </header>
     <table>
       <tr>
         <th colspan="10">${printerLabel}</th>
       </tr>

        <tr>
            <th class="inline" colspan="5">
                <span class="label">من حساب : </span>
                <span class="result">${bill.fromAccountName ? bill.fromAccountName : ''}</span>
            </th>
            <th class="inline" colspan="5">
                <span class="label">إلى حساب : </span>
                <span class="result">${bill.toAccountName ? bill.toAccountName : ''}</span>
            </th>
        </tr>

        <tr>
            <th class="inline" colspan="5">
                <span class="label">رقم السند: </span>
                <span class="result">${bill.receiptCode ? bill.receiptCode : ''}</span>
            </th>
            <th class="inline" colspan="5">
                <span class="label">رقم الفاتورة/الطلب: </span>
                <span class="result">${bill.code ? bill.code : ''}</span>
            </th>
        </tr>
        <tr>
            <th class="inline" colspan="5">
                <span class="label">التاريخ: </span>
                <span class="result">${bill.date ? bill.date.toLocaleDateString(
                "ar-EG",
                dateOptions
            ) : ''}</span>
            </th>
            <th class="inline" colspan="5">
                <span class="label">سبب الصرف: </span>
                <span class="result">${bill.exchangeReason ? bill.exchangeReason : ''}</span>
            </th>
        </tr>
       <tr>
       <th class="title-data"  colspan="2">
           <p>الرمز</p>
           <p>Code</p>
       </th>
       <th class="title-data"  colspan="6">
       <p>الصنف</p>
       <p>Item</p>
       </th>
       <th class="title-data"  colspan="2">
       <p>الكمية</p>
       <p>Qty</p>
       </th>
       </tr>

${this.populateDataE(bill, seriable)}


      <tr>
      <th colspan="10" rowspan="2" class="inline notes">
      <span class="title-note">الملاحظات  </span>
      <p class="note-body">${bill['notes']}</p>
    
       </tr>
     </table>
${this.isVatEnable ? ` <div>
            نسبة ضريبة القيمة المضافة ${this.vatPercentage * 100}%
        </div>`: ""}

     <footer>
       <div class="customer-signature">
         <p class="footer-title">توقيع العميل</p>
         <p>............</p>
       </div>
         <div class="customer-stamp">
         <p class="footer-title">الختم</p>
         <p>............</p>
       </div>
         <div class="customer-sig">
         <p class="footer-title">توقيع الموظف </p>
         <p>............</p>
       </div>
     </footer>
     <div class="footer">
     <p>

${options.footer}
     </p>
   </div>
  
     </html>
       `;
        }
    }

    private cssBuilder() {
        return `
      .main-container{
      display:flex;
      justify-content:center;
      }
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
            
            text-align: center;
          }

          .notes {
            height: auto;
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
          th > .label-eng {
              text-align: left;
          }

          .note-body {
            word-wrap: break-word;

          }
          .flex-container{
            display:flex;
            justify-content:center
          }
        `;
    }

   /* generateQRData(options:any, bill:any){
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
      let totalWithVat = bill.totalAfterDiscount ? Math.round((bill['totalAfterDiscount'])*100)/100 : ''
      let invoiceAmountBuf = this.getTLVForValue("4", String(totalWithVat))
      let vatAmountBuf = this.getTLVForValue("5", String(bill['totalVat'].toFixed(2)))
      let tagsBufArray = [sallerNameBuf, vatReistrationNumBuf, dateTimeBuf, invoiceAmountBuf, vatAmountBuf]
      let qrCodeBuf = Buffer.concat(tagsBufArray)
      let qrCodeB64 = qrCodeBuf.toString('base64');
      console.log('55555555-----------------',qrCodeB64)
      return `'${qrCodeB64}'`
     
    }
   
   
    getTLVForValue(tagNum, tagValue:string){
     var tagBuf =  Buffer.from([tagNum]);
     var tagValueBuf = Buffer.from(tagValue , 'utf8')
     var tagValueLenBuf = Buffer.from([tagValueBuf.length])
     var bufsArray = [tagBuf, tagValueLenBuf, tagValueBuf]
     return Buffer.concat(bufsArray);
    }


    private populateData(bill: any, seriable) {
      this.alltobaaccoVat=0
        const dataArray = [...bill['billService'], ...bill.billItems];
        const items = dataArray.map(a => {
          console.log(this.isTobaccoExist ,a.actualTwoVat,'*****************')
          if(!a.actualVatTwo)
          a.actualVatTwo=0
          this.alltobaaccoVat+=a.actualVatTwo
            if (seriable) {
                return `
                <tr>
                <td>${a.code}</td>
                <td colspan="${bill.receiptCode.includes('EX')?'1':(!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`)}">${a.nameAr}</td>
                <td>${a.itemUnitName}</td>
                <td>${a.quantity}</td>
                <td>${a.serialNo}</td>
                ${!bill.receiptCode.includes('EX')?`<td>${a.price} </td>
                ${this.isDiscountExist ? `<td>${a.discount} </td>` : ""}
                 ${this.isVatEnable ? `
                <td>${Math.round((a.price * (a.quantity ? a.quantity : 1) - a.discount)*100)/100} </td>
                ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo.toFixed(2):0} </td>` : ""}           
                <td>${+a.actualVat.toFixed(2)} </td>
                ` : `  ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo.toFixed(2):0} </td>` : ""}        `}
                
            <td colspan=${this.isVatEnable ? `1` : `3`}>${Math.round(a.totalPrice*100)/100} </td>
              </tr>
                `:``}
                `
            } else {
                return `
            <tr>
            <td>${a.code}</td>
            <td colspan="${bill.receiptCode.includes('EX')?'1':(!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`)}">${a.nameAr}</td>
            <td>${a.itemUnitName}</td>
            <td>${a.quantity}</td>
            ${!bill.receiptCode.includes('EX')?` <td>${a.price}</td>
            ${this.isDiscountExist ? `<td>${a.discount} </td>` : ""}
            ${this.isVatEnable ? `
            <td>${Math.round((a.price * (a.quantity ? a.quantity : 1) - a.discount)*100)/100} </td>
            ${this.isTobaccoExist  ? `<td >${(a.actualVatTwo?a.actualVatTwo.toFixed(2):0)} </td>` : ""}  
            <td>${+a.actualVat.toFixed(2)} </td>
                ` : `  ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo.toFixed(2):0} </td>` : ""}        `}
            
            <td colspan=${this.isVatEnable ? `1` : `3`}>${Math.round(a.totalPrice*100)/100} </td>
          </tr>
           `:``}
            `;
            }

        });


        return items.join('');
    }

    private populateDataE(bill: any, seriable) {
        const dataArray = [...bill['billService'], ...bill.billItems];
        const items = dataArray.map(a => {
            return `
                <tr>
                <td colspan="2">${a.code}</td>
                <td colspan="6">${a.nameAr}</td>
                <td colspan="2">${a.quantity}</td>
              </tr>
                `;
        });


        return items.join('');
    }
}
