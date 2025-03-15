import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { catchError, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ItemService } from '../../definitions/services/item.service';
import { PrinterSettingsService } from '../../definitions/services/printer-settings.service';
import { ReportsEndpointService } from '../../reports/services/reports-endpoint.service';
import { ItemSearchService } from '../../shared/services/item-search.service';

@Component({
  selector: 'app-barcode-information',
  templateUrl: './barcode-information.component.html',
  styleUrls: ['./barcode-information.component.css']
})
export class BarcodeInformationComponent implements OnInit {
  items: any=[];
  itemSearchLoading:boolean=true
  selectedItem
  shopName:string
  pricewithvat=0
  barcode=0
  barcodelength=[]
  unitItem=[]
  tall=6
  items$: Observable<any[]>
  itemsInput$ = new Subject<string>();
  vatdefult=0
  width=6
  itemName
  changeunit=1
  convert=37.7952755906
  unitCm:boolean=true
  fromCM=37.7952755906
  fromMm=3.7795275591
  checkedData:any={name:true,item:false,vat:false,itemUnit:false,view:false}
  itemUnit: string;
  defaultfont: string;
  fontfamilys: any[]=[];
  numberOfelement=2
  constructor(private itemService: ItemService,
    private itemSearchService: ItemSearchService ,
    private settingService:PrinterSettingsService,) { }

  ngOnInit() {
    this.defaultfont = "Arial";

    
    this.fontfamilys.push('Cambria');
    this.fontfamilys.push('Andalus');
    this.fontfamilys.push('Times New Roman');
    this.fontfamilys.push('Calibri');
    this.fontfamilys.push('Arial');

    this.getAllItems()
    this.settingService.getPrinterSettings().subscribe(res=>
      
      this.shopName=res.thermalPrinter.shopName)
  }
  
  private loading(){
    this.items$ = concat(
      of([]), // default items
      this.itemsInput$.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap(term =>
            this.itemSearchService
            .getSearchItemEndpoint(term, null , null)
            .pipe(
                      catchError(() => of([])), // empty list on error
                  )
          )
      )
  );
  }
   getAllItems() {
   // this.loading()
    this.itemService.getItems().subscribe(
      (data: any) => {
        this.items = data.data
        this.itemSearchLoading=false
        this.items.push({nameAr:'test',id:'9',code:'123467'})
        this.items.push({nameAr:'test',id:'66',code:'1234987654666666666666665678'})
        this.items.push({nameAr:'test',id:'79',code:'12349876543267895679'})
        this.items.push({nameAr:'test',id:'86',code:'123456666666711'})
        this.items.push({nameAr:'test',id:'44',code:'1234876556712'})
      }
    )
  }
  SelectedItemsChange($event){
   console.log('event',$event)
   if(this.selectedItem){
      this.vatdefult=$event.vatTypeDefaultValue
      this.barcode=$event.code
      this.itemName=$event.nameAr
      this.itemUnit=this.itemName
      this.unitItem=$event.itemUnits
//this.barcode=123456678902467
   this.barcodelength=Array.from(String(this.barcode), Number)
   }
  

  }
  view(v,n){
    this.checkedData.view=true
    this.itemName=this.itemUnit
    this.pricewithvat=v
    if(this.checkedData.itemUnit)
    this.itemName+=' - '+n
  }
  getunit(value){
    if(value=='cm'){
      this.unitCm=true
      this.convert=this.fromCM
      this.changeunit=1
    }
    
    else{
        this.unitCm=false
        this.convert=this.fromMm
        this.changeunit=0.1
    }
  
    console.log(this.unitCm,value)
  }
    getval(e){
    this.checkedData.name=e
    e==true?this.numberOfelement++:this.numberOfelement--
    }
    getcheckvat(e){
     this.checkedData.vat=e
     e==true?this.numberOfelement++:this.numberOfelement--
    }
    gstcheckItem(e){
     this.checkedData.item=e
     e==true?this.numberOfelement++:this.numberOfelement--
    }
    gstcheckItemUnit(e){
      this.checkedData.itemUnit=e
 
     }
}
