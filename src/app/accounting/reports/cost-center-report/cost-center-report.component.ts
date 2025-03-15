import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { TranslateService } from '@ngx-translate/core';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ExportExcelService } from '../../shared/services/export-excel.service';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'app-cost-center-report',
  templateUrl: './cost-center-report.component.html',
  styleUrls: ['./cost-center-report.component.css']
})
export class CostCenterReportComponent implements OnInit {
  gT = (key: string) => this.translationService.getTranslation(key);
  columns1=[]
  columns2=[]
  columns3=[]
  row1=[]
  row2=[]
  row3=[]
  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("dateTemplate")
  dateTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
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
            cellTemplate: this.indexTemplate,
            canAutoResize: false
        },
        { prop: "name", name: this.gT("shared.name"), width: 80, },
        {
            prop: "amount",
            name: this.gT("shared.Value_transferred_to_the_branch"),
            
            width: 80,
    
        },
        {
            prop: "quantity",
            name: this.gT("shared.quantity_transferred_to_the_branch"),
           
            width: 80,
        },
       
        
    
    ];
    this.columns2 = [
      {
          prop: "index",
          name: "#",
          width: 40,
          cellTemplate: this.indexTemplate,
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
  this.columns3 = [
    {
        prop: "index",
        name: "#",
        width: 40,
        cellTemplate: this.indexTemplate,
        canAutoResize: false
    },
    { prop: "itemName", name: this.gT("shared.itemName"), width: 80, },
    {
        prop: "name",
        name: this.gT("shared.name"),
        
        width: 80,

    },
    { prop: "nameEn", name: this.gT("shared.nameEn"), width: 80, },
    {
        prop: "net",
        name: this.gT("shared.net"),
        
        width: 80,

    },
    {
        prop: "out",
        name: this.gT("shared.outcome"),
       
        width: 80,
    },
    {
      prop: "transferAmount",
      name: this.gT("shared.transferAmount"),
     
      width: 80,
  },
  {
    prop: "unitName",
    name: this.gT("shared.itemUnit"),
   
    width: 80,
},
   
    

];
  }
  filter(filterData) {
    this.filterData=filterData
  
    this.loadData();
}
loadData(){
  this.costCenterService.getCostCenterReports(this.filterData.serachModel.from,this.filterData.serachModel.to,this.filterData.selectedBranch,this.filterData.selectedCC).subscribe(res =>{
    this.row1=res.abstractCostCenterReport
    this.row1.map(val =>val.name=this.gT('mainMenu.'+val.name))
    this.row2=res.expensesReport
    this.row3=res.storageReport
    this.row3.map(val=>val.key=this.gT('shared.'+val.key))
    this.showExcelButton=true
    console.log(this.row1,this.row3)
    

})
}
getAllDataToExport() {
  return this.costCenterService
    .getCostCenterReports(this.filterData.serachModel.from,this.filterData.serachModel.to,this.filterData.selectedBranch, this.filterData.selectedCC)
    .toPromise()
}

async exportAsXLSX() {
  let filters=0
  let exportedRows = []
  let row1=[]
  let row2=[]
  let row3=[]
  row1=row1.concat(this.row1)
  row2=row2.concat(this.row2)
 row3=JSON.parse(JSON.stringify(this.row3));
  this.loadingIndicator = true;
  exportedRows = await this.getAllDataToExport();
  console.log(exportedRows)
  if (!exportedRows) {
    exportedRows = [];
  }
  let e=[]
   if(this.filterData.serachModel.from&&this.filterData.serachModel.to){
       e.push({
           index:this.filterData.serachModel.from , //this.formatDate(this.filterData.serachModel.from),
           
           amount: this.gT("shared.from"),
       },
       {   index:this.filterData.serachModel.to,
           

        amount: this.gT("shared.to"),
           })
           filters++
           filters++
   }
   if(this.filterData.selectedBranch){
       e.push({  
           index: this.filterData.branchName,
           amount:this.gT("shared.branch"),
          
        })
 filters++          
   }
    if(this.filterData.selectedCC){
       e.push({  
           index:  this.filterData.costCenterName,
           amount:this.gT("shared.costCenter"),
          
        })
    filters++  
    }
   e.push({  
           index:  row3[0].itemUnitDetails[0].itemNameAr,
           amount:this.gT("shared.itemName"),
          
        })
    filters++  
    e.push({  
      index:  row3[0].itemUnitDetails[0].unitNameAr,
      amount:this.gT("shared.itemUnitName"),
     
   })
filters++  

    /*

    e.push({  
      name:  row3[0].itemUnitDetails.itemName,
      amount:this.gT("shared.itemName"),
     
   })
filters++  
e.push({  
  name:   row3[0].itemUnitDetails.unitName,
  amount:this.gT("shared.UnitName"),
 
})
filters++  
    */
e.push({},{},{},{},{quantity:'شجرة المصروفات'},{   index:  '',
       

name:this.gT("shared.title"),

amount:this.gT("shared.amount"),

quantity:  this.gT("shared.quantity"),
    

  
nameEn: "",

 
})
row2.map(v =>{v.name=v.expenseNameAr})

exportedRows=e.concat(this.row2)
exportedRows.push({},{},{},{quantity:'المخزون'},{   index:  '',
       

name:this.gT("shared.title"),

amount:this.gT("shared.outcome"),

quantity:  this.gT("shared.income"),
    

  
nameEn: this.gT("shared.net"),

 
})
row3.map(v =>{v.quantity=v.in,v.amount=v.out,v.nameEn=v.net,v.name=v.key})
exportedRows=exportedRows.concat(row3)
exportedRows.push({},{},{},{quantity:'ملخص تقرير مركز التكلفة'},{   index:  '',
       

name:this.gT("shared.name"),

amount:  this.gT("shared.amount"),
    

  
quantity: this.gT("shared.quantity"),
  

 
})
exportedRows=exportedRows.concat(row1)
  this.loadingIndicator = false;
  console.log(exportedRows)
  this.exportExcelService.ExportExcel(exportedRows, this.headers, 'ملخص مركز التكلفة',filters,4,exportedRows);
}
  formatDate(from: Date) {
    throw new Error('Method not implemented.');
  }

initializeCoulmnsHeaders() {
 
  this.headers = {
    id: {
      title: "",
      order: 0,
      excel_cell_header: "",
      isVis: true
    },
    index: {
      title: '',
      order: 1,
      excel_cell_header: "A1",
      isVis: true
    },
    name: {
      title: '',
      order: 2,
      excel_cell_header: "B1",
      isVis: true
    },
    quantity: {
      title: '',
      order: 3,
      excel_cell_header: "C1",
      isVis: true
    },
    amount: {
      title: '',
      order: 4,
      excel_cell_header: "D1",
      isVis: true
    },
    nameEn: {
      title: '',
      order: 5,
      excel_cell_header: "E1",
      isVis: true
    },
    key: {

      isVis: false
    },
    unitName: {
   
      isVis: false
    },
    flag:{
      isVis:false
    },
    itemUnitDetails:{
      isVis:false
    },
    in: {
      isVis: false
    },
    out: {
      isVis: false
    },
    transferAmount: {
      isVis: false
    },
    net: {
      isVis: false
    },
   
    
    
   
    itemName: {
      isVis: false
    },
    itemUnitId: {
      isVis: false
    },
    branchId: {
      isVis: false
    },
    branch: {
      isVis: false
    },
    costCenterId: {
      isVis: false
    },
    costCenter: {
      isVis: false
    },
    item: {
      isVis: false
    },
    itemUnitsQuantity: {
      isVis: false
    },
    notes: {
      isVis: false
    },
    expenseNameAr:{
      isVis: false
    },
    expenseNameEn:{
      isVis: false
    },
    unitNameAr:{
      isVis: false
    },
    unitNameEn:{
      isVis: false
    },
    itemNameAr:{
      isVis: false
    }
    ,
    ccNameAr:{
      isVis: false
    }
    ,
    ccNameEn:{
      isVis: false
    }
    ,
    itemNameEn:{
      isVis: false
    }
  }

}


// getTranslate(key:string){
//   switch (key){
//   "Initial-Quantity":""
//   "Initial-Value":""
//   "Purch-Quantity":""
//   "Purch-Value":""
//   "Production-Quantity":""
//   "Production-Value":""
//   "Sale-Quantity":""
//  "Sale-Value":""
//   "Transfer-Quantity":""
//   "Transfer-Value":""
//   "Total-Quantity":""
//   "Total-Value":""

//   }
// 

}
