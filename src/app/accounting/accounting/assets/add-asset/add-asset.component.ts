import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { concat, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { tap } from 'underscore';
import { AlertService,DialogType,MessageSeverity } from '../../../../services/alert.service';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../../services/check-permissions.service';
import { ItemFeature, ItemFeatureInitialValue } from '../../../definitions/models/item-feature.model';
import { ItemUnit } from '../../../definitions/models/item-unit.model';
import { ItemInterface } from '../../../definitions/models/item.model';
import { PrintItemService } from '../../../definitions/services/item.print.service';
import { ItemService } from '../../../definitions/services/item.service';
import { ExchangeVarService } from '../../../sales/services/exchange-varieties.service';
import { ReceiptDocService } from '../../../sales/services/receipt-doc.service';
import { Asset } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';

@Component({
    selector: 'app-add-asset',
    templateUrl: './add-asset.component.html',
    styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {
    
    public accounts: any[] = [{ id: 1, name: "Not found" }];
    accountsSales: any[] = [{ id: 1, name: "Not found" }];
    Dinterval = []
    SelectedCost:any=[]
    Allperc:number[]=[]
    hasClickedEdit = false;
    isloading = false
    editingMode: boolean;
    branchselected;
    specific = false
    isCosts:boolean=false
    MaxPerc:number=100
    itemOffer = { id: 0 };
    isloadingEdit:boolean=false
    isEdit: boolean = false;
    isShow: boolean = false;
    isShowTable:boolean=false
    costCenters:any
    public selectedItem: any;
    uploadDone = false;
    Perc
    branchName:string
    item: any = {
        nameAr: "",
        nameEn: "",
        value: 1,
        depreciationPerc: 1,
        depreciationInterval: 1,
        depreciationAccountId: null,
        increaseAccountId: null,
        depreciationStartDate: null

    };
    DepreciationInterval = 0
    Cost:any
    Costselected
    //itemUnit: ItemUnit = ItemUnitInitialValue;
    itemUnit: any
    itemFeature: ItemFeature = ItemFeatureInitialValue;
    gT = (key: string) => this.translationService.getTranslation(key);
    branches: any;
    branchEdit:boolean=false
    isbranch:boolean=false
    section2:boolean=false
    paramEdit:boolean=false
    isCCPermission:boolean=false
    constructor(
        // private itemService: ItemService,
        private assetService: AssetService,
        private navigator: Router,
        private alertService: AlertService,
        private router: ActivatedRoute,
        private route: Router,
        private translationService: AppTranslationService,
        private printService: PrintItemService,
        private dailyDocService: ReceiptDocService,
        private exchangeVarService:ExchangeVarService,
        private checkPermissions:CheckPermissionsService
    ) { }

    ngOnInit() {
        this.isCCPermission=this.checkPermissions.checkGroup(6,11)
   
       this.Dinterval= [{ name:this.gT('asset.daily'), value: 1 }, { name:this.gT('asset.weekly'), value: 7 }, { name:this.gT('asset.monthly'), value: 30 }, { name:this.gT('asset.yearly'), value: 360 }, { name: this.gT('asset.specified'), value: 0 }]
    
        this.router.params.subscribe(params => {
            if (params.id) {
                this.loadItemDate(params.id);
                this.isEdit = true;
                this.isloadingEdit=true
                this.section2=true
                this.paramEdit=true
                this.isShowTable=true
            }

        });
        if (this.route.url.includes("showassets")) {
            this.isShow = true
            this.section2=false
            this.paramEdit=false
        }




        this.loadInit();
      
    }
    SubmitCost(){
        this.isloading=true
        this.assetService.AddBranchesCCDepreciationAsset(this.item.id,this.Costselected,this.Perc).subscribe({next :(val)=>{
          //  console.log('b=',val)
           this.Costselected=null
           this.Perc=null
            this.isloading=false
           this.reloadAsset(this.item.id)
                
          /*  this.assetService.GetCostCenter(this.branchselected).subscribe({
                next:(val)=>{
                    console.log('cost=',val)
                    this.Cost=val
                }
            })*/
         }}) 

    }
    Submitbranch(){
        // if(this.isbranch==true){
        //     this.alertService.showMessage('عند نغيير الفرع ستقوم بحذف جميع مراكز التكلفة الموجودة على هذا الفرع','هل انت متأكد من هذه العملية؟',MessageSeverity.warn)
        // }
       // console.log(this.branchselected,this.item)
      
       console.log('branch=',this.branchselected,this.item.id)
       if(this.branchEdit==true){
           this.assetService.EditbranchAsset(this.branchselected,this.item.id).subscribe({next :(val)=>{
            console.log('b=',val )
            this.reloadAsset(this.item.id)
                
        }}) 
       }
       else{
        this.assetService.AddbranchAsset(this.branchselected,this.item.id).subscribe({next :(val)=>{
            console.log('b=',val )
            this.reloadAsset(this.item.id)
                
        }}) 
    }
     }
     SubmitEditCost(i){
         this.assetService.EditCost({id:i.id,branchId:i.branchId,perc:i.perc}).subscribe({
             next:(res)=>{
                this.reloadAsset(this.item.id)
             }
            }
         )
     }

    loadItemDate(id) {
        this.editingMode = true;
        this.reloadAsset(id)
            this.exchangeVarService.getInitial().subscribe(res => {
                this.isbranch=true
                this.branches = res["branches"];
               // this.items = res["items"];
                //this.automatedCode = res["code"];
            //    console.log("init is ", res);
            });
            
    }
    DeletedCost(id){
         this.assetService.DeleteCost(id).subscribe({
            next:()=>{
                this.reloadAsset(this.item.id)
            }
        })
    }
    DeleteCost(id,name){
        console.log('id=',id)
            this.alertService.showDialog(
                'هل أنت متأكد من حذف مركز التكلفة  "' + name + '"?',
                DialogType.confirm,
                () => this.DeletedCost(id)
            );
        

    }

    loadInit() {
        
        this.dailyDocService.getInitial().subscribe(res => {
            this.accounts = Object.values(res.accounts);
            this.accounts.forEach(e => {
                //      console.log(e)
                if (e.isDefault == true)
                    this.accountsSales.push(e);
            });
            //  console.log('account=',Object.values(this.accountsSales),'res=',res)

        })
    }


    handleSubmit(printable = false) {
        this.isloading = true
      //  console.log("submit", this.item)
        if (this.DepreciationInterval > 0 && this.item.depreciationInterval == 0)
            this.item.depreciationInterval = this.DepreciationInterval
        if (this.isEdit)
            this.assetService.EditAsset(this.item).subscribe({
                next: (val) => {
                    
                  //  console.log("editSucces=", val)
                    this.isloading = false
                }
            })
        else
            this.assetService.AddAsset(this.item).subscribe({
                next: (val) => {
                   // console.log("addSucces=", val)
                    this.isloading = false
                  this.isEdit=true
                  this.section2=true
                //    this.isShow=true
                    val['increaseAccount'] = val.increaseAccount.name
                    val['depreciationAccount'] = val.depreciationAccount.name
                   console.log(val)
                    this.costCenters=val.branchCCDepreciationAssets


                    this.item=val
                    this.exchangeVarService.getInitial().subscribe(res => {
                        this.branches = res["branches"];
                       // this.items = res["items"];
                        //this.automatedCode = res["code"];
                      //  console.log("init is ", res);
                    });
                }
            })


    }
    reloadAsset(id){
        this.SelectedCost=[]
        this.assetService.GetAssetById(id).subscribe(
            {
                next: (res) => {
                    if(res.branchCCDepreciationAssets.length>0)
                    this.branchEdit=true
                    this.isloadingEdit=false
                    res['increaseAccount'] = res.increaseAccount.name
                    res['depreciationAccount'] = res.depreciationAccount.name
                    this.costCenters=res.branchCCDepreciationAssets
                    
                    this.item = res
                    if(this.costCenters.length>0){
                          this.branchName=this.costCenters[0].branch.name
                          this.branchselected=this.costCenters[0].branch.id
                    }
                    if(this.costCenters.length>1)
                    this.isCosts=true
                    console.log('res=', res)
                    this.isEdit=true
                    let i=0
                    this.MaxPerc=100
                    this.costCenters.forEach(e=>{
                        if(e.costCenterId){
                        this.Allperc[i]=e.perc
                        this.MaxPerc=this.MaxPerc- e.perc
                        }
                        this.SelectedCost[i]=e.costCenterId
                        i++;
                    })
                   
              //      console.log(this.MaxPerc)
              this.assetService.GetCostCenter(this.branchselected).subscribe({
                next:(val)=>{
                 //   console.log('cost=',val)
                    this.Cost=val
                    this.isbranch=true
                   
                }
            })  
            }

            })
    }

}
