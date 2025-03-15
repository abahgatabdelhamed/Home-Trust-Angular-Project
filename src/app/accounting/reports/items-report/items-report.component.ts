import { Component, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { Item } from '../../definitions/models/item.model';
import { ItemService } from '../../definitions/services/item.service';
import { ExportExcelService } from '../../shared/services/export-excel.service';

import { ReportsEndpointService } from './../services/reports-endpoint.service';
import { ItemSearchService } from '../../shared/services/item-search.service';
import { T } from '@angular/core/src/render3';
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import Page from '../../definitions/models/page.model';
import { tap } from 'underscore';

@Component({
  selector: 'app-items-report',
  templateUrl: './items-report.component.html',
  styleUrls: ['./items-report.component.css']
})
export class ItemsReportComponent implements OnInit ,OnChanges{
  headers=[]
  excelLabel: string;
  items$: Observable<any[]>;
  itemSearchLoading = false;
  itemsInput$ = new Subject<string>();
  isService:boolean=false
  selectdItem = []
  itemName=''
  constructor(private alertService: AlertService,
    private itemService: ItemService,
    public translationService: AppTranslationService,
    private exportExcelService:ExportExcelService,
    private ReportsEndpointService: ReportsEndpointService   ) { }
  loadingIndicator: boolean;
  items:any[]=[]
  report: any;
  itemId:number
  columns=[]
  currentLanguage:string
  gT = (key: string) => this.translationService.getTranslation(key);
  ngOnInit() {
    this.Initializer()
    this.loadItems()
    this.loadData()
  
  }
  ngOnChanges(){
    this.currentLanguage=this.translationService.getCurrentLanguage()||'ar'
    console.log( this.currentLanguage)
  }
  
  loadData() {
    
    
  //  this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.itemService.getItems(1, -1).subscribe(
        items => {
            this.onDataLoadSuccessful(items.data), console.error(items);
        },
       
    );
}
SelectedItemChange(e) {
  console.log("items selected", this.selectdItem);
  console.log('event=',e)
      this.isService=e?e.isService:false
 // e.forEach(element => {
      this.itemName+=e?e.nameAr:''
 // });
 
}
 loadItems() {
  this.items$ = concat(
      of([]), // default items
      this.itemsInput$.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap(term =>
               
              this.ReportsEndpointService
                  // .getSearchItemEndpoint(term, this.selectedBranch)
                  .getSearchItemNameEndpoint(term)
                  .pipe(
                   
                      catchError(() => of([])), // empty list on error
                  )
          )
      )
  );
  }

Initializer(){
  this.headers = [{
    id: {
        title: "",
        order: 0,
        excel_cell_header: "",
        isVis: false
    },
    index: {
        title: this.gT('shared.title'),
        order: 1,
        excel_cell_header: "A1",
        isVis: true
    },

    name: {
        title:  this.gT('shared.item'),
        order: 2,
        excel_cell_header: "B1",
        isVis: true
    },
    operation: {
        title:  this.gT('shared.process'),
        order: 3,
        excel_cell_header: "C1",
        isVis: true
    },
    price: {
        title:  this.gT('shared.price'),
        order: 4,
        excel_cell_header: "D1",
        isVis: true
    },
    quantity: {
      title:  this.gT('shared.quantity'),
      order: 5,
      excel_cell_header: "E1",
      isVis: true
  },
  
  unitName: {
    title:  this.gT('shared.itemUnitName'),
    order: 6,
    excel_cell_header: "F1",
    isVis: true
},
date: {
  title:  this.gT('shared.date'),
  order: 7,
  excel_cell_header: "F1",
  isVis: true
},
  } 

  ]

}

onDataLoadSuccessful(items: Item[]) {
    console.log(items);
    this.loadingIndicator = false;
   
    this.items = items;
}

  transaction() {
    this.loadingIndicator = true;
    this.alertService.startLoadingMessage("جاري توليد التقرير...");
    this.itemService.transaction(this.itemId,this.isService).subscribe(
        result => {
            console.log(result, this.itemId);
            this.report = result;
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
        },
        error => {
       //     this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;

         /*   this.alertService.showStickyMessage(
                this.gT("messages.deleteError"),
                `An error occured whilst generating report.\r\nError: "${Utilities.getHttpResponseMessage(
                    error
                )}"`,
                MessageSeverity.error,
                error
            );*/
        }
    );
}


async exportAsXLSX() {
  

  this.loadingIndicator = false;

  this.excelLabel='Item Movement'
  this.exportExcelService.ExportExcel(this.report,this.headers,this.excelLabel)
}
printReport() {
  let printContents, popupWin;
  printContents = document.getElementById('printedArea').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
<html>
  <head>
    <title>Print tab</title>
    <style>

    </style>
  </head>
<body onload="window.print();window.close()">${printContents}</body>
</html>`
  );
  popupWin.document.close();
}


}
