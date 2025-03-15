import { Component, OnInit } from '@angular/core';
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';
import { AppTranslationService } from '../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { SaleBillNet, SaleBillSummary } from '../../sales/models/sale-bill-summary';
import { SBillService } from '../../sales/services/sbill.service';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { ExportExcelService } from '../../shared/services/export-excel.service';

import { ReportsService } from '../services/reports.service';
import { TobaccoAbstractService } from '../services/tobacco-abstruct.print.service';
import { VatReportService } from '../services/vat-report.service';

@Component({
  selector: 'app-tobacco-report',
  templateUrl: './tobacco-report.component.html',
  styleUrls: ['./tobacco-report.component.css']
})
export class TobaccoReportComponent implements OnInit {
 // filterData: any;
 NetResult: SaleBillNet = new SaleBillNet();
 view:boolean=false
 gT = (key: string) => this.translationService.getTranslation(key);
 headers:any 
  filterData: FilterData = {
    selectedBillType: '',
    selectedBranch: null,
    selectedCC: null,
    selectedExpensesId: null,
    serachModel:{from:null,to:null}
};
  exportedItems:any[]// { eBank: any; eDept: any; eCash: any;etobacco:any; eNetwork: any; evat: any; ewithoutVat: any; ewithVat: any; label: any; }[];
  constructor(private TobaccoService:VatReportService,
    public checkPermissions:CheckPermissionsService,
    private excelService: ExportExcelService,
    private translationService:AppTranslationService,
    private printService :TobaccoAbstractService,
    private sbillService: SBillService ) { }
  billSummary: SaleBillSummary = new SaleBillSummary();
  CCPermissions:boolean=false
  ngOnInit() {
    this.Initialize()
    this.CCPermissions=this.checkPermissions.checkGroup(6,11)
  }
  loadData(){
   //this.TobaccoService.getAbstractTobaco(this.filterData.serachModel,null,null).subscribe(items =>{
    this.sbillService.getSalesBillSummary(this.filterData.serachModel,this.filterData.selectedBranch,this.filterData.selectedCC,this.filterData.userSelected)
    .subscribe(items =>{
        
      
   this.billSummary=items
   let exportedRefunds
   let exportedSales
   items.stotal = +items.sDept + +items.sBank + +items.sCash + +items.sNetwork 
   items.rtotal = +items.rDept + +items.rBank + +items.rCash + +items.rNetwork;
   items.rtotalWithVat = +items.rtotal + +items.rVat+items.rTobaccoVat;
   items.stotalWithVat = items.stotal + items.sVat +items.sTobaccoVat;

   this.NetResult.nbank = items.sBank - items.rBank;
   this.NetResult.ndebt = items.sDept - items.rDept;
   this.NetResult.nnetwork = items.sNetwork - items.rNetwork;
   this.NetResult.ncash = items.sCash - items.rCash;
   this.NetResult.ntotal = items.sWithoutVAt - items.rsWithoutVAt;
   this.NetResult.ntotalWithVat = items.sWithVAt - items.rsWithVAt;
   this.NetResult.nvat = items.sVat - items.rVat;
   this.NetResult.ntobaccovat = items.sTobaccoVat - items.rTobaccoVat;
   console.log( items.sTobaccoVat ,'-', items.rTobaccoVat)
   let exportedNetResults
   let customarray:{paymentway:string,sales:any,refund:any,NetResults:any}[]=[]
   if(this.checkPermissions.checkGroup(5,17)){
     exportedRefunds = {eBank: items.rBank, eDept: items.rDept, eCash: items.rCash, eNetwork: items.rNetwork, etobacco: items.rTobaccoVat,evat: items.rVat, ewithoutVat: items.rsWithoutVAt, ewithVat: items.rsWithVAt, label:this.gT('refund')};
     exportedSales = {eBank: items.sBank, eDept: items.sDept, eCash: items.sCash, eNetwork: items.sNetwork, etobacco: items.sTobaccoVat, evat: items.sVat, ewithoutVat: items.sWithoutVAt, ewithVat: items.sWithVAt, label:this.gT('sales')};
     exportedNetResults = {eBank: this.NetResult.nbank, eDept: this.NetResult.ndebt, eCash: this.NetResult.ncash, eNetwork: this.NetResult.nnetwork,etobacco:this.NetResult.ntobaccovat, evat: this.NetResult.nvat, ewithoutVat:  items.sWithoutVAt- items.rsWithoutVAt, ewithVat: items.sWithVAt-items.rsWithVAt, label: this.gT('net')};
    
    
     customarray.push({paymentway:'بدون ضريبة',sales:items.sWithoutVAt,refund:items.rsWithoutVAt,NetResults:items.sWithoutVAt-items.rsWithoutVAt})
     customarray.push({paymentway:'ضريبة التبغ',sales:items.sTobaccoVat,refund:items.rTobaccoVat,NetResults:items.sTobaccoVat-items.rTobaccoVat})
     customarray.push({paymentway:'ضريبة القيمة المضافة',sales:items.sVat,refund:items.rVat,NetResults:items.sVat-items.rVat})
     customarray.push({paymentway:'مع ضريبة',sales:items.sWithVAt,refund:items.rsWithVAt,NetResults:items.sWithVAt-items.rsWithVAt})
     customarray.push({paymentway:'',sales:'',refund:'',NetResults:''})
     customarray.push({paymentway:'طريقة الدفع',sales:'',refund:'',NetResults:''})
     customarray.push({paymentway:'آجل',sales:items.sDept,refund:items.rDept,NetResults:items.sDept-items.rDept})
     customarray.push({paymentway:'بنك',sales:items.sBank,refund:items.rBank,NetResults:items.sBank-items.rBank})
     customarray.push({paymentway:'شبكة',sales:items.sNetwork,refund:items.rNetwork,NetResults:items.sNetwork-items.rNetwork})
     customarray.push({paymentway:'نقد',sales:items.sCash,refund:items.rCash,NetResults:items.sCash-items.rCash})
    



}else{
     exportedRefunds = {eBank: items.rBank, eDept: items.rDept, eCash: items.rCash, eNetwork: items.rNetwork,evat: items.rVat, ewithoutVat: items.rsWithoutVAt, ewithVat: items.rsWithVAt, label:this.gT('refund')};
     exportedSales = {eBank: items.sBank, eDept: items.sDept, eCash: items.sCash, eNetwork: items.sNetwork, evat: items.sVat, ewithoutVat: items.sWithoutVAt, ewithVat: items.sWithVAt, label:this.gT('sales')};
     exportedNetResults = {eBank: this.NetResult.nbank, eDept: this.NetResult.ndebt, eCash: this.NetResult.ncash, eNetwork: this.NetResult.nnetwork, evat: this.NetResult.nvat, ewithoutVat:  items.sWithoutVAt- items.rsWithoutVAt, ewithVat: items.sWithVAt-items.rsWithVAt, label: this.gT('net')};
     customarray.push({paymentway:'بدون ضريبة',sales:items.sWithoutVAt,refund:items.rsWithoutVAt,NetResults:items.sWithoutVAt-items.rsWithoutVAt})
     customarray.push({paymentway:'المضافة',sales:items.sVat,refund:items.rVat,NetResults:items.sVat-items.rVat})
     customarray.push({paymentway:'مع ضريبة',sales:items.sWithVAt,refund:items.rsWithVAt,NetResults:items.sWithVAt-items.rsWithVAt})
     customarray.push({paymentway:'',sales:'',refund:'',NetResults:''})
     customarray.push({paymentway:'طريقة الدفع',sales:'',refund:'',NetResults:''})
     customarray.push({paymentway:'آجل',sales:items.sDept,refund:items.rDept,NetResults:items.sDept-items.rDept})
     customarray.push({paymentway:'بنك',sales:items.sBank,refund:items.rBank,NetResults:items.sBank-items.rBank})
     customarray.push({paymentway:'شبكة',sales:items.sNetwork,refund:items.rNetwork,NetResults:items.sNetwork-items.rNetwork})
     customarray.push({paymentway:'نقد',sales:items.sCash,refund:items.rCash,NetResults:items.sCash-items.rCash})
    
   }
   if(this.billSummary.isThereDeliveryAppsValues){
    items.sDeliveryApps.forEach((element,index )=> {
        customarray.push({paymentway:element.name,sales:element.amount,refund:items.rDeliveryApps[index].amount,NetResults:element.amount-items.rDeliveryApps[index].amount})
    });
   }
   this.billSummary = {...items};
   this.exportedItems = customarray;
  
 // const exportedNetResults = {eBank: this.NetResult.nbank, eDept: this.NetResult.ndebt, eCash: this.NetResult.ncash, eNetwork: this.NetResult.nnetwork, etobacco: items.nTobaccoVat,evat: this.NetResult.nvat, ewithoutVat:  items.sWithoutVAt- items.rsWithoutVAt, ewithVat: items.sWithVAt-items.rsWithVAt, label: this.gT('net')};
   this.billSummary = {...items};
   //this.exportedItems = [{...exportedSales}, {...exportedRefunds}];
   console.log('excel is', this.exportedItems,exportedNetResults);
   this.view=true
      })

  }
  filter(filterData){
    console.log(filterData,this.filterData)

    this.filterData=filterData
  // console.log(filterData,this.filterData)
    this.loadData();
}
getOrderedHeadersArray() {
  let list: string[] = [];
  let counter: number = 1;
  while (true) {
      let isFounded: boolean = false;
      for (var key in this.headers) {
          if (this.headers[key].order == counter) {
              list.push(key);
              isFounded = true;
              break;
          }
      }
      if (!isFounded) {
          break;
      }
      counter++;
  }
  return list;
}
getRemovedHeadersArray() {
  let list: string[] = [];
  for (var key in this.headers) {
      if (this.headers[key].isVis == false) {
          list.push(key);
      }
  }
  return list;
}

exportAsXLSX() {
  let exportedRows: any[] = [];
 

  Object.assign(exportedRows, this.exportedItems);
  let e:{paymentway:string,sales?:any,refund:any,NetResults?:any}[]=[]
  let filters=0
  if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
      e.push({
          paymentway: this.filterData.serachModel.from.toLocaleString(),
          refund:this.gT("shared.from"),
          
      },
      {   paymentway:this.filterData.serachModel.to.toLocaleString(),
          

        refund:this.gT("shared.to"),
      
          })
          filters+=2
  }
  if(this.filterData.selectedBranch){
      console.log(this.filterData)
      e.push({  
          paymentway:  this.filterData.branchName,
          
          refund:this.gT("shared.branch"),
      
         
       })
filters++          
  }
   if(this.filterData.selectedCC){
      e.push({  
        paymentway:  this.filterData.costCenterName,
          
        refund:this.gT("shared.costCenter"),
      
         
       })
   filters++  
   }

