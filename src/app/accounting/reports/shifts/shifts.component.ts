import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { AppTranslationService } from '../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import Page from '../../definitions/models/page.model';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { ReportsService } from '../services/reports.service';
import { ViewShiftComponent } from './view-shift/view-shift.component';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {
  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("dateTemplate")
  dateTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
  actionsTemplate: TemplateRef<any>;

  @ViewChild("viewshift")
  viewshift: ViewShiftComponent;

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
    private reportService:ReportsService,
    private translationService: AppTranslationService,
    private changeDetect:ChangeDetectorRef,
    public checkPermissionsService:CheckPermissionsService) { }

  ngOnInit() {
    this.initializeCoulmnsHeaders();
  //  this.loadData();
  }
  /*onSearchChanged(value: string) {
    this.searchQuery = value;
    this.page.offset = 0;
    this.loadData();
  }*/

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
    this.reportService.getAllShifts(this.searchQuery,this.FilterData.serachModel.from,this.FilterData.serachModel.to,this.page.offset+1,this.page.size,this.FilterData.userSelected?this.FilterData.userSelected:'',this.FilterData.selectedBranch).subscribe(res =>{
    console.log(res)
      res.content.forEach((element,index) => {
        element['index']=(index+1)+(this.page.size*this.page.offset)
        element['user']=element.user.fullName
        element['startDate']=this.formatDate( new Date(element.startDate))
        element['endDate']=! element['endDate']?'Active/واردية جارية':this.formatDate( new Date(element.endDate))
      });
      this.rows=res.content
      this.page.count=res.totalCount
      //this.changeDetect.detectChanges()
      console.log(this.rows)
    })
  }
  initializeCoulmnsHeaders() {
    
    if(this.checkPermissionsService.checkGroup(9,2)){
      this.columns = [
      
        {
          prop: "index",
          name: "#",
          width: 60,
          cellTemplate: this.indexTemplate,
          canAutoResize: false
        },
        { prop: "user", name: this.gT("shared.name"), width: 75 },
        { prop: "startDate", name: this.gT("shared.startDate") , width: 75},
        { prop: "endDate", name: this.gT("shared.closedDate") , width: 75},
        {prop:this.checkPermissionsService.checkGroup(3,11)?'deliveryAppsTotalBalance':null,name:this.checkPermissionsService.checkGroup(3,11)? this.gT("shared.deliveryApps"):null , width: 75},
        { prop: "madaSoldBalance", name: this.gT("shared.madaSoldBalance"), width: 75 },
        { prop: "cashSoldBalance", name: this.gT("shared.cashSoldBalance") , width: 75},
        { prop: "soldBalance", name: this.gT("shared.soldBalance") , width: 75},
        { prop: "branchName", name: this.gT("shared.branchName") , width: 75},
           ]
     
    }else{
      this.columns = [
      
        {
          prop: "index",
          name: "#",
          width: 60,
          cellTemplate: this.indexTemplate,
          canAutoResize: false
        },
        { prop: "user", name: this.gT("shared.name"), width: 75 },
        { prop: "startDate", name: this.gT("shared.startDate") , width: 75},
        { prop: "endDate", name: this.gT("shared.closedDate") , width: 75},
      
         ]
 
    }
   
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
    this.reportService.getReportShift(row.id).subscribe(res =>{
      res.branchName=row.branchName
      this.viewshift.view(res)
      this.editorModal.show();
    })

  }
  ngAfterViewInit() {
    this.viewshift.changesSavedCallback = () => {
     // this.loadData();
        //this.addNewBranchToList();
        this.editorModal.hide();
       
    };

    this.viewshift.changesCancelledCallback = () => {
      //this.loadData();
        this.editorModal.hide();
    };
}
formatDate(date: Date) {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() ;
}
}
