import { Component, OnInit } from '@angular/core';
import { SBillService } from '../../shared/services/sbill.service';
import { ExpensesService } from '../services/expenses.service';
import { SBill } from '../../shared/models/sbill.model'
import {Router} from '@angular/router';
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from '../../../services/app-translation.service';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { SBillEndpoint } from '../../shared/services/sbill-endpoint.service';
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
@Component({
  selector: 'app-rpurch',
  templateUrl: './rpurch.component.html',
  styleUrls: ['./rpurch.component.css']
})
export class RpurchComponent implements OnInit {
  pbills: SBill[] = []
  ebills: SBill[] = [];
  gT = (key: string) => this.translationService.getTranslation(key);
  placeholder =this.gT("shared.billSearch")
  loadingIndicator1 = false;
  loadingIndicator2 = false;
  selectedEbill = null;
  selectedBill = null;
  selectedPbill = null;
  maxDate:Date = new Date();
  minDate:Date = null;
  features:boolean[]=[false,false]
  public bill3$: Observable<any[]>;
  public bill3input$ = new Subject<string>();
  public bill3Loading: boolean = false;
  public billEx3$: Observable<any[]>;
  public billEx3input$ = new Subject<string>();
  public billEx3Loading: boolean = false;
  constructor(private sbillService: SBillService, private alertService: AlertService,
    private router : Router,private translationService:AppTranslationService,
    private expensesService: ExpensesService,
    private checkPermissins:CheckPermissionsService,
    private sbillEnpointService:SBillEndpoint
    ) { }

  ngOnInit() {
    this.features[0]=this.checkPermissins.checkGroup(2,2)
    this.features[1]=this.checkPermissins.checkGroup(2,5)
    this.loadData()
  }

  loadData() {
 
     // this.loadBill3()
      this.loadBillEx3()
    //this.alertService.startLoadingMessage();
    // this.loadingIndicator1 = true;
    this.sbillService.getSBills({from:'',to :''},'PURCH').subscribe(
        (data: any) => {
        //  console.log('pbills=',data)
          this.loadingIndicator1 = false;
          this.pbills = data.content;
        },
        error =>{
          this.loadingIndicator1 = false;
        }
    );

    this.loadingIndicator2 = true;
    this.expensesService.getAvailableExpensesBillForRefunde().subscribe(
        (data: any) => {
          this.loadingIndicator2 = false;
          this.ebills = data;
        },
        error =>{
          this.loadingIndicator2 = false;
        }
    );

}

pbillSearchSelected($event){
  this.router.navigate(['purch', 'bill' ,'n-rpurch', $event.id])
}

ebillSearchSelected($event){
  if($event){
    this.selectedEbill = $event;
    this.minDate = new Date(this.selectedEbill.date)
  }else{
    this.selectedEbill = null;
    this.selectedBill = null;
  }
}

refund(id, refundDate){
  this.expensesService.refundBill(id, refundDate).subscribe(
    (data:any)=>{
      this.selectedEbill = null;
      this.selectedBill = null;
      this.loadData();
    }
  )
}

private loadBillEx3() {
  this.billEx3$ = concat(
      of([]), // default people
      this.billEx3input$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          tap(() => (this.billEx3Loading = true)),
          switchMap(term =>
            this.sbillEnpointService.SearchBillsExpensesRefund(term).pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => (this.billEx3Loading = false))
              )
          )
      )
  );
}

private loadBill3() {
  this.bill3$ = concat(
      of([]), // default people
      this.bill3input$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          tap(() => (this.bill3Loading = true)),
          switchMap(term =>
              this.sbillEnpointService.SearchBillsCanRefund(term,'PURCH').pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => (this.bill3Loading = false))
              )
          )
      )
  );
}
p

}