   //  this.checkPermissions.checkGroup(5,17)?
       e.push({paymentway:'',refund:''},{   
          paymentway:  '',
            
          sales: this.gT("shared.sales"),
            
          refund:  this.gT("shared.refund"),
       
          NetResults: this.gT("shared.net"),
         
           
      
           
        
})
/*:
   
     e.push({},{   
    eCash:  this.gT("shared.cash"),
      
    eBank: this.gT("shared.bank"),
      
    eDept:  this.gT("shared.debt"),
       
    eNetwork: this.gT("shared.network"),
    ewithoutVat: this.gT("shared.withoutVat"),
    evat: this.gT("shared.Vat"),
     
   
     
    ewithVat:  this.gT("shared.withVat"),   
})
*/
   exportedRows=e.concat(exportedRows)
  
/*  let removedKeyArr: string[] = this.getRemovedHeadersArray();
  for (var removedKey of removedKeyArr) {
      for (var row of exportedRows) {
          delete row[removedKey];
      }
  }
  let orderedKeyArr: string[] = this.getOrderedHeadersArray();
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      exportedRows,
      { header: orderedKeyArr }
  );
  for (var key in this.headers) {
      if (
          this.headers[key].isVis &&
          this.headers[key].excel_cell_header != ""
      ) {
          worksheet[this.headers[key].excel_cell_header].v = this.headers[
              key
          ].title;
      }
  }
  console.error(worksheet);
  */

