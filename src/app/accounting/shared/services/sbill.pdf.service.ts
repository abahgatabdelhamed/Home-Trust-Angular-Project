import { ReceiptDocument } from './../../../models/receipt-documents';

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { CheckPermissionsService } from '../../../services/check-permissions.service';
declare var jsPDF: any;
@Injectable()
export class SbillPDFService extends EndpointFactory {
    private readonly _url: string = "/api/pdfcreator";
    isVatEnable: boolean = false;
    logoPath: string;
    vatPercentage: number;
    isDiscountExist:boolean=false;
  isTobaccoExist: boolean=false;
  alltobaaccoVat=0
    constructor(public http: HttpClient,configurations: ConfigurationService,
        injector: Injector, private checkpermission:CheckPermissionsService) {
        super(http, configurations, injector);
    }

    get url() {
        return this.configurations.baseUrl + this._url;
    }

    exportPDF() {
        var columns = [
            { title: "ID", dataKey: "id" },
            { title: "Name", dataKey: "name" },
            { title: "Country", dataKey: "country" }
        ];
        var rows = [
            { id: 1, name: "Shaw", country: "Tanzania" },
            { id: 2, name: "Nelson", country: "Kazakhstan" },
            { id: 3, name: "Garcia", country: "Madagascar" }
        ];
        var doc = new jsPDF("p", "pt");
        doc.autoTable(columns, rows);
        doc.save("table.pdf");
    }


    createPDF(bill: any, printerLabel, isVatEnable, logoPath) {
        this.vatPercentage = bill.billItems && bill.billItems.length > 0 ? bill.billItems[0].vatTypeDefaultValue :
            bill.billService && bill.billService.length > 0 ? bill.billService[0].vatTypeDefaultValue : 0;
        this.isVatEnable = isVatEnable
        this.logoPath = logoPath;
        let seriable = false;
        let cols = 0;
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
        var servicesDiscount = bill.billService.find(i => i.discount > 0);
        var tobaccoExist = bill.billItems.find(i => (i.vatTypeTwoId >0 && ! !  i.vatTypeTwoId)||i.actualVatTwo||i.actualTwoVat      );
        if(tobaccoExist &&  this.checkpermission.checkGroup(7,5))
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
        let printOptions = JSON.parse(localStorage.getItem("serverPrintOptions")).normalPrinter
        printOptions['shopName'] = JSON.parse(localStorage.getItem("serverPrintOptions")).thermalPrinter['shopName']
        printOptions['vatNumber'] = JSON.parse(localStorage.getItem("serverPrintOptions")).thermalPrinter['vatNumber']


        const obj = { htmlContent: this.htmlBuilder1(bill, printOptions, printerLabel, seriable, cols), fileName: 'somename' }
        return this.http.post(this.url, obj, { responseType: 'blob' });
    }
    private htmlBuilder1(bill, options: any, printerLabel, seriable, cols) {


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
  <div class="global" style="width: min-content;"> 
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
       <span class="result">${bill['accountType']}</span>
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
   <table style="width: 773px;">
   <tr>
   <th class="title-data"  colspan="1">
       <p>الرمز</p>
       <p>Code</p>
   </th>
   <th class="title-data"  colspan="${!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`}">
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
    <p>${this.isVatEnable ? `الإجمالي قبل الضريبة` : `الإجمالي`}</p>
    <p>${this.isVatEnable?`Total After VAT`:`Total`}</p>
    </th>`}
    
  

   </tr>

${this.populateData(bill, seriable)}

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
<span class="">${(+bill['serviceTotalWithoutVat'] - this.allDiscount(bill))} ريال </span>

</th>
${this.isTobaccoExist?`<th colspan="1" class="title-data">
<span class="">${+this.alltobaaccoVat.toFixed(2)}  ريال </span>
 
</th>`:``} 
<th colspan="1" class="title-data">
<span class="">${+bill['totalVat'].toFixed(2)} ريال </span>

</th>` : `  `}

${this.isTobaccoExist&&!this.isVatEnable?`<th colspan="1" class="title-data">
<span class="">${+this.alltobaaccoVat.toFixed(2)}  ريال </span>
  
</th>`:``}
<th colspan="${this.isVatEnable ? `1` : `3`}" class="title-data">
<span class="">${+bill['serviceTotalWithVat'].toFixed(2)} ريال </span>
</th>
</tr>
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

  <th colspan="1" class="inline" style="text-align: center;">
  <span class="" >الخصم  </span>
</th>
   <th colspan="1" class="inline" style="text-align: center;" >
       <span class=""> ${bill['discount']}  ريال  </span>
     </th>
   </tr>
   <tr>
        </th>
        <th colspan="1" class="inline" style="text-align: center;">
        <span class="" style="text-align: center;">المطلوب</span>
      </th>
       <th colspan="1" class="inline" style="text-align: center;">
       <span class="">${bill.totalAfterDiscount ? +(bill['serviceTotalWithVat'] - bill['discount']).toFixed(2) +' ريال'  : ''}</span>
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
 </table>
 

