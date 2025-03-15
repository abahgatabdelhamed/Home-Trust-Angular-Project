export class ItemCat {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor( public id?: number,
        public nameAr?: string,
        public nameEn?: string,
        public notes?: string,
        public color?:any,
        public imageUrl?:any,
        public itemCategoryParentId?: number,
        public itemCategoryParentName?: string,
        public code?: string) {
    }

  
}
