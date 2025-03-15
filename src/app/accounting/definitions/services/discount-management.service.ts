import { Injectable } from "@angular/core";
import { BillType } from "../models/billtype.model";
import { BillTypeEndpoint } from "./billtype-endpoint.service";
import { Observable } from "rxjs/Observable";
import { BillEndpoint } from "./bill-endpoint.service";
import { DiscountManagementEndPoint } from "./discount-management-endpoint.service";
import { Discount } from "../models/discount.model";

@Injectable()
export class DiscountManagementService {
    constructor(private discountManagementService: DiscountManagementEndPoint) {}

    Discount(obj:Discount) {
        return this.discountManagementService.PostDiscount(obj);
    }
    Reset() {
        return this.discountManagementService.ResetDiscount();
    }
    getDiscoutnStatus(){

        return this.discountManagementService.getStatusDiscount();
    }
    EnableDisableDiscount(enable){

        return this.discountManagementService.EnableDiscount(enable);
    }
}
