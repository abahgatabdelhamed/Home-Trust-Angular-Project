import { Injectable } from '@angular/core';
import { Bill } from '../models/bill.model';
import { PBillEndpoint } from './bill-endpoint.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PBillService {

    constructor(private billEndpoint: PBillEndpoint) {

    }

    newBill(bill: Bill) {
        return this.billEndpoint.getNewBillEndpoint<Bill>(bill);
    }

    updateBill(bill: Bill) {
        return this.billEndpoint.getUpdateBillEndpoint<Bill>(bill, bill.id);
    }

    getBills(page?: number, pageSize?: number) {

        return this.billEndpoint.getBillsEndpoint<Bill[]>(page, pageSize);
    }

    deleteBill(billOrBillId: number): Observable<Bill> {
        return this.billEndpoint.getDeleteBillEndpoint<Bill>(billOrBillId);
    }
}
