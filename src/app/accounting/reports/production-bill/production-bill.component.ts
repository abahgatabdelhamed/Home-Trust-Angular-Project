import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppTranslationService } from "../../../services/app-translation.service";
import { map } from "rxjs/operators";
import Page from '../../shared/models/page.model';
import { ProductionBill, ProductionBillItem } from '../../purch/models/production-bill.model';
import { Pagination } from '../../shared/models/pagination.model';
import { environment } from '../../../../environments/environment';
import { ProductionService } from '../../purch/services/production.service';
import { ExportExcelService } from '../../shared/services/export-excel.service';
import { Branch } from '../../definitions/models/branch.model';
import { FilterData } from '../../shared/models/branch-cc-filter.model';

@Component({
  selector: 'app-production-bill',
  templateUrl: './production-bill.component.html',
  styleUrls: ['./production-bill.component.css']
})
export class ProductionBillComponent implements OnInit {
  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("dateTemplate")
  dateTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
  actionsTemplate: TemplateRef<any>;

  rows: ProductionBill[] = [];
  columns: any[] = [];
  gT = (key: string) => this.translationService.getTranslation(key);

  headers: any = {};
  excelLabel: string = "Production-Bills";
  selectedBranch: number = null;
  selectCC: number = null;
  selectedExpensesId: number = null;
  searchQuery: string = '';
  page = new Page(environment.pagination.size, environment.pagination.offset);
  loadingIndicator: boolean;
  searchmodel={
    from:null,
    tp:null
  }
  FilterData: FilterData = {
    selectedBillType: 'SALE',
    selectedBranch: null,
    selectedCC: null,
    selectedExpensesId: null,
    serachModel :{
        from:null,
        to:null
    }
};
view=false
  constructor(private productionService: ProductionService,
    private exportExcelService: ExportExcelService,
    private translationService: AppTranslationService,) { }

  ngOnInit() {
    this.initializeCoulmnsHeaders();
  //  this.loadData();
  }

  loadData() {
    this.loadingIndicator = true;
    console.log(this.FilterData.serachModel)
    this.productionService.getAllItems(this.FilterData.serachModel,this.searchQuery, this.selectedBranch,
      this.selectCC, this.page.size, this.page.offset + 1).pipe(map(res => {
        res.content = res.content.map((val, idx) => {
          val.index = idx + 1;
          val.branchName = val.branch? val.branch.name: '';
          val.costCenterName = val.costCenter? val.costCenter.nameAr: '';
          val.itemName = val.item? val.item.nameAr: '';
          val.itemUnitName = val.itemUnitsQuantity? val.itemUnitsQuantity.itemUnitName:'';
          val.quantity = val.itemUnitsQuantity? val.itemUnitsQuantity.quantity : null;
          return val;
        })
        return res;
      }
      )).subscribe(
        (data: Pagination<ProductionBill>) => {
          this.view=true
          this.rows = data.content;
          this.page.count = data.totalCount;
          this.loadingIndicator = false;

        }, (error: any) => { this.loadingIndicator = false; }
      )
  }



  

  filterData(filterData) {
    this.page.offset = 0;
    this.selectedBranch = filterData.selectedBranch;
    this.selectCC = filterData.selectedCC;
    this.FilterData=filterData
    console.log( this.FilterData,filterData)
    this.loadData();
  }

  onSearchChanged(value: string) {
    this.searchQuery = value;
    this.page.offset = 0;
    this.loadData();
  }

  setPage(pageInfo) {
    this.page.offset = pageInfo.offset;
    this.loadData();
  }

  getAllDataToExport() {
    return this.productionService
      .getAllItems(this.FilterData.serachModel,'', this.selectedBranch, this.selectCC, -1, -1)
      .toPromise().then(st => st.content.map((val, idx) => {
            val.index = idx + 1;
            val.branchName = val.branch? val.branch.name: '';
            val.costCenterName = val.costCenter? val.costCenter.nameAr: '';
            val.itemName = val.item? val.item.nameAr: '';
            val.itemUnitName = val.itemUnitsQuantity? val.itemUnitsQuantity.itemUnitName:'';
            val.quantity = val.itemUnitsQuantity? val.itemUnitsQuantity.quantity : null;
            return val;
          }
      ));
  }

