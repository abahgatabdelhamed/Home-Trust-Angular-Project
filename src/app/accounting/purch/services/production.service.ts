import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigurationService } from "../../../services/configuration.service";
import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { ProductionBill, ProductionBillItem } from '../models/production-bill.model';
import { Observable } from 'rxjs/Observable';
import { Pagination } from '../../shared/models/pagination.model';
import { DatePipe } from '@angular/common';

@Injectable()
export class ProductionService  extends EndpointFactory {
  private _addUrl: string = "/api/Bill/AddProductionBill";
  private _allUrl: string = "/api/Bill/GetProductionBills";
  private _getByIdUrl: string = "/api/Bill/GetProductionBillById";

  private get addUrl(): string {
    return this.configurations.baseUrl + this._addUrl;
  }

  private get allUrl(): string {
    return this.configurations.baseUrl + this._allUrl;
  }

  private get getByIdUrl(): string {
    return this.configurations.baseUrl + this._getByIdUrl;
  }

  constructor(http: HttpClient, configurations: ConfigurationService,
    injector: Injector) {
      super(http, configurations, injector);
     }

   addItem(modelToAdd: ProductionBill): Observable<ProductionBill> {
      return this.http.post<ProductionBill>(this.addUrl, modelToAdd).catch(error => {
        return this.handleError(error, () => this.addItem(modelToAdd));
      });
    }

    getItemById(id): Observable<ProductionBill>{
      let params = new HttpParams();
      params = params.append('id', id);
      return this.http.get<ProductionBill>(this.getByIdUrl, { params }).catch(error => {
        return this.handleError(error, () => this.getItemById(id));
      });
    }

    getAllItems(searchModel,searchQuery:any='', branchId:any= null, costCenterId:any=null, 
    pageSize: any=-1,  page: any=-1): Observable<Pagination<ProductionBill>>{
      let p :DatePipe= new DatePipe('en-US')
      if(searchModel.from)
      var f =  p.transform(new Date(searchModel['from']),'short');
      if(searchModel.to)
      var t = p.transform(new Date(searchModel['to']),'short');
     
      let params:HttpParams = new HttpParams();
      params = params.set('query', searchQuery).set('branchId', branchId)
      .set('costCenterId', costCenterId)
      .set('pageNumber', page).set('pageSize', pageSize).set('fromDate',f).set('toDate',t);

      return this.http.get<ProductionBill>(this.allUrl, {params: params}).catch(error => {
        return this.handleError(error, () => this.getAllItems(searchModel));
      });
    }

}