  this.excelService.ExportExcel(exportedRows,this.headers,'الملخص',filters,3);
}
  printDocumnent(){
    this.printService.printDocument(this.billSummary,this.NetResult,this.filterData,'الملخص','ff',true)

}
print(){
  this.printService.printDocument(this.billSummary,this.NetResult,this.filterData,'الملخص','ff',false)

}

Initialize(){
//this.checkPermissions.checkGroup(5,17)?
    this.headers= {
        paymentway: {
            title: "",
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        sales: {
            title: '',
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        refund: {
            title:'',
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        NetResults: {
            title: '',
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
      /*  eDept: {
            title: '',
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        eNetwork: {
            title: '',
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        ewithoutVat: {
            title: '',
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        etobacco: {
         title:'',
         order: 7,
         excel_cell_header: "G1",
         isVis: true
     },
        evat: {
         title:'',
         order: 8,
         excel_cell_header: "H1",
         isVis: true
     },
    
     
        ewithVat: {
            title: '',
            order: 9,
            excel_cell_header: "I1",
            isVis: true
        }
    }:this.headers= {
    id: {
        title: "",
        order: 0,
        excel_cell_header: "",
        isVis: false
    },
    label: {
        title: '',
        order: 1,
        excel_cell_header: "A1",
        isVis: true
    },
    eCash: {
        title:'',
        order: 2,
        excel_cell_header: "B1",
        isVis: true
    },
    eBank: {
        title: '',
        order: 3,
        excel_cell_header: "C1",
        isVis: true
    },
    eDept: {
        title: '',
        order: 4,
        excel_cell_header: "D1",
        isVis: true
    },
    eNetwork: {
        title: '',
        order: 5,
        excel_cell_header: "E1",
        isVis: true
    },
    ewithoutVat: {
        title: '',
        order: 6,
        excel_cell_header: "F1",
        isVis: true
    },
    evat: {
     title:'',
     order: 7,
     excel_cell_header: "G1",
     isVis: true
 },

   
    ewithVat: {
        title: '',
        order: 8,
        excel_cell_header: "H1",
        isVis: true
    },
    etobacco: {
        title:'',
        order: '',
        excel_cell_header: "",
        isVis: false
    },
*/
};
  
}
}

