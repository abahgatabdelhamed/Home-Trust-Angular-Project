import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { ExportExcelService } from '../../shared/services/export-excel.service';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'app-cost-center-production-report',
  templateUrl: './cost-center-production-report.component.html',
  styleUrls: ['./cost-center-production-report.component.css']
})
export class CostCenterProductionReportComponent implements OnInit {
  gT = (key: string) => this.translationService.getTranslation(key);
  columns1=[]
  row1=[]
  actionsTemplate: TemplateRef<any>;
    rows: any[];
    isLoading = false;
    serachModel: any = {
        from: new Date().toLocaleDateString(),
        to: new Date().toLocaleDateString()
    };
    filterData: FilterData = {
        selectedBillType: 'SALE',
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel:{from:null,to:null}
    };
    loadingIndicator=false
    isVatSummary: boolean = false;
    isPurch: boolean = false;
    isReciept: boolean = false;
    isRecieptBills = false;
    isProfit: boolean = true;
    isCC:boolean=true;
    isBranch:boolean=false
    showExcelButton=false
  headers:any// { id: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; index: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; receiptCode: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; branchName: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; costCenterName: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; itemName: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; date: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; itemUnitName: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; quantity: { title: string; order: number; excel_cell_header: string; isVis: boolean; }; branchId: { isVis: boolean; }; branch: { isVis: boolean; }; costCenterId: { isVis: boolean; }; costCenter: { isVis: boolean; }; item: { isVis: boolean; }; itemUnitsQuantity: { isVis: boolean; }; notes: { isVis: boolean; }; };
  constructor(private costCenterService:ReportsService,
    private translationService:AppTranslationService,
    private exportExcelService:ExportExcelService,
    public config:ConfigurationService
    ) { }

  ngOnInit() {
    this.initializeCoulmnsHeaders()
   //this.loadData()
      this.columns1 = [
        {
            prop: "index",
            name: "#",
            width: 40,
           
            canAutoResize: false
        },
        { prop: "name", name: this.gT("shared.name"), width: 80, },
        {
            prop: "amount",
            name: this.gT("shared.amount"),
            
            width: 80,
    
        },
        {
            prop: "quantity",
            name: this.gT("shared.quantity"),
           
            width: 80,
        },
       
        
    
    ];
  }
  filter(filterData) {
    this.filterData=filterData
  
    this.loadData();
}
loadData(){
  this.costCenterService.getCostCenterProdReports(this.filterData.serachModel.from,this.filterData.serachModel.to,this.filterData.selectedBranch).subscribe(res =>{
    this.row1=res.ccProductionReportLines
    this.showExcelButton=true
    let tottalProd=0,totalNet=0,totalSaled=0
    this.row1.forEach(e=>{
     tottalProd+=e.productionQuantity
     totalSaled+=e.saledQunatity
     totalNet+=e.netQuantity
    })
    this.row1.push({ccNameAr:this.gT('shared.totals'),nameEn:'',productionQuantity:tottalProd,saledQunatity:totalSaled,netQuantity:totalNet})

})
}
getAllDataToExport() {
  return this.costCenterService
    .getCostCenterProdReports(this.filterData.serachModel.from,this.filterData.serachModel.to,this.filterData.selectedBranch)
    .toPromise()
}

async exportAsXLSX() {
  let filters=0
  let exportedRows = []
 
 
  this.loadingIndicator = true;
  exportedRows = await this.getAllDataToExport();
  console.log(exportedRows)
  if (!exportedRows) {
    exportedRows = [];
  }
  let e=[]
   if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
       e.push({
        ccId:this.filterData.serachModel.from , //this.formatDate(this.filterData.serachModel.from),
           
        productionQuantity: this.gT("shared.from"),
       },
       {   ccId:this.filterData.serachModel.to,
           

        productionQuantity: this.gT("shared.to"),
           })
           filters++
           filters++
   }
   if(this.filterData.selectedBranch){
       e.push({  
        ccId: this.filterData.branchName,
        productionQuantity:this.gT("shared.branch"),
          
        })
 filters++          
   }
    if(this.filterData.selectedCC){
       e.push({  
        ccId:  this.filterData.costCenterName,
        productionQuantity:this.gT("shared.costCenter"),
          
        })
    filters++  
    }
   
e.push({},{
  ccId:this.gT("shared.index"),
  ccNameAr:this.gT("shared.costCenter"),
  itemNameAR:this.gT("shared.itemName"),
  itemUnitNameAr:this.gT("shared.itemUnitName"),
productionQuantity:  this.gT("shared.productionQuantity"),
saledQunatity:  this.gT("shared.saledQuantity"),
netQuantity:  this.gT("shared.netQuantity"),

  

  

 
})

exportedRows=e.concat(this.row1)
  this.loadingIndicator = false;
  console.log(exportedRows)
  this.exportExcelService.ExportExcel(exportedRows, this.headers, 'ملخص الانتاج  لمركز التكلفة',filters,6);
}
  formatDate(from: Date) {
    throw new Error('Method not implemented.');
  }

initializeCoulmnsHeaders() {
 
  this.headers = {
    index: {
      
      isVis: false
    },
    ccId: {
      title: "",
      order: 1,
      excel_cell_header: "A1",
      isVis: true
    },
    
   
    ccNameAr:{
      title: '',
      order: 2,
      excel_cell_header: "B1",
      isVis: true
    },
    // itemNameAr:{
    //   title: '',
    //   order: 3,
    //   excel_cell_header: "C1",
    //   isVis: true
    // },
    itemNameAR:{
      title: '',
      order: 3,
      excel_cell_header: "C1",
      isVis: true
    },
    itemUnitNameAr:{
        title: '',
        order: 4,
        excel_cell_header: "D1",
        isVis: true
      },
    productionQuantity: {
      title: '',
      order: 5,
      excel_cell_header: "E1",
      isVis: true
    },
    saledQunatity: {
      title: '',
      order: 6,
      excel_cell_header: "F1",
      isVis: true
    },
    netQuantity: {
      title: '',
      order: 7,
      excel_cell_header: "G1",
      isVis: true
    },
    
    itemNameEn: {
     
      isVis: false
    },
   
    itemUnitNameEn:{
      isVis: false
    },
    nameAR: {
      
      isVis: false
    },
    nameEn: {
      
      isVis: false
    },
    ccNameEn:{
      
      isVis: false
    },
    transferAmount:{
      
      isVis: false
    },
    details:{
     
      isVis: false
    },
    itemUnitBranchId:{
      isVis:false
    }
  }

}



}
function ViewChild(arg0: string): (target: CostCenterProductionReportComponent, propertyKey: "indexTemplate") => void {
  throw new Error('Function not implemented.');
}

