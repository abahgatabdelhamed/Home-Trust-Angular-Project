import { Injectable } from "@angular/core";
import { BillPost } from "../models/bill-post.model";
import { SBillEndpoint } from "./sbill-endpoint.service";
import { Observable } from "rxjs/Observable";
import { ServiceTypeEndpoint } from "./service-type-endpoint.service";
import { ServiceType } from "../models/service-type.model";

@Injectable()
export class ServiceTypeService {
    constructor(private serviceTypeEndpoint: ServiceTypeEndpoint) {}

    getAllServiceTypes() {
        return this.serviceTypeEndpoint.getAllServiceTypesEndpoint();
    }

    addServiceType(serviceType: ServiceType) {
        return this.serviceTypeEndpoint.addNewServiceType(serviceType);
    }

    updateServiceType(serviceType: ServiceType, id) {
        return this.serviceTypeEndpoint.updateServiceType(serviceType, id);
    }

    deleteServiceType(id) {
        return this.serviceTypeEndpoint.deleteServiceTypeEndpoint(id);
    }


    getAllVatTypes() {
        return this.serviceTypeEndpoint.getVatTypes();
    }
}