  async exportAsXLSX() {
    let filters=0
    let exportedRows = []
    this.loadingIndicator = true;
    exportedRows = await this.getAllDataToExport();
    if (!exportedRows) {
      exportedRows = [];
    }
    let e=[]
     if(this.FilterData.serachModel.from&&this.FilterData.serachModel.to){
         e.push({
             index:  this.formatDate(this.FilterData.serachModel.from),
             
             itemName: this.gT("shared.from"),
         },
         {   index:this.formatDate(this.FilterData.serachModel.to),
             
 
          itemName: this.gT("shared.to"),
             })
             filters++
             filters++
     }
     if(this.FilterData.selectedBranch){
         e.push({  
             index: this.FilterData.branchName,
             itemName:this.gT("shared.branch"),
            
          })
   filters++          
     }
      if(this.FilterData.selectedCC){
         e.push({  
             index:  this.FilterData.costCenterName,
             itemName:this.gT("shared.costCenter"),
            
          })
      filters++  
      }
      e.push({},{   index:  this.gT("shared.Index"),
         

      receiptCode:this.gT("shared.code"),
    
      branchName:  this.gT("shared.branch"),
          
      
        
      costCenterName: this.gT("shared.costCenter"),
        
      itemName:  this.gT("shared.item"),
       
      quantity: this.gT("shared.quantity"),
       
      itemUnitName:this.gT("shared.itemUnitName"),
       
      date:   this.gT("shared.date"),
       
      notes:this.gT("shared.notes")
   })
  exportedRows=e.concat(exportedRows)
   
    this.loadingIndicator = false;
    console.log(exportedRows)
    this.exportExcelService.ExportExcel(exportedRows, this.headers, this.excelLabel,filters,7);
  }

  initializeCoulmnsHeaders() {
    this.columns = [
      {
        prop: "index",
        name: "#",
        width: 60,
        cellTemplate: this.indexTemplate,
        canAutoResize: false
      },
      { prop: "receiptCode", name: this.gT("shared.code"), width: 75 },
      { prop: "branch.name", name: this.gT("shared.branch") , width: 75},
      { prop: "costCenter.nameAr", name: this.gT("shared.costCenter") , width: 75},
      { prop: "item.nameAr", name: this.gT("shared.item") },
      { prop: "itemUnitsQuantity.itemUnitName", name: this.gT("shared.itemUnitName") , width: 75},
      { prop: "itemUnitsQuantity.quantity", name: this.gT("shared.quantity") , width: 75},
      { prop: "date", name: this.gT("shared.date"), cellTemplate: this.dateTemplate , width: 75}

    ]

    this.columns.push({
      name: "",
      width: 100,
      cellTemplate: this.actionsTemplate,
      resizeable: false,
      canAutoResize: false,
      sortable: false,
      draggable: false
    });

    this.headers = {
      id: {
        title: "",
        order: 0,
        excel_cell_header: "",
        isVis: false
      },
      index: {
        title: '',
        order: 1,
        excel_cell_header: "A1",
        isVis: true
      },
      receiptCode: {
        title: '',
        order: 2,
        excel_cell_header: "B1",
        isVis: true
      },
      branchName: {
        title: '',
        order: 3,
        excel_cell_header: "C1",
        isVis: true
      },
      costCenterName: {
        title: '',
        order: 4,
        excel_cell_header: "D1",
        isVis: true
      },
      itemName: {
        title: '',
        order: 5,
        excel_cell_header: "E1",
        isVis: true
      },
      date: {
        title: '',
        order: 6,
        excel_cell_header: "F1",
        isVis: true
      },
      itemUnitName: {
        title: '',
        order: 7,
        excel_cell_header: "G1",
        isVis: true
      },
      
      quantity: {
        title: '',
        order: 8,
        excel_cell_header: "H1",
        isVis: true
      },
      notes: {
        title: '',
        order: 8,
        excel_cell_header: "I1",
        isVis: true
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
      

    }
  }
  formatDate(date: Date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}
}
