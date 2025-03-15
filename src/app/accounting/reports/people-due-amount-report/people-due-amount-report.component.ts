
import { ExportExcelService } from './../../shared/services/export-excel.service';
import { ReportsEndpointService } from './../services/reports-endpoint.service';
import { ReportsService } from './../services/reports.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { catchError, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import Page from '../../definitions/models/page.model';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-people-due-amount-report',
  templateUrl: './people-due-amount-report.component.html',
  styleUrls: ['./people-due-amount-report.component.css']
})
export class PeopleDueAmountReportComponent implements OnInit {

    items$: Observable<any[]>;
    itemSearchLoading = false;
    itemsInput$ = new Subject<string>();
    selectedPeople=[]
    duAmountPeople=[]
    loadingIndicator: boolean;
    page: Page = new Page( 0, 0);
    rows;
    selectedName=''
    columns: any[] = [];
    excelLabel = 'Amount due people report'
    dataForExcel=[]
  view=false



  constructor(private ReportsService: ReportsService ,
    private ReportsEndpointService: ReportsEndpointService ,
    private translationService: AppTranslationService,
    private ExportExcelService:ExportExcelService
    ) {

  }
  gT = (key: string) => this.translationService.getTranslation(key);

  headers = {
    personId: {
        title: "",
        order: 0,
        excel_cell_header: "",
        isVis:false
    },
    index:{
        title:'',
        order: 1,
        excel_cell_header: "A1",
        isVis: true
    },
    nameAr:{
        title: '',
        order: 2,
        excel_cell_header: "B1",
        isVis: true
    },
    nameEn:{
        title: '',
        order: 3,
        excel_cell_header: "C1",
        isVis: true
    },
    mobile:{
        title: '',
        order: 4,
        excel_cell_header: "D1",
        isVis: true
    },
    totalDue:{
        title: '',
        order: 5,
        excel_cell_header: "E1",
        isVis: true
    }


};
  ngOnInit() {

   this.loadItems()
   this.rows=[]
   this.columns = [
       {
           prop: "index",
           name: this.gT("shared.index"),
           width: 30
       },
       {
           prop: "nameAr",
           name:this.gT("shared.nameAr"),
           width: 40
       },
       {
           prop: "nameEn",
           name: this.gT("shared.nameEn"),
           width: 40

       },
       {
           prop: "mobile",
           // soldQuantity
           name: this.gT("shared.mobile"),
           width:40
       },
       {
        prop: "totalDue",
        name: this.gT("shared.totalDue"),
        width: 40
    },
]

  }

  SelectedPeopleChange(e){
       console.log(this.selectedPeople);
       this.rows=[]
       
       e.forEach(element => {
        this.selectedName+=element.nameAr
       });
       this.loadItems()
  }

  private loadItems() {
    this.items$ = concat(
        of([]), // default items
        this.itemsInput$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap(term =>
                this.ReportsEndpointService
                    // .getSearchItemEndpoint(term, this.selectedBranch)
                    .getSearchPeopleEndpoint(term)
                    .pipe(
                        catchError(() => of([])), // empty list on error
                    )
            )
        )
    );
}

getAmountReport(){
    this.ReportsService.PostReportsDueAmount(this.selectedPeople).subscribe(data=>{
        console.log(data);
        data.forEach((element,index) => {
            element.index=index+1
           });
        this.rows = data
        this.view=true
    })
}

getAllAmountDueReportForExcel(){
    return this.ReportsService.PostReportsDueAmount(this.selectedPeople)
       .toPromise().then(data => {
           console.log(data);
           data.forEach((element,index) => {
            element.index=index+1
           });
            this.dataForExcel= data
            return this.dataForExcel
       });
   }

   async exportAsXLSX(){
    let filters=0
    let e=[]
     let exportedRows=[]
     this.loadingIndicator = true;
      exportedRows =await this.getAllAmountDueReportForExcel()
      console.log(" exportedRows ");
      console.log(exportedRows);
      if( this.selectedPeople){
        e.push({
            index: this.selectedName,
              
            mobile:  this.gT("shared.people"),
            })
       filters++    
       }
       
       
         e.push({},{   
            index: this.gT("shared.index"),
              
            nameAr: this.gT("shared.nameAr"),
                
            nameEn: this.gT("shared.nameEn"),
              
            mobile: this.gT("shared.mobile"),
               
            totalDue:this.gT("shared.totalDue"),
             
           
})
     exportedRows=e.concat(exportedRows)
    
       this.loadingIndicator=false;

  this.ExportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel,filters,5)



}

}
