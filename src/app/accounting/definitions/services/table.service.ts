import { Injectable } from "@angular/core";
import { ItemCat } from "../models/itemcat.model";
import { ItemCatEndpoint } from "./itemcat-endpoint.service";
import { Observable } from "rxjs/Observable";
import { BranchEndpoint } from "./branch-endpoint.service";
import { Branch, BranchInterface } from "../models/branch.model";
import { TableEndpoint } from "./table-endpoint.service";
import { Table, TableInterface } from "../models/table.model";

@Injectable()
export class TablesService {
    constructor(private tablesEndpoint: TableEndpoint) {}

    getAllTables(branchId) {
        return this.tablesEndpoint.getTablesEndpoint(branchId);
    }
 
    getTablebyId(id: number) {
        return this.tablesEndpoint.gettableEndpoint(id);
    }

    addTable(t: Table) {
        return this.tablesEndpoint.addTableEndpoint(t);
    }

    editTable( t: Table) {
        return this.tablesEndpoint.editTableEndpoint( t);
    }

    deleteTable(id: number) {
        return this.tablesEndpoint.deleteTableEndpoint(id);
    }


    getDefaultBranch(){
        return this.tablesEndpoint.getDefaultBranchEndpoint();
    }

    getItemsUnitsBranch(branchId, costCenterId=null, query='', pageSize=20, pageNumber=1){
        return this.tablesEndpoint.getItemsUnitsBranch(branchId,costCenterId, query, pageSize, pageNumber)
    }

    addItemUnitBranch(objectToPost){
        return this.tablesEndpoint.addItemUnitBranch(objectToPost)
    }

    saveItemUnitBranch(objectToSave){
        return this.tablesEndpoint.saveItemUnitBranch(objectToSave)
    }
}
