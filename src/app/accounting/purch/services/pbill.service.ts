import { Injectable } from '@angular/core';
import { BillPost } from '../../sales/models/bill-post.model'
import { PBillEndpoint } from './pbill-endpoint.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PBillService {

    constructor(private pbillEndpoint: PBillEndpoint) {

    }

    newPBill(pbill: BillPost) {
        return this.pbillEndpoint.getNewPBillEndpoint<BillPost>(pbill);
    }

    updatePBill(pbill: BillPost) {
        return this.pbillEndpoint.getUpdatePBillEndpoint<BillPost>(pbill, pbill.Id);
    }

    getPBills(page?: number, pageSize?: number) {

        return this.pbillEndpoint.getPBillsEndpoint<BillPost[]>(page, pageSize);
    }

    deletePBill(pbillOrPBillId: number): Observable<BillPost> {
        return this.pbillEndpoint.getDeletePBillEndpoint<BillPost>(pbillOrPBillId);
    }

    getPBillInit(){
        return this.pbillEndpoint.getPBillInitEndpoint();
    }
}