 <div class="footer">
 <p style="font-size: 16px;text-align:right;">

${options.footer}
 </p>
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
    }  }

  private cssBuilder1() {
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
       <header margin-bottom: 10px;">
         <table style="width:100%; border: none;">
	        <tr style="border: none;">
		        <td style="border: none;">${this.logoPath && this.logoPath.length > 0 ? `
            <img src='${window.location.origin}/${this.logoPath}' style="height:100px">
            ` : ""}</td>
		        <td style="border: none;">${options.header}</td>
	        </tr>
        </table>
     </header>
     <table>
       <tr>
         <th colspan=${12 + cols}>${printerLabel}</th>
       </tr>
       <tr>

          <th class="inline" colspan=${5 + cols}>
           <span class="label">رمز العميل : </span>
           <span class="result">${bill.personCode ? bill.personCode : ''}</span>

         </th>
         <th class="inline" colspan="7">
         <span class="label">رقم الفاتورة : </span>
         <span class="result">${bill.receiptCode ? bill.receiptCode : ''}</span>

       </th>
       </tr>
       <tr>
          <th class="inline" colspan=${5 + cols}>
           <span class="label"> العميل : </span>
           <span class="result">${bill.personName ? bill.personName : ''}</span>

         </th>
         <th class="inline" colspan="7">
         <span class="label">التاريخ  : </span>
         <span class="result">${bill.date ? bill.date.toLocaleDateString(
                "ar-EG",
                dateOptions
            ) : ''}</span>
       </th>
       </tr>
       <tr>
       <th class="inline" colspan=${5 + cols}>
        ${this.isVatEnable ? `<span class="label">الرقم الضريبي العميل : </span>
       <span class="result">${
                    bill["vatNumber"] ? bill["vatNumber"] : ""
                    }</span>` : ""}
       

     </th>
         <th class="inline" colspan="7">
           <span class="label"> السداد : </span>
           <span class="result">${bill['isDebt'] ? "آجل" : "نقداً"}</span>
         </th>

           <tr>
         <th class="inline" colspan=${12 + cols}>
                   <span class="label"> عنوان العميل: </span>
           <span class="result">${
                bill["address"] ? bill["address"] : ""
                }</span>
             </th>
       </tr>
       </tr>
       <tr>
       <th class="title-data"  colspan="1">
           <p>الرمز</p>
           <p>Code</p>
       </th>
       <th class="title-data"  colspan="4">
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
       <th class="title-data"  colspan="1">
       <p>السعر</p>
       <p>Price</p>
       </th>
       ${this.isDiscountExist ? `<th class="title-data"  colspan="1">
       <p>الخصم</p>
       <p>Dis</p>
       </th>`: ""}
        ${this.isVatEnable ? `<th class="title-data" colspan="1">
        <p>الإجمالي قبل الضريبة</p>
        </th>
        <th class="title-data"  colspan="1">
        <p>الضريبة</p>
        </th>` : ""}
        
        <th class="title-data"  colspan="${this.isVatEnable ? `1` : `3`}">
        <p>${this.isVatEnable ? `الإجمالي بعد الضريبة` : `الإجمالي`}</p>
        </th>

       </tr>

${this.populateData(bill, seriable)}

<tr>
${this.isDiscountExist ? `<th colspan=${(this.isVatEnable ? 9 : 10) + cols} class="inline">
<span class="">الاجمالي : </span>
</th>`: `<th colspan=${(this.isVatEnable ? 8 : 9) + cols} class="inline">
<span class="">الاجمالي : </span>
</th>`}


${this.isVatEnable ? `
<th colspan="1" class="title-data">
<span class="">${+bill['itemTotalWithoutVat'].toFixed(2)}</span>
    
  </th>
<th colspan="1" class="title-data">
<span class="">${+bill['totalVat'].toFixed(2)}</span>
    
  </th>` : ``}


    <th colspan="${this.isVatEnable ? `1` : `3`}" class="title-data">
    <span class="">${+bill['serviceTotalWithVat'].toFixed(2)}</span>
  </th>
</tr>
      <tr>
      ${this.isDiscountExist ? `<th colspan=${10 + cols} rowspan="2" class="inline notes">
      <span class="title-note">الملاحظات  </span>
      <p class="note-body">${bill['notes']}</p>
    </th>`: `      <th colspan=${9 + cols} rowspan="2" class="inline notes">
    <span class="title-note">الملاحظات  </span>
    <p class="note-body">${bill['notes']}</p>
  </th>`}

      <th colspan="1" class="inline">
      <span class="">الخصم  </span>
    </th>
       <th colspan="1" class="inline">
           <span class=""> ${bill['discount']}</span>
         </th>
       </tr>
       <tr>
            </th>
            <th colspan="1" class="inline">
            <span class="">المطلوب</span>
          </th>
           <th colspan="1" class="inline">
           <span class="">${bill.totalAfterDiscount ? +(bill['serviceTotalWithVat'] - bill['discount']).toFixed(2) : ''}</span>
         </th>    </th>

       </tr>
     </table>
     ${this.isVatEnable ? ` <div>
            نسبة ضريبة القيمة المضافة ${this.vatPercentage * 100}%
        </div>`: ""}
     <footer>
      <table style="width:100%; border: none;">
	<tr style="border: none;">
		<td style="border: none;"><span>توقيع العميل</span></td>
		<td style="border: none;">الختم</td>
		<td style="border: none;">توقيع الموظف</td>
	</tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	<tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	</tr>
	<tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	</tr>
	<tr>
		<td style="border: none;">............</td>
		<td style="border: none;">............</td>
		<td style="border: none;">............</td>
	</tr>
</table>
     </footer>
     <div class="footer">
     <p style="font-size: 16px;">

${options.footer}
     </p>
   </div>
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
       ${this.isVatEnable ? `
          <tr style="border:none">
            <td style="border:none; vertical-align: top;" colspan="1">
              <div>
                  نسبة ضريبة القيمة المضافة ${this.vatPercentage * 100}%
              </div>
            </td>
            <td style="border:none;text-align: left;" colspan="20">
            <canvas id="qrcode-canvas"  background-color:#E8E8E8"></canvas>
            </td>
        </tr> `: ""}
     </table>

     <footer>
       <!--table style="width:100%; border: none;">
	<tr style="border: none;">
		<td style="border: none;"><span>توقيع العميل</span></td>
		<td style="border: none;">الختم</td>
		<td style="border: none;">توقيع الموظف</td>
	</tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	<tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	</tr>
	<tr>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
		<td style="border: none;">&nbsp;</td>
	</tr>
	<tr>
		<td style="border: none;">............</td>
		<td style="border: none;">............</td>
		<td style="border: none;">............</td>
	</tr>
</table-->
     </footer>
     <div class="footer">
     <p>

${options.footer}
     </p>
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
  <p> هذا النظام مستخرج من انظمة حلول الغد - 920012635 - 0550535715 </p>
     </html>
       `;
        }
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
      let totalWithVat = bill.totalAfterDiscount ? +(bill['serviceTotalWithVat'] - bill['discount']).toFixed(2) : ''
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
        `;
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
              <td colspan="${!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`}">${a.nameAr}</td>
              <td>${a.itemUnitName}</td>
              <td>${a.quantity}</td>
              <td>${a.serialNo}</td>
              <td>${a.price} </td>
              ${this.isDiscountExist ? `<td>${a.discount} </td>` : ""}
               ${this.isVatEnable ? `
              <td>${((a.price * (a.quantity ? a.quantity : 1) - a.discount)).toFixed(2)} </td>
              ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo:0} </td>` : ""}           
              <td>${+a.actualVat.toFixed(2)} </td>
              ` : `  ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo:0} </td>` : ""}        `}
              
          <td colspan=${this.isVatEnable ? `1` : `3`}>${+a.totalPrice.toFixed(2)} </td>
            </tr>
              `;
          } else {
              return `
          <tr>
          <td>${a.code}</td>
          <td colspan="${!this.isVatEnable&&this.isDiscountExist&&!this.isTobaccoExist?`3`:`4`}">${a.nameAr}</td>
          <td>${a.itemUnitName}</td>
          <td>${a.quantity}</td>
          <td>${a.price}</td>
          ${this.isDiscountExist ? `<td>${a.discount} </td>` : ""}
          ${this.isVatEnable ? `
          <td>${((a.price * (a.quantity ? a.quantity : 1) - a.discount)).toFixed(2)} </td>
          ${this.isTobaccoExist  ? `<td >${(a.actualVatTwo?a.actualVatTwo:0)} </td>` : ""}  
          <td>${+a.actualVat.toFixed(2)} </td>
              ` : `  ${this.isTobaccoExist ? `<td >${a.actualVatTwo?a.actualVatTwo:0} </td>` : ""}        `}
          
          <td colspan=${this.isVatEnable ? `1` : `3`}>${+a.totalPrice.toFixed(2)} </td>
        </tr>
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
    allDiscount(bill): number {
      let discount = 0;
      const dataArray = [...bill['billService'], ...bill.billItems];
      dataArray.forEach(x => {
          discount += +x.discount
      });
      return discount;

  }

}
