import { Injectable } from '@angular/core';
import { BillPost } from '../models/bill-post.model'
import { SBillEndpoint } from './sbill-endpoint.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SBillService {

    constructor(private sbillEndpoint: SBillEndpoint) {

    }

    newSBill(sbill: BillPost) {
        return this.sbillEndpoint.getNewSBillEndpoint<BillPost>(sbill);
    }

    updateSBill(sbill: BillPost) {
        return this.sbillEndpoint.getUpdateSBillEndpoint<BillPost>(sbill, sbill.Id);
    }

    getSBills(dataParam, page?: number, pageSize?: number) {

        return this.sbillEndpoint.getSBillsEndpoint<BillPost[]>(dataParam ,page, pageSize);
    }

    getBillSummary(searchModel) {
        return this.sbillEndpoint.getBillSummaryEndpoint(searchModel);
    }

    getSalesBillSummary(searchModel,branchId,coastcenterId?,userId?:any) {
        
          console.log('branchId',branchId)
         return this.sbillEndpoint.getBillSalesSummaryEndpoint(searchModel,branchId,coastcenterId,userId)
    }
    getfakeData() {


        const fakeData = {
            sCash: 100,
            sNetwork: 100,
            sBank: 100,
            sVat: 100,
            sDebt: 100,
            rDebt: 50,
            rCash: 50,
            rNetwork: 50,
            rBank: 50,
            rVat: 50,
        };
        return fakeData;
    }


    getSBillById(dataParam) {
        return this.sbillEndpoint.getSBillByIDEndpoint(dataParam);
    }

    deleteSBill(sbillOrSBillId: number): Observable<BillPost> {
        return this.sbillEndpoint.getDeleteSBillEndpoint<BillPost>(sbillOrSBillId);
    }

    getSBillInit(dataParam){
        return this.sbillEndpoint.getSBillInitEndpoint(dataParam);
    }
}
