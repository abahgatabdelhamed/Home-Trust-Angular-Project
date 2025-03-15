import { ExportExcelService } from './../../shared/services/export-excel.service';
import { transition } from '@angular/animations';
import { ReportsEndpointService } from './../services/reports-endpoint.service';

import { ReportsService } from './../services/reports.service';
import { Component, OnInit } from '@angular/core';





import { ItemSearchService } from '../../shared/services/item-search.service';
import { T } from '@angular/core/src/render3';
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { catchError, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import Page from '../../definitions/models/page.model';
import { AppTranslationService } from '../../../services/app-translation.service';
import { AccountService } from '../../../services/account.service';



@Component({
    selector: 'app-reports-amount',
    templateUrl: './reports-amount.component.html',
    styleUrls: ['./reports-amount.component.css']
})
export class ReportsAmountComponent implements OnInit {
    excelLabel = 'SolidItemReport'
    selectedBranch: any
    itemsForSearch: number[] = []
    itemCategoryForSearch: number[] = []
    fromDate:Date=new Date()
    toDate:Date =new Date()
    fromTime:Date=new Date()
    toTime:Date =new Date()
    AllBranchData = []
    selectdItem = []
    Users=[]
    selectedItemCategory = []
    allItems:{items:number[],service:number[]}={items:[],service:[]}
    // Categories$:Observable<any[]>
    Categories=[]
    solidItemReportsResult = []
    //
    items$: Observable<any[]>;
    itemSearchLoading = false;
    itemsInput$ = new Subject<string>();
    // table
    loadingIndicator: boolean;
    page: Page = new Page( 0, 0);
    rows;
    columns: any[] = [];
    view=false
    itemName=''
    itemCatName=''
    branchName
    userSelected
    services: number[];
    // private serviceItemSearch:ItemSearchService ,
    constructor(private ReportsService: ReportsService,
        private serviceItemSearch: ItemSearchService,
         private ReportsEndpointService: ReportsEndpointService , 
         private accountService:AccountService,
         private translationService: AppTranslationService,

         private ExportExcelService:ExportExcelService) { }
    gT = (key: string) => this.translationService.getTranslation(key);


    
        headers = {
            itemId: {
                title: "",
                order: 0,
                excel_cell_header: "",
                isVis:false
            },
            index:{
                title: '',
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
            unitName:{
                title: '',
                order: 4,
                excel_cell_header: "D1",
                isVis: true
            },
            soldQuentity:{
                title:  '',
                order: 5,
                excel_cell_header: "E1",
                isVis: true
            },
            type:{
                title:  '',
                order: 6,
                excel_cell_header: "F1",
                isVis: true
            },
    
    
          

    };
    ngOnInit() {
        this.fromTime.setHours(0, 0, 0, 0)
        this.toTime.setHours(23, 59, 59, 999)
        this.LoadDataBranch()
        this.loadUsers()
        this.loadItems()
        this.loadCategories()
        this.solidItemReportsResult = []
        this.rows=[]

        this.columns = [
            {
                prop: "index",
                name: this.gT("shared.index"),
                width: 60
            },
            {
                prop: "nameAr",
                name:this.gT("shared.nameAr"),
                width: 60
            },
            {
                prop: "nameEn",
                name: this.gT("shared.nameEn"),
                width: 60

            },
       
            {
                prop: "unitName",
                // soldQuantity
                name: this.gT("shared.itemUnitName"),
                width: 60

            },
            {
                prop: "soldQuentity",
                // soldQuantity
                name: this.gT("shared.soldQuantity"),
                width: 60

            },
    ]

}

    SelectedCategoriesChange() {
        console.log("SelectedCategoriesChange()", this.Categories);
        console.log("selected cate", this.selectedItemCategory);
      
        this.Categories.forEach(e=>{
            if(e.id==this.selectedItemCategory)
            this.itemCatName+=' '+e.nameAr
        })

    }
    SelectedItemChange(e) {
        console.log("items selected", this.selectdItem);
        console.log('event=',e)
        this.allItems.items=[]
        this.allItems.service=[]
        this.itemName=''
        e.forEach((element,index) => {
            this.itemName+=' '+element.name
          element.isService==true?this.allItems.service.push(element.id): this.allItems.items.push(element.id)
        });
       
        
       
    }
    loadUsers(){
        this.accountService.getUsersForReport().subscribe(users => {
            this.Users=users
        });
    
    }
    LoadDataBranch() {
        this.ReportsService.getAllBranches().subscribe(data => {
            console.log(data);
            this.AllBranchData = data
            data.map(data => {
                if (data.isDefault === true) {
                    this.selectedBranch = data.id
                    this.branchName=data.name
                }
            })
            console.log(this.selectedBranch);

        })


    }

    //   get branch id
    SearchSelectedBranch() {
        console.log(this.selectedBranch);
        this.AllBranchData.forEach(element => {
            if(element.id==this.selectedBranch)
            this.branchName=element.name
        });
        //   when change branch load items also and clear selected check !
        this.loadItems()

        this.selectdItem = []
        this.solidItemReportsResult = []
        console.log(this.selectdItem);

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
                        .getSearchItemNameEndpoint(term)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                        )
                )
            )
        );
    }

    private loadCategories() {
         this.ReportsService.getAllCategoriesItem().subscribe(data => {
            console.log("getAllCategoriesItem", data);
            this.Categories = data })

    }



    onSubmit() {
        // * for test log
        this.fromDate=new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), this.fromTime.getHours(), this.fromTime.getMinutes())
        this.toDate=new Date( this.toDate.getFullYear(),  this.toDate.getMonth(),  this.toDate.getDate(), this.toTime.getHours(), this.toTime.getMinutes())
     
        console.log("submit data :");
        console.log("from date", this.fromDate);
        console.log("to date", this.toDate);
        console.log("this.selectedItemCategory", this.selectedItemCategory);
        console.log("this.selectdItem ", this.selectdItem)
     console.log("this.selectdItem ", this.allItems)
        this.ReportsService.PostSolidItemReport(this.fromDate, this.toDate, this.selectedItemCategory, this.allItems.items,this.allItems.service,this.selectedBranch,this.userSelected).subscribe(data => {
            console.log(data);
             data.forEach((element,index) => {
                element.index=index+1
             });
            this.solidItemReportsResult = data
            
            this.rows =data
            this.view=true
        })
    }


    getAllSolidItemReportForExcel(){
     return   this.ReportsService.PostSolidItemReport(this.fromDate, this.toDate, this.selectedItemCategory, this.allItems.items,this.allItems.service,this.selectedBranch)
        .toPromise().then(data => {
            console.log(data);
            data.forEach((element,index) => {
                element.index=index+1
                element.type=this.gT("shared."+element.type)
            });
           return data
        });
    }

   async  exportAsXLSX() {
        let filters=0
        let e=[]
        let exportedRows=[]
        this.loadingIndicator = true;
        exportedRows=  await this.getAllSolidItemReportForExcel()
        //   exportedRows =  this.solidItemReportsResult
          console.log(" exportedRows =  this.solidItemReportsResult");
          console.log(this.solidItemReportsResult);
          if( this.selectedItemCategory.length>0){
            e.push({
                index: this.itemCatName,
                  
                unitName:  this.gT("shared.itemCat"),
                })
           filters++    
           }
           
           if(this.selectdItem.length>0){
            e.push({  
                index:  this.itemName,
                unitName:this.gT("shared.itemCategoryName"),
               
             })
      filters++          
        }
        if(this.selectedBranch){
         e.push({  
             index:  this.branchName,
             unitName:this.gT("shared.branch"),
            
          })
   filters++          
     }
            if(this.fromDate&&this.toDate){
                e.push({
                    index:  this.fromDate.toLocaleString(),
                    
                    unitName: this.gT("shared.from"),
                },
                {   index:this.toDate.toLocaleString(),
                    
        
                    unitName : this.gT("shared.to"),
                    })
                    filters+=2
            }
           
             e.push({},{   
             index: this.gT("shared.index"),
                
            nameAr: this.gT("shared.nameAr"),
             
            nameEn:this.gT("shared.nameEn"),
            unitName:this.gT("shared.itemUnitName"),
                
            soldQuentity:this.gT("shared.soldQuantity"),
            type:this.gT("shared.type")
                
    })
         exportedRows=e.concat(exportedRows)
           
       this.loadingIndicator=false;

       this.ExportExcelService.ExportExcel(exportedRows,this.headers,this.excelLabel,filters,5)




        // this.query = '';
        // this.loadData();
    }





}
