
import { ReportsEndpointService } from './reports-endpoint.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportsService {
//  private serviceItemSearch: ItemSearchService
    constructor(private ServiceReportsEndpointService: ReportsEndpointService) { }

    PostReportsDueAmount(peopleIds: number[]) {
     return   this.ServiceReportsEndpointService.postDueAmountReport(peopleIds)
    }

    PostSolidItemReport(fromDate: Date, toDate: Date, itemCategorie: number[], items: number[],services:number[],branchId?,userId?) {

       return this.ServiceReportsEndpointService.postSolidItemReport(fromDate, toDate, itemCategorie, items,services,branchId,userId)
    }

    getAllBranches() {
        return this.ServiceReportsEndpointService.getAllBranch()
    }

    getAllUsers() {
        return this.ServiceReportsEndpointService.getAllUsers()
    }
    getAllCategoriesItem(){
        return this.ServiceReportsEndpointService.getAllItemCategories()
    }
    getAllShifts(q,s,e,offset,size,user,branch){
        return this.ServiceReportsEndpointService.getAllShifts(q,s,e,offset,size,user,branch)
    }
    getReportShift(id){
        return this.ServiceReportsEndpointService.getReportShift(id)
    }
    getStatistics(from , to){
        return this.ServiceReportsEndpointService.getStatistics(from,to)
    }
    getCostCenterReports(fromDate:Date, toDate:Date,branchId:number, ccId:number){
        return this.ServiceReportsEndpointService.costCenterReport(fromDate, toDate,branchId, ccId)
    }
    getCostCenterProdReports(fromDate:Date, toDate:Date,branchId:number){
        return this.ServiceReportsEndpointService.costCenterProdReport(fromDate, toDate, branchId)
    }
}
