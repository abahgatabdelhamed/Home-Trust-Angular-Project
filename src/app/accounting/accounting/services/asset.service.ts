import { Injectable } from '@angular/core';
import { Asset } from '../models/asset.model';
import { CostAsset } from '../models/costasset';
import { AssetEndpointService } from './asset-endpoint.service';

@Injectable()
export class AssetService {

  constructor(private endpoint: AssetEndpointService) { }
  GetAssets(query,pageNumber, pageSize) {
    return this.endpoint.getAssets(query,pageNumber, pageSize)
  }
  AddAsset(asset: Asset) {
   // console.log(this.endpoint.AddAsset(asset))
    return this.endpoint.AddAsset(asset)
  }
  EditAsset(asset: Asset) {
    return this.endpoint.EditAsset(asset)
  }
  GetAssetById(id) {
    return this.endpoint.getAssetsbyId(id)

  }
  getTransactionsAssets(assetId,pageNumber, pageSize){
    return this.endpoint.getTransactionsAssets(assetId,pageNumber,pageSize)
  }
  GetDepreciationTransactionsGetAssetId(id) {
    return this.endpoint.GetDepreciationTransactionsGetAssetId(id)
  }
  GetCostCenter(id){
    return this.endpoint.GetCostCenter(id)
  }
  DeleteCost(id){
    return this.endpoint.DeleteCostCenter(id)
  }
  AddBranchesCCDepreciationAsset(assetid,costid,perc){
    return this.endpoint.AddBranchesCCDepreciationAsset(assetid,costid,perc)
  }
  AddbranchAsset(branchid,assetid){
    return this.endpoint.AddBrancheAsset(branchid,assetid)
  }
  EditbranchAsset(branchid,assetid){
    return this.endpoint.EditBrancheAsset(branchid,assetid)
  }
  EditCost(cost:CostAsset){
    return this.endpoint.EditCostinAsset(cost)
  }
  
}
