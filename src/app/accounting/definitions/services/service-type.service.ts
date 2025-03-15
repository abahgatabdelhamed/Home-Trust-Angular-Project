import { Injectable } from "@angular/core";
import { ServiceTypeEndpoint } from "./service-type-endpoint.service";
import { ServiceType } from "../../sales/models/service-type.model";

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
    getVatTypesByID(id) {
        return this.serviceTypeEndpoint.getVatTypesbyid(id);
    }
}
