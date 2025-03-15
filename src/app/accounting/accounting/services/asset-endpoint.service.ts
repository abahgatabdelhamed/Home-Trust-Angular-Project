import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ConfigurationService } from '../../../services/configuration.service';
import { EndpointFactory } from '../../../services/endpoint-factory.service';
import { Asset } from '../models/asset.model';
import { CostAsset } from '../models/costasset';

@Injectable()
export class AssetEndpointService extends EndpointFactory{
  _url = "/api/Asset/GetAssets";
  // api/receiptDocument/init
  _branchurl="/api/BranchesCCDepreciationAsset/AddBranchDepreciationAsset"
  _editURL = '/api/Asset/EditAsset';
  _addURL = '/api/Asset/AddAsset';
  _editCostUrl="/api/BranchesCCDepreciationAsset/EditBranchesCCDepreciationAsset"
  _urlID='/api/Asset/GetAssetById';
  _urlDepreciation='/api/Asset/GetDepreciationTransactionsGetAssetId';
  _urlCCDeprecation='/api/BranchesCCDepreciationAsset/AddBranchesCCDepreciationAsset'
  _urlCostCenter='/api/CostCenter/GetCostsCentersForBranch'
  _urlAddCost='/api/CostCenter/AddCostCenter'
  _urldeleteCost='/api/BranchesCCDepreciationAsset/DeleteCCDepreciationAsset'
  _urlEditBranch='/api/BranchesCCDepreciationAsset/EditBranchDepreciationAsset'
  _urltransactions='/api/Asset/GetDepreciationTransactionsGetAssetId'
  get urlDepreciationAsset(){
    return  this.configurations.baseUrl+ this._urlDepreciation
  }
  get urlTransactionsAsset(){
    return  this.configurations.baseUrl+ this._urltransactions
  }
  get url() {
      return this.configurations.baseUrl + this._url;
  }

  get urlID() {
      return this.configurations.baseUrl + this._urlID;
  }

  get editURL() {
      return this.configurations.baseUrl + this._editURL;
  }

  get addURL() {
    return this.configurations.baseUrl + this._addURL;
}
  get CCDeprecation(){
    return this.configurations.baseUrl +this._urlCCDeprecation;
  }
  get CostCenterUrl(){
    return this.configurations.baseUrl+this._urlCostCenter
  }
  get AddCostUrl(){
    return this.configurations.baseUrl+this._urlAddCost
  }
  get EditCostUrl(){
    return this.configurations.baseUrl+this._editCostUrl
  }
  get addbranch(){
    return this.configurations.baseUrl+this._branchurl
  }
  get EditbranchUrl(){
    return this.configurations.baseUrl+this._urlEditBranch
  }
  get DeleteCostUrl(){
    return this.configurations.baseUrl+this._urldeleteCost
  }
  constructor(   http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector) {
      super(http, configurations, injector);
     }
   
   
   getAssets(query,pageNumber,pageSize) {
      return this.http.get<any>(`${this.url}?query=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}`).catch(error => {
          return this.handleError(error, () => this.getAssets(query,pageNumber,pageSize));
      });
  }
  getTransactionsAssets(assetId,pageNumber,pageSize) {
    return this.http.get<any>(`${this.urlTransactionsAsset}?&pageNumber=${pageNumber}&pageSize=${pageSize}&&assetId=${assetId}`).catch(error => {
        return this.handleError(error, () => this.getTransactionsAssets(assetId,pageNumber,pageSize));
    });
}
  AddAsset(asset:Asset) {
      return this.http.post<Asset>(`${this.addURL}`, asset).catch(error => {
          return this.handleError(error, () => this.AddAsset(asset));
      });
  }

  EditAsset(asset:Asset) {
      return this.http.post<Asset>(`${this.editURL}`, asset).catch(error => {
          return this.handleError(error, () => this.EditAsset(asset));
      });
  }
  getAssetsbyId(id) {
    return this.http.get<any>(`${this.urlID}?id=${id}`).catch(error => {
        return this.handleError(error, () => this.getAssetsbyId(id));
    });
}
GetDepreciationTransactionsGetAssetId(id){
return this.http.get<any>(`${this.urlDepreciationAsset}?assetId=${id}`).catch(error => {
  return this.handleError(error, () => this.GetDepreciationTransactionsGetAssetId(id));
});
}
GetCostCenter(id){
  return this.http.get<any>(`${this.CostCenterUrl}?branchId=${id}`).catch(error => {
    return this.handleError(error, () => this.GetCostCenter(id));
  });
  }

  DeleteCostCenter(id){
    return this.http.delete<any>(`${this.DeleteCostUrl}?id=${id}`).catch(error => {
      return this.handleError(error, () => this.DeleteCostCenter(id));
    });
    }
  AddCostCenter(Cost){
    return this.http.post<any>(`${this.AddCostUrl}`,{
      "nameAr": Cost.nameAr,
      "nameEn": Cost.nameEn,
      "branchId": Cost.branchId,
      "templateTreeId": 0,
      "startDate": "2022-03-17T21:04:30.119Z",
      "itemId": 0
    }).catch(error => {
      return this.handleError(error, () => this.AddCostCenter(Cost));
    });
    }
AddBranchesCCDepreciationAsset(assetid,costid,perc){
  return this.http.post<any>(`${this.CCDeprecation}`,{
    "assetId": assetid,
    "costCenterId": costid,
    "perc": perc
  }).catch(error => {
    return this.handleError(error, () => this.AddBranchesCCDepreciationAsset(assetid,costid,perc));
  });
  }
  AddBrancheAsset(branchid,assetid){
    return this.http.post<any>(`${this.addbranch}`,{
    "branchId": branchid,
    "assetId": assetid}).catch(error => {
      return this.handleError(error, () => this.AddBrancheAsset(branchid,assetid));
    });
    }
    EditBrancheAsset(branchid,assetid){
      return this.http.put<any>(`${this.EditbranchUrl}`,{
      "branchId": branchid,
      "assetId": assetid}).catch(error => {
        return this.handleError(error, () => this.EditBrancheAsset(branchid,assetid));
      });
      }
  EditCostinAsset(cost:CostAsset){
    return this.http.put<CostAsset>(`${this.EditCostUrl}`,cost).catch(error => {
      return this.handleError(error, () => this.EditCostinAsset(cost));
    })

    
  }
}
