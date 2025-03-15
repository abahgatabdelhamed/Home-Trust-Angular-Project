import { Component, OnInit } from '@angular/core';
import { SBillService } from '../../shared/services/sbill.service'
import { SBill } from '../../shared/models/sbill.model'
import { Router } from '@angular/router';
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
  selector: 'app-rsale',
  templateUrl: './rsale.component.html',
  styleUrls: ['./rsale.component.css']
})
export class RsaleComponent implements OnInit {

  sbills: SBill[] = [];
  ebills: SBill[] = [];
  gT = (key: string) => this.translationService.getTranslation(key);
  placeholder = this.gT("shared.billSearch")
  loadingIndicator1 = false;
  loadingIndicator2 = false;
  selectedEbill = null;
  selectedBill = null;
  selectedSbill = null;
  public bill3$: Observable<any[]>;
  public bill3input$ = new Subject<string>();
  public bill3Loading: boolean = false;
  public billEx3$: Observable<any[]>;
  public billEx3input$ = new Subject<string>();
  public billEx3Loading: boolean = false;
  maxDate: Date = new Date();
  minDate: Date = null;
  features: boolean[] = [false, false]
  constructor(private sbillService: SBillService, private alertService: AlertService,
    private router: Router, private translationService: AppTranslationService, private CheckPermissions: CheckPermissionsService,
    private sbillEndPointService: SBillEndpoint) { }

  ngOnInit() {

    this.features[0] = this.CheckPermissions.checkGroup(1, 3)
    this.features[1] = this.CheckPermissions.checkGroup(1, 7)

    this.loadData()

  }

  loadData() {
    this.loadBill3()
    this.loadBillEx3()
    //this.alertService.startLoadingMessage();
    // this.loadingIndicator1 = true;
    // this.sbillService.getBillsCanBeRefunded('SALE').subscribe(
    //     (data: any) => {
    //       this.loadingIndicator1 = false;
    //       this.sbills = data;
    //     },
    //     error =>{
    //       this.loadingIndicator1 = false;
    //     }
    // );

    // this.loadingIndicator2 = true;
    // this.sbillService.getBillsCanBeRefunded('EXCHANGE').subscribe(
    //     (data: any) => {
    //       this.loadingIndicator2 = false;
    //       this.ebills = data;
    //     },
    //     error =>{
    //       this.loadingIndicator2 = false;
    //     }
    // );

  }

  sbillSearchSelected($event) {
    this.router.navigate(['sales', 'bill', 'n-rsale', $event.id])
  }

  ebillSearchSelected(event) {
    if (event) {
      this.selectedEbill = event;
      this.minDate = new Date(this.selectedEbill.date)
    } else {
      this.selectedEbill = null;
      this.selectedBill = null;
    }
  }

  refund(id, refundDate) {
    this.sbillService.refundExchangeBill(id, refundDate).subscribe(
      (data: any) => {
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
          this.sbillEndPointService.SearchBillsCanRefund(term, 'EXCHANGE').pipe(
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
          this.sbillEndPointService.SearchBillsCanRefund(term, 'SALE').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.bill3Loading = false))
          )
        )
      )
    );
  }


}
