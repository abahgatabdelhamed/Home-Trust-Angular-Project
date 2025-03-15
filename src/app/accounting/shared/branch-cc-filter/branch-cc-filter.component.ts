import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BranchService } from "../../definitions/services/branch.service";
import { CostCenterService } from "../../definitions/services/cost-center.service";
import { Branch } from "../../definitions/models/branch.model";
import { CostCenterModel } from '../models/cost-center.model';
import { Output, EventEmitter } from '@angular/core';
import { AppTranslationService } from "../../../services/app-translation.service";
import { ExpensesTemplateModel } from '../models/expenses-template-model';
import { FilterData } from '../models/branch-cc-filter.model';
import { any } from 'underscore';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { ReportsService } from '../../reports/services/reports.service';
import { viewShift } from '../../reports/models/ShiftItem';
import { inputs } from '@syncfusion/ej2-angular-barcode-generator/src/barcode-generator/barcodegenerator.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-branch-cc-filter',
  templateUrl: './branch-cc-filter.component.html',
  styleUrls: ['./branch-cc-filter.component.css']
})


export class BranchCcFilterComponent implements OnInit {
  @Input() withSearch: boolean = false;
  @Input() withUser:boolean=false
  @Input() isShift=false
  @Input() withdate:boolean=true
  @Input() withExpensesLables: boolean = false;
  @Input() withTime:boolean=true
  @Input() withBranch:boolean=false
  @Input() withCC:boolean=false
  @Input() withBillTypeFilter:boolean = false;
  @Input() withAddNew:boolean = false;
  @Input() withExportAsXLSX: boolean = false;
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filter = new EventEmitter<FilterData>();
  @Output() exportAsXLSXEvent = new EventEmitter<any>();
  @Output() addNewEvent = new EventEmitter<any>();
  @Input () validCC:boolean=false
  @Input() validBranch:boolean=false
  @Input() validDate:boolean=false
  @Input() withbtn:boolean=true
  isCCPermission=false
  temp:any=[]
  gT = (key: string) => this.translationService.getTranslation(key);
  billTypes = [
    {name: this.gT('shared.AllSalesBill'),code:'SALE',Gcode:1,Fcode:1}, 
    {name: this.gT('shared.AllRSalesBill'),code:'RSALE',Gcode:1,Fcode:3}, 
    {name: this.gT('shared.AllQuote'),code:'QUATE',Gcode:1,Fcode:2}, 
    {name: this.gT('shared.Exchange'),code:'EXCHANGE',Gcode:1,Fcode:4},
    {name: this.gT('shared.RExchange'),code:'REXCHANGE',Gcode:1,Fcode:7}, 
    {name: this.gT('shared.AllPurchBill'),code:'PURCH',Gcode:2,Fcode:1}, 
    {name: this.gT('shared.AllRPurchBill'),code:'RPURCH',Gcode:2,Fcode:2}
  ]
  branchList: Branch[] = [];
  Users:User[]

  now=new Date()
  costCenterList: CostCenterModel[] = [];
  expensesTemplateList: ExpensesTemplateModel[] = [];
  filterData: FilterData ={branchName:'',
  costCenterName:'', selectedBillType: this.billTypes[0].code ,selectedBranch: null, selectedCC: null, selectedExpensesId: null, serachModel:  {
    from: null,
    to: null
},fromTime: new Date(), toTime :new Date(),
userSelected:null

}



//new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(),0,0,0),toTime:new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(),0,0,0)};
  

  constructor(private branchService: BranchService,
     private costCenterService: CostCenterService,
     private translationService: AppTranslationService,
     private checkPermissions:CheckPermissionsService,
     private reportService:ReportsService,
     private ch:ChangeDetectorRef,
     private router:Router,
     private accountService:AccountService) { }

