export class BillItem{
    constructor(public itemCode?: string,
                public nameAr?: string,
                public notes?: string,
                public nameEn?: string,
                public quantity?: number,
                public price?: number,
                public itemUnitName?: string,
                public itemUnitId?: number,
                public totalPrice?: number, ){
                    this.itemCode = itemCode ? itemCode : '';
                    this.nameAr = nameAr ? nameAr : '';
                    this.nameEn = nameEn ? nameEn : '';
                    this.notes = notes ? notes: '';
                    this.quantity = quantity ? quantity : 0;
                    this.price = price ? price : 0;
                    this.itemUnitName = itemUnitName ? itemUnitName : '';
                    this.itemUnitId = itemUnitId ? itemUnitId : 0;
                    this.totalPrice = this.quantity * this.price;

    }
}