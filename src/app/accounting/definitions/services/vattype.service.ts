import { VatType } from "./../models/vattype.model";
import { VatTypeEndpointService } from "./vattype-endpoint.service";
import { Injectable } from "@angular/core";
import { VatTypeInterface } from "../models/vat-type.model";

@Injectable()
export class VatTypeService {
    constructor(private vattypeEndpointService: VatTypeEndpointService) {}

    getVatTypes() {
        return this.vattypeEndpointService.getVatTypes();
    }

    getCurrentVatType(id) {
        return this.vattypeEndpointService.getCurrentVatType(id);
    }

    newVatType(vattype: VatTypeInterface) {
        return this.vattypeEndpointService.addVatType(vattype);
    }

    updatevattype(vattype: VatTypeInterface, id) {
        return this.vattypeEndpointService.editVatType(vattype, id);
    }

    deletevattype(id: number) {
        return this.vattypeEndpointService.deleteVatType(id);
    }
}
