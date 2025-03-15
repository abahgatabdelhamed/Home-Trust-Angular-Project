import { ExportExcelService } from './../../shared/services/export-excel.service';
import { transition } from '@angular/animations';
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
import { ItemCatService } from '../services/itemcat.service';
import { Discount } from '../models/discount.model';
import { DiscountManagementService } from '../services/discount-management.service';
import { AlertService, DialogType } from '../../../services/alert.service';
import { PrintDiscountService } from '../services/print-discountManagement.print.service';


@Component({
  selector: 'app-discount-management',
  templateUrl: './discount-management.component.html',
  styleUrls: ['./discount-management.component.css']
})
export class DiscountManagementComponent implements OnInit {
 
  itemsForSearch: number[] = []
  itemCategoryForSearch: number[] = []
  selectdItem = []
  selectedItemCategory = []
  allItems:{items:number[],service:number[]}={items:[],service:[]}
  // Categories$:Observable<any[]>
  discountStatus:boolean=false
  Categories=[]
  items$: Observable<any[]>;
  itemSearchLoading = false;
  itemsInput$ = new Subject<string>();
  itemName=''
  itemCatName=''
  percentage:boolean=true
  discount:number=0
  AllItemsAndServices:boolean=false
  discountModel:Discount={
    AllItemsAndServices:false,
    ItemCategoriesId:[],
    ItemsId:[],
    ServicesId:[],
    PercentageValue:0,
    DiscountedValue:0
  }
  // private serviceItemSearch:ItemSearchService ,
  constructor(
      private serviceItemSearch: ItemSearchService,
      private categoryService:ItemCatService,
       private translationService: AppTranslationService,
       private discountService:DiscountManagementService,
       private alertService:AlertService,
       private printService:PrintDiscountService

      ) { }
  gT = (key: string) => this.translationService.getTranslation(key);


  
  ngOnInit() { 
    this.discountService.getDiscoutnStatus().subscribe(res =>{
      this.discountStatus=res
    })
    this.discountStatus     
      this.loadItems()
      this.loadCategories()
     

}
changeDiscountStatus(){
  if(!this.discountStatus)
  this.alertService.showDialog(
    `${this.gT("messages.changeDiscount")}  `,
    DialogType.confirm,
    () => this.ChngeDiscount(),
    ()=>this.discountStatus=!this.discountStatus

);
else
this.ChngeDiscount()
}
ChngeDiscount(){
  this.discountService.EnableDisableDiscount(this.discountStatus).subscribe(res=>{
    
  })
}
  SelectedCategoriesChange() {
      console.log("SelectedCategoriesChange()", this.Categories);
      console.log("selected cate", this.selectedItemCategory);
      this.itemCatName=''
      this.Categories.forEach(e=>{
        console.log(e)
          if(this.discountModel.ItemCategoriesId.findIndex(val =>e.id==val)>-1)
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

 




  private loadItems() {
      this.items$ = concat(
          of([]), // default items
          this.itemsInput$.pipe(
              debounceTime(1000),
              distinctUntilChanged(),
              switchMap(term =>
                  this.serviceItemSearch
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
       this.categoryService.getItemCats().subscribe(data => {
          console.log("getAllCategoriesItem", data);
          this.Categories = data })

  }

  print(){
    this.discountModel.Items=this.itemName
    this.discountModel.ItemCategories=this.itemCatName
   this.printService.printDocument(this.discountModel,'الخصومات','ادارة الخصومات')
  }

  onSubmit(withPrint) {
    if(this.percentage){
      this.discountModel.PercentageValue=this.discountModel.DiscountedValue
      this.discountModel.DiscountedValue=0
    }
    this.discountModel.ItemsId=this.allItems.items
    this.discountModel.ServicesId=this.allItems.service
    
    this.discountService.Discount(this.discountModel).subscribe(res=>{
      if(withPrint)
      this.print()
      this.discountModel={AllItemsAndServices:false,DiscountedValue:0,ItemCategoriesId:[],ItemsId:[]
      ,PercentageValue:0,ServicesId:[]}
    })
   

      // * for test log
    
  }



  reset(){
    this.discountService.Reset().subscribe()
  }



}
