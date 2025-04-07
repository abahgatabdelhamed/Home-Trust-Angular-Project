export interface IStatisticsModel {
    periodStartDate: string;
    periodEndDate: string;
    isCompanyTotal: boolean;
    branchId: number;
    branchName: string;
    revenues: RevenueModel[];
    itemsQty: ItemsQuantityModel[];
    topItems: TopItemModel[];
    topServices: TopServiceModel[];
    topItemFeatures: TopItemFeatureModel[];
    topSoldTogether: TopSoldTogetherModel[];
  }
  
  export interface RevenueModel {
    periodStartDate: string;
    salesRevenue: number;
    returnsTotal: number;
    netSalesRevenue: number;
  }
  
  export interface ItemsQuantityModel {
    periodStartDate: string;
    totalSoldItems: number;
    totalReturnedItems: number;
    netTotalSoldItems: number;
  }
  
  export interface TopItemModel {
    itemId: number;
    itemName: string;
    quantity: number;
    rank: number;
  }
  
  export interface TopServiceModel {
    ServiceTypeId: number;
    ServiceName: string;
    Quantity: number;
    Rank: number;
  }
  
  export interface TopItemFeatureModel {
    ItemId: number;
    ItemName: string;
    FeatureName: string;
    FeatureCount: number;
    Rank: number;
  }
  
  export interface TopSoldTogetherModel {
    ItemId: number;
    ItemName: string;
    FeatureName: string;
    PairCount: number;
    Rank: number;
  }
  

  export interface Branches {
    id: number;
    name: string;
  }
  
