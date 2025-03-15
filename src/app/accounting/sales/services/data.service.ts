import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer.model'
import { SBill } from '../models/sbill.model'
import { PBill } from '../../purch/models/pbill.model'

@Injectable()
export class DataService {

  private offerSource = new BehaviorSubject<Offer>(new Offer());
  public currentOffer = this.offerSource.asObservable();

  
  private sbillSource = new BehaviorSubject<SBill>(new SBill());
  public currentSBill = this.sbillSource.asObservable();

  private pbillSource = new BehaviorSubject<PBill>(new PBill());
  public currentPBill = this.pbillSource.asObservable();

  constructor() { }

  changeOffer(offer: Offer) {
    this.offerSource.next(offer)
  }

  changeSBill(sbill : SBill){
    this.sbillSource.next(sbill)
  }

  changePBill(pbill : PBill){
    this.pbillSource.next(pbill)
  }


}