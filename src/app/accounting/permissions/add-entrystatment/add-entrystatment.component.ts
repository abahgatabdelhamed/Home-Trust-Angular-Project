import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SBillService } from '../../shared/services/sbill.service';
import { STBill } from '../models/sBill';
import { Statments } from '../models/statments';
import { PrintStatmentService } from '../services/print-statment.print.service';
import { StatmentsService } from '../services/statments.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { Subject, Observable, Subscription } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";

import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap,
    catchError,
    count
} from "rxjs/operators";
import { PeopleSearchService } from '../../shared/services/people-search.service';
import { StatmentsEndpointService } from '../services/statments-endpoint.service';
@Component({
  selector: 'app-add-entrystatment',
  templateUrl: './add-entrystatment.component.html',
  styleUrls: ['./add-entrystatment.component.css']
})
export class AddEntrystatmentComponent implements OnInit {
  bills:STBill[]=[]
  billsInfo:any[]=[]
  billcode
  isShowExit:boolean=false
  max=7
  statementsBillItemsQuantity:number[]=[]
  isEdit
  EntryId
  quantity;
  billitemid
  squantity
  alert:boolean=false
  submit:boolean=false
  isExit:boolean=false
  resulttoprint;
  item : Statments={
    billId:null,
    careNumber:"",
    driverId:null,
    driverName:null,
    driverPhoneNumber:null
  }
  loadingIndicator: boolean;
  isShow: boolean=false;
  message:string=''

  public bill3$: Observable<any[]>;
    public bill3input$ = new Subject<string>();
    public bill3Loading: boolean = false;

  gT = (key: string) => this.translationService.getTranslation(key);
  constructor(
             private statmentService:StatmentsService,
             private translationService:AppTranslationService,
             private router:ActivatedRoute,
             private route:Router,
             private printService:PrintStatmentService,
             public config:ConfigurationService,
            private peopleSearchService:PeopleSearchService,
            private statementEndPointService:StatmentsEndpointService) { }

  ngOnInit() {
  
    
    this.router.params.subscribe(params => {
      if (params.id) {
        this.EntryId=params.id
        this.isShow=true
        this.loadStatment(params.id);
        if(this.route.url.includes('newexitstatments')){
          this.isShowExit=true
        }
      }
      if(this.route.url.includes('newexitentrystatments')){
       this.isExit=true
    
     }
     this.loadBill3()
      
    this.loadData()
  })
}
  loadData(){
    this.loadingIndicator=true
    this.statmentService.GetgetAvailableBill().subscribe(
      (data: any) => {
        this.loadingIndicator = false;
        this.bills = data;
      },
      error =>{
        this.loadingIndicator = false;
      }
  );
  }
  loadStatment(id){
    this.statmentService.GetStatmentById(id).subscribe({
      next:(res)=>{
        this.resulttoprint=res
        this.item.careNumber=res.careNumber
        this.item.driverId=res.driverId
        this.item.driverName=res.driverName
        this.item.driverPhoneNumber=res.driverPhoneNumber
        this.item.billId=res.bill.id
        this.billcode=res.bill.receiptCode
        this.billsInfo=res.statementsBillItems
        this.item.code=res.code
        res.statementsBillItems.forEach(element => {
          element['billItem']=element.billItem.itemUnitBranch
          this.statementsBillItemsQuantity.push(element.quantity)
        });
        
       if(this.isExit){
         this.item.interStatementId=res.id
         this.item.quantity
      
       }
       console.log('resOb:',res,'s:',this.billsInfo)
       console.log('statementarray:',this.statementsBillItemsQuantity)
      }
    })

  }
  private loadBill3() {
    this.bill3$ = concat(
        of([]), // default people
        this.bill3input$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.bill3Loading = true)),
            switchMap(term =>
                this.statementEndPointService.SearchBillsThatHaveStatement(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => (this.bill3Loading = false))
                )
            )
        )
    );
}
  handleSubmit() {
    this.alert=false
    if(!this.isExit){

      console.log(this.item)
      this.statmentService.AddStatment(this.item).subscribe({next :(res)=>{
        console.log("res=",res)
       // res=res.content
        if(res.content){
          res=res.content
          this.resulttoprint=res
          this.item.careNumber=res.careNumber
          this.item.driverId=res.driverId
          this.item.driverName=res.driverName
          this.item.driverPhoneNumber=res.driverPhoneNumber
          this.item.billId=res.bill.id
          this.billcode=res.bill.receiptCode
          this.billsInfo=res.statementsBillItems
          this.item.interStatementId=res.id
          this.EntryId=res.id
          this.item.code=res.code
          res.statementsBillItems.forEach(element => {
            element['billItem']=element.billItem.itemUnitBranch
          })
          this.submit=true  
          this.isShow=true
        
          }
          else{
            if(res.code){
            this.message=this.isExit?this.getMessage2[res.code]:this.getMessage[res.code]
               this.alert=true
            }
          }

          
      }})
      
     
    }else{
      this.item.statementsBillItems=this.billsInfo
      console.log('addExit=',this.item)
      this.statmentService.AddExitStatment(this.item).subscribe({
        next:(res)=>{
          
          this.resulttoprint.statementsBillItems=res.content.statementsBillItems
  console.log('result',res)
  
  this.submit=true
        }
      })
    }
  }
  print(){
    let i=0
    if(!this.isShowExit&&this.isExit)
    this.resulttoprint.statementsBillItems.forEach(e  =>{
      e.remainderQuantity=this.statementsBillItemsQuantity[i]-e.quantity
      i++
    })
      this.printService.printDocument(this.resulttoprint,this.isShowExit||this.isExit?"تصريح خروج" : 'تصريح دخول','')
  }
  getMessage: { [key: number]: string } = {
    2: this.gT('messages.the_bill_has_been_dliverd'),
    1:  this.gT('messages.there_is_no_bill'),
  
}
getMessage2: { [key: number]: string } = {
  2: this.gT('messages.QuantityIssue'),
  1:  this.gT('messages.there_is_no_bill'),
  3:this.gT('messages.NoExitStatement'),

}
}
