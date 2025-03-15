export interface ItemInterface {
    id?: number;
     itemIndex:  number;
     code: string;
     nameAr: string;
     nameEn: string;
     notes: string;
     itemCategoryId: number;
     itemCategoryName: string;
     vatTypeId: number;
     vatType: any;
     /*vatTypes:{vatTypeId: number,
        isDefault: boolean}[]
     */
    vatTypeTwoId?: number;
    imagePath: string;
     itemPeopleId: any[];
     itemPeople?: any;
     itemUnits: any[];
     offerItems: any[];
     itemFeatures: any[];
     specification: string;
     vatTypeName: string;
     realQuantity: number;
    initialQuantity?: number;
    offerId?: number;
    isOffer?: boolean;
}

export class Item {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public itemIndex: number;
    public id: number;
    public code: string;
    public nameAr: string;
    public nameEn: string;
    public notes: string;
    public itemCategoryId: number;
    public itemCategoryName: string;
    public vatTypeId: number;
    public vatType: any;
    public imagePath: string;
    public itemPeopleId: any[];
    public itemPeople?: any;
    public isOffer?: boolean;

    public itemUnits: any[];
    public itemFeatures: any[];
    public offerItems?: Item[];
    public specification: string;
    public vatTypeName: string;
    public offerId?: number;
    public isOfferDisplay?: string;
}


export class ItemInit {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public vatTypes: any[];
    public people: any[];
    public itemCategories: any[];
}
