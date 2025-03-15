import { Injectable } from "@angular/core";
import { BillType } from "../models/billtype.model";
import { BillTypeEndpoint } from "./billtype-endpoint.service";
import { Observable } from "rxjs/Observable";
import { BillEndpoint } from "./bill-endpoint.service";

@Injectable()
export class BillService {
    constructor(private billEndpointService: BillEndpoint) {}

    getAllBills() {
        return this.billEndpointService.getAllBillsEndpoint();
    }
}
