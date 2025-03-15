export class ItemUnit {
     id: number;
     name: string;
     nameEn?:string
     isDefaultPurc: boolean;
     isDefaultSale: boolean;
     transferAmount: number;
     itemId: number;
     price: number;
     cost: number;
     barCode: string;
     notes: string;
     isWithVat: boolean;
     isFeature:boolean;
     discountPrice?:number
}

export const ItemUnitInitialValue = {
     id: 0,
     name: '',
     isDefaultPurc: false,
     isDefaultSale: false,
     transferAmount: 0,
     itemId: 0,
     price: 0,
     cost: 0,
     barCode: '',
     notes: '',
     isWithVat: false,
     isFeature:null,
     
}
