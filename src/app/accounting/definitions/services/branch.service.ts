import { Injectable } from "@angular/core";
import { ItemCat } from "../models/itemcat.model";
import { ItemCatEndpoint } from "./itemcat-endpoint.service";
import { Observable } from "rxjs/Observable";
import { BranchEndpoint } from "./branch-endpoint.service";
import { Branch, BranchInterface } from "../models/branch.model";

@Injectable()
export class BranchService {
    constructor(private branchEndpoint: BranchEndpoint) {}

    getAllBranches() {
        return this.branchEndpoint.getBranchesEndpoint();
    }
    getWarehouseInventory(b,c) {
        return this.branchEndpoint.getWarehouseInventoryEndpoint(b,c);
    }
    getCurrentBranch(id: number) {
        return this.branchEndpoint.getCurrentBranchEndpoint(id);
    }

    addBranch(branch: BranchInterface) {
        return this.branchEndpoint.addBranchEndpoint(branch);
    }

    editBranch(branch: BranchInterface, id: number) {
        return this.branchEndpoint.editBranchEndpoint(branch, id);
    }

    deleteBranch(id: number) {
        return this.branchEndpoint.deleteBranchEndpoint(id);
    }


    getDefaultBranch(){
        return this.branchEndpoint.getDefaultBranchEndpoint();
    }

    getItemsUnitsBranch(branchId, costCenterId=null, query='', pageSize=20, pageNumber=1){
        return this.branchEndpoint.getItemsUnitsBranch(branchId,costCenterId, query, pageSize, pageNumber)
    }

    addItemUnitBranch(objectToPost){
        return this.branchEndpoint.addItemUnitBranch(objectToPost)
    }

    saveItemUnitBranch(objectToSave){
        return this.branchEndpoint.saveItemUnitBranch(objectToSave)
    }
}
