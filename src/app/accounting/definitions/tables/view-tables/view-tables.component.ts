import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertService, DialogType } from '../../../../services/alert.service';
import { AppTranslationService } from '../../../../services/app-translation.service';
import Page from '../../models/page.model';
import { Table } from '../../models/table.model';
import { TablesService } from '../../services/table.service';
import { AddTableComponent } from '../add-table/add-table.component';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.css']
})
export class ViewTablesComponent implements OnInit {
columns
rows:Table[]=[]
page:Page = new Page(0, 0)
gT = (key: string) => this.translationService.getTranslation(key);
loadingIndicator:boolean=false
@ViewChild("actionsTemplate")
actionsTemplate: TemplateRef<any>;
@ViewChild("newTable")
newTable: AddTableComponent;

@ViewChild("editorModal")
editorModal: ModalDirective;

  index: number=0;
  exitActive: boolean;
  entryActive: boolean;
  filterData: {selectedBranch:number};

constructor(
    private table:TablesService,
    private translationService: AppTranslationService,
    private alertService: AlertService,){}
  ngOnInit() {
    this.loadingIndicator=true
    this.columns = [
      {
          prop: "index",
          name: "#",
          width: 60
      },
      {
         prop: "nameAr",
         name: this.gT("shared.nameAr"),
         width: 70
     },
      {
          prop: "nameEn",
          name: this.gT("shared.nameEn"),
          width: 70
      },
      {
          prop: "status",
          name: this.gT("shared.status"),
          width: 70
      },
      {
          prop: "capacity",
          name: this.gT("shared.capacity"),
          width: 70
      },
      
      {
          prop: "branch",
          name: this.gT("shared.branch"),
          width: 70
      }
      
  ];
   
         this.columns.push({
             name: "",
             width: 200,
             cellTemplate: this.actionsTemplate,
             resizeable: false,
             canAutoResize: false,
             sortable: false,
             draggable: false
         });
     
     
     this.loadData();
  }
loadData(){
 
 
this.table.getAllTables(this.filterData?this.filterData.selectedBranch:null).subscribe({next:(tables)=>{

  this.page.count=tables.length
  this.rows=tables
  tables.forEach(element => {
    element.status=element.status==2?'Busy/مشغولة':'Available/متاحة'
    element.branch=element.branch?element.branch.name:''
  });
  this.loadingIndicator=false
  console.log(tables,this.rows)
}})
}
setPage(pageInfo:any){
  //   console.log('page=',pageInfo,'***************')
     this.page.offset = pageInfo.offset;
     this.loadData();
     this.addTable()
  }
  addTable(){
    this.editorModal.show()
  }
  newTable1(row){
    if(row)
    this.newTable.loadTable(row)
    this.editorModal.show();
   
  }
  DeleteTable(id){
    this.table.deleteTable(id).subscribe(res =>{
      this.loadData()
    })

  }

  filter(filterData) {
    console.log(filterData)
    this.page.offset = 0;
    this.filterData=filterData
    if(filterData)
    this.loadData();
}
  Delete(row){
    
        this.alertService.showDialog(
            'هل أنت متأكد من حذف الطاولة  "' + row.nameAr + '"?',
            DialogType.confirm,
            () => this.DeleteTable(row.id)
        );
    

}
  ngAfterViewInit() {
    this.newTable.changesSavedCallback = () => {
      this.loadData();
        //this.addNewBranchToList();
        this.editorModal.hide();
       
    };

    this.newTable.changesCancelledCallback = () => {
      this.loadData();
        this.editorModal.hide();
    };
}
 
}
