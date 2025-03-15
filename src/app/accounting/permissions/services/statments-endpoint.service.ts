import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ConfigurationService } from '../../../services/configuration.service';
import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { STBill } from '../models/sBill';
import { Statments } from '../models/statments';

import { Observable } from "rxjs/Observable";
@Injectable()
export class StatmentsEndpointService extends EndpointFactory{ 
  _addURL = '/api/Statement/AddInterStatement';
  _addExitUrl='/api/Statement/AddExitStatement';
  _urlID='/api/Statement/GetStatement';
  _urlStatments='/api/Statement/GetStatements';
  _urlBillAddStatements='/api/Statement/GetAvailableBillsForMakingStatements'
  _urlBillsThatHaveStatement='/api/Statement/GetBillsThatHaveStatement'
  _urlSearchBillsThatHaveStatement='/api/Statement/SearchBillsThatHaveStatement'
  
  get url() {
      return this.configurations.baseUrl + this._urlStatments;
  }

  get urlID() {
      return this.configurations.baseUrl + this._urlID;
  }

  get addExitUrl() {
      return this.configurations.baseUrl + this._addExitUrl;
  }

  get addURL() {
    return this.configurations.baseUrl + this._addURL;
}
  get AvailableBillStatement(){
      return this.configurations.baseUrl + this._urlBillAddStatements
  }
get BillsThatHaveStatementURL(){
    return this.configurations.baseUrl+this._urlBillsThatHaveStatement
}
get SearchBillsThatHaveStatementURL(){
    return this.configurations.baseUrl+this._urlSearchBillsThatHaveStatement
}
  constructor(   http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector) {
      super(http, configurations, injector);
     }
   
   
  getStatments(billId,id,query,pageNumber,pageSize,searchModel) {
    var f = new Date(searchModel['from']).toJSON();
    var t = new Date(searchModel['to']).toJSON();
      return this.http.get<any>(`${this.url}?type=${id}&billId=${billId}&query=${query}&fromDate=${f}&toDate=${t}&&pageNumber=${pageNumber}&pageSize=${pageSize}`).catch(error => {
          return this.handleError(error, () => this.getStatments(billId,id,query,pageNumber,pageSize,searchModel));
      });
  }

  AddStatment(statments:Statments) {
      return this.http.post<Statments>(`${this.addURL}`, statments).catch(error => {
          return this.handleError(error, () => this.AddStatment(statments));
      });
  }
  AddExitStatment(statments:Statments) {
    return this.http.post<Statments>(`${this.addExitUrl}`, statments).catch(error => {
        return this.handleError(error, () => this.AddExitStatment(statments));
    });
}

  getStatmentbyId(id) {
    return this.http.get<any>(`${this.urlID}?id=${id}`).catch(error => {
        return this.handleError(error, () => this.getStatmentbyId(id));
    });
}
getAvailableBill(){
    return this.http.get<STBill[]>(`${this.AvailableBillStatement}`).catch(error =>{
        return this.handleError(error,() => this.getAvailableBill())
    }   )
}
getBillsThatHaveStatement(){
    return this.http.get<STBill[]>(`${this.BillsThatHaveStatementURL}`).catch(error =>{
        return this.handleError(error,() => this.getBillsThatHaveStatement())
    }   )
}
SearchBillsThatHaveStatement<T>(invoiceCode: string):Observable<any[]>{
       // let endpointUrl = this._Url;
       let endpointUrl = this.SearchBillsThatHaveStatementURL
       let data = {'invoiceCode': invoiceCode };
       let headers = this.getRequestHeaders()
       headers['params'] =  data
       return this.http
       .get<T>(endpointUrl, headers)
       .catch(error => {
           return this.handleError(error, () =>
               this.SearchBillsThatHaveStatement(invoiceCode)
           );
       });
}
}
