import { Statement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Statments } from '../models/statments';
import { StatmentsEndpointService } from './statments-endpoint.service';



@Injectable()
export class StatmentsService {

  constructor(private endpoint: StatmentsEndpointService) { }
  GetStatments(billId,id,query,pageNumber, pageSize,searchModel) {
    return this.endpoint.getStatments(billId,id,query,pageNumber, pageSize,searchModel)
  }
  AddStatment(statment: Statments) {
    return this.endpoint.AddStatment(statment)
  }
  AddExitStatment(statment: Statments) {
     return this.endpoint.AddExitStatment(statment)
   }
   
  GetStatmentById(id) {
    return this.endpoint.getStatmentbyId(id)

  }
  GetgetAvailableBill(){
    return this.endpoint.getAvailableBill()
  }
  GetBillsThatHaveStatement(){
     return this.endpoint.getBillsThatHaveStatement()
  }
  SearchBillsThatHaveStatement(code){
    return this.endpoint.SearchBillsThatHaveStatement(code)
 }
}
