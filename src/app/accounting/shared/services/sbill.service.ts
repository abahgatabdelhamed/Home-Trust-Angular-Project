import { Injectable } from '@angular/core';
import { BillPost } from '../models/bill-post.model'
import { SBillEndpoint } from './sbill-endpoint.service';
import { Observable } from 'rxjs/Observable';
import { Pagination } from '../models/pagination.model';

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

    getSBills(serachModel,billTypeCode:string, query:string='', branchId:number=null, costCenterId:number=null, pageSize?: number ,page?: number,userId?:any) {

        return this.sbillEndpoint.getSBillsEndpoint<Pagination<BillPost>>(billTypeCode, query, branchId, serachModel,costCenterId ,pageSize, page,userId);
    }

    changeStatus(billId, isDelivered) {
        return this.sbillEndpoint.changeStatus(billId, isDelivered);
    }

    getBillSummary(searchModel) {
        return this.sbillEndpoint.getBillSummaryEndpoint(searchModel);
    }

    getSBillById(dataParam)
    {
        return this.sbillEndpoint.getSBillByIDEndpoint(dataParam);
    }

    getSBillInitCode(dataParam, code)
    {
        return this.sbillEndpoint.getSBillInitCode(dataParam, code);
    }

    deleteSBill(sbillOrSBillId: number): Observable<BillPost> {
        return this.sbillEndpoint.getDeleteSBillEndpoint<BillPost>(sbillOrSBillId);
    }

    getSBillInit(dataParam){
        return this.sbillEndpoint.getSBillInitEndpoint(dataParam);
    }

    getInitial() {
        return this.sbillEndpoint.getInitialEndpoint();
    }

    refundExchangeBill(id, date){
        return this.sbillEndpoint.refundExchangeBill(id, date);
    }
    CollectCostForCostCenter(){
        return this.sbillEndpoint.getCollectCostForCostCenterurl()
    }
    getBillsCanBeRefunded(billTypeId){
        return this.sbillEndpoint.getBillsCanBeRefunded(billTypeId)
    }
}
