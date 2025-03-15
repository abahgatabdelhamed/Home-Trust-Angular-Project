import { Injectable } from '@angular/core';
import { BillType } from '../models/billtype.model';
import { BillTypeEndpoint } from './billtype-endpoint.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BillTypeService {

    constructor(private billtypeEndpoint: BillTypeEndpoint) {

    }

    newBillType(billtype: BillType) {
        return this.billtypeEndpoint.getNewBillTypeEndpoint<BillType>(billtype);
    }

    updateBillType(billtype: BillType) {
        return this.billtypeEndpoint.getUpdateBillTypeEndpoint<BillType>(billtype, billtype.id);
    }

    getBillTypes(page?: number, pageSize?: number) {

        return this.billtypeEndpoint.getBillTypesEndpoint<BillType[]>(page, pageSize);
    }

    deleteBillType(billtypeOrBillTypeId: number): Observable<BillType> {
        return this.billtypeEndpoint.getDeleteBillTypeEndpoint<BillType>(billtypeOrBillTypeId);
    }
}