  ngOnInit() {
    this.isCCPermission=this.checkPermissions.checkGroup(6,11)
    if(this.withTime){
      this.filterData.serachModel.from=new Date()
      this.filterData.serachModel.to=new Date()
    }
    this.filterData.fromTime.setHours(0, 0, 0, 0)
    this.filterData.toTime.setHours(23, 59, 59, 999)
    this.temp=this.billTypes
    this.billTypes=[]

    this.temp.forEach((e,index)=>{
      console.log(this.checkPermissions.checkGroup(e.Gcode,e.Fcode),e.Gcode,e.Fcode)
    //  if(this.checkPermissions.checkGroup(e.Gcode,e.Fcode)){
    //    console.log(e.Gcode,e.Fcode)
        this.billTypes.push(e)
      //}
     
    })
    this.filterData.selectedBillType=this.billTypes.length>0?this.billTypes[0].code:null
    this.getAllBranches();
    if(!this.router.url.includes('tables'))
    if(!this.validation())
    this.applyFilter()
  
    if(this.withUser &&this.isShift)
    this.getAllUser()
    else if(this.withUser &&!this.isShift)
    this.getAllUsersAcconuts()
    
  }

  onSearchChanged(val:string){
    this.searchChanged.emit(val);
  }

  addNew(){
    this.addNewEvent.emit();
  }

  exportAsXLSX(){
    this.exportAsXLSXEvent.emit()
  }

  getCCByBranch(){
    this.costCenterList = [];
    this.filterData.selectedCC = null;
    if(this.filterData.selectedBranch)
      this.costCenterService.getAllByBranch(this.filterData.selectedBranch).subscribe(
        (data:CostCenterModel[])=>{
          this.costCenterList=data
          console.log(this.costCenterList,data)
        },
        (error:any)=> console.error(error)
      )
  }

  getAllUesdExpensesLables(){
    this.expensesTemplateList = [];
    this.filterData.selectedExpensesId =null;
    console.log(this.filterData.selectedCC,'cccc')
    if(this.filterData.selectedCC)
      this.costCenterService.getUsedCCExpensesLabeles(this.filterData.selectedCC).subscribe(
        (data:ExpensesTemplateModel[])=>{
          console.log('*****',data,this.expensesTemplateList)
          this.expensesTemplateList = data;
          console.log(data)
        },
        (error:any)=> console.error(error)
      )
  }

  getAllBranches(){
    this.branchList = [];
    this.branchService.getAllBranches().subscribe(
      (data:any)=>{ 
        this.branchList = data;
        this.filterData.selectedBranch=this.branchList[0].id 
        this.branchList.forEach(e =>{
          if(e.id==this.filterData.selectedBranch)
                  this.filterData.branchName=e.name
   })
 
        this.getCCByBranch()
       if(!this.validation()){ 
        this.applyFilter()
        }
       },
      (error:any)=> console.error(error)
    )
  }
  getAllUser(){
    this.reportService.getAllUsers().subscribe(res =>{
      this.Users=res

    })
  }
  getAllUsersAcconuts(){
    this.accountService.getUsersForReport().subscribe(res =>{
      this.Users=res
    })
  }
  applyFilter(){
    if(this.withTime){
      this.filterData.serachModel.from=this.filterData.serachModel.from&&this.filterData.fromTime?new Date(this.filterData.serachModel.from.getFullYear(), this.filterData.serachModel.from.getMonth(), this.filterData.serachModel.from.getDate(), this.filterData.fromTime.getHours(), this.filterData.fromTime.getMinutes()):this.filterData.serachModel.from
      this.filterData.serachModel.to=this.filterData.serachModel.to&&this.filterData.toTime?new Date(this.filterData.serachModel.to.getFullYear(), this.filterData.serachModel.to.getMonth(), this.filterData.serachModel.to.getDate(), this.filterData.toTime.getHours(), this.filterData.toTime.getMinutes()):this.filterData.serachModel.to
    }
    if(this.filterData.selectedBranch)
    this.branchList.forEach(e =>{
           if(e.id==this.filterData.selectedBranch)
                   this.filterData.branchName=e.name
    })
    if(this.filterData.selectedCC)
    this.costCenterList.forEach(e =>{
  //    console.log(e,this.filterData.selectedCC)
           if(e.id==this.filterData.selectedCC)
                   this.filterData.costCenterName=e.nameAr
    })
    
    this.filter.emit(this.filterData);
 
  }
 validation(){
   if(this.validCC)
   return !(this.filterData.selectedCC&&this.filterData.serachModel.from&&this.filterData.serachModel.to)
   if(this.validBranch)
   return !(this.filterData.selectedBranch&&this.filterData.serachModel.from&&this.filterData.serachModel.to)
   if(this.validDate)
   return !(this.filterData.serachModel.from&&this.filterData.serachModel.to)
 }

}
