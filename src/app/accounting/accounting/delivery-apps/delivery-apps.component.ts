
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { AppTranslationService } from '../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import Page from '../../definitions/models/page.model';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { AccountingService } from '../services/accounting.service';
import { AddDeliveryAppComponent } from './add-delivery-app/add-delivery-app.component';


@Component({
  selector: 'app-delivery-apps',
  templateUrl: './delivery-apps.component.html',
  styleUrls: ['./delivery-apps.component.css']
})
export class DeliveryAppsComponent implements OnInit {

  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("dateTemplate")
  dateTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
  actionsTemplate: TemplateRef<any>;

  @ViewChild("viewApp")
  viewApp: AddDeliveryAppComponent;
  @ViewChild("editorModal")
  editorModal: ModalDirective;


  rows: any[] = [];
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

  constructor(
   private accountingService:AccountingService,
    private translationService: AppTranslationService,
    private changeDetect:ChangeDetectorRef,
    public checkPermissionsService:CheckPermissionsService) { }

  ngOnInit() {
    this.initializeCoulmnsHeaders();
    this.loadData();
  }
  onSearchChanged(value: string) {
    this.searchQuery = value;
    this.page.offset = 0;
    this.loadData();
  }

  setPage(pageInfo) {
    console.log(pageInfo)
    this.page.offset = pageInfo.offset;
    this.loadData();
  }
  
  filterData(filterData) {
    this.page.offset = 0;
    this.selectedBranch = filterData.selectedBranch;
    this.selectCC = filterData.selectedCC;
    this.FilterData=filterData
    console.log(filterData)
    this.loadData();
  }
  loadData() {
    this.accountingService.getAllDeliveryApps(this.searchQuery,this.FilterData.serachModel.from,this.FilterData.serachModel.to,this.page.offset+1,this.page.size).subscribe(res =>{
      
      this.rows=res.content
      this.rows.forEach((e,index)=>{
        e.index=index+1
      })
      this.page.count=res.totalCount
      //this.changeDetect.detectChanges()
      console.log(this.rows)
    })
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
        { prop: "name", name: this.gT("shared.name"), width: 75 },
        { prop: "initialBalance", name: this.gT("shared.initialBalance") , width: 75},
      
      ]
     
   
   
    this.columns.push({
      name: "",
      width: 200,
      cellTemplate: this.actionsTemplate,
      resizeable: false,
      canAutoResize: false,
      sortable: false,
      draggable: false
  });
   
  }
  info(row){
    
  this.viewApp.view(row)
  this.editorModal.show();

  }
  ngAfterViewInit() {
    this.viewApp.changesSavedCallback = () => {
       this.loadData();
         //this.addNewBranchToList();
         this.editorModal.hide();
        
     };
 
     this.viewApp.changesCancelledCallback = () => {
       this.loadData();
         this.editorModal.hide();
     }; 
}
formatDate(date: Date) {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}
newApp(){
this.viewApp.new()

this.editorModal.show();
}
}

