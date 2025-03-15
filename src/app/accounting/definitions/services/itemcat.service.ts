import { Injectable } from "@angular/core";
import { ItemCat } from "../models/itemcat.model";
import { ItemCatEndpoint } from "./itemcat-endpoint.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ItemCatService {
    constructor(private itemcatEndpoint: ItemCatEndpoint) {}

    newItemCat(itemcat: ItemCat) {
        return this.itemcatEndpoint.getNewItemCatEndpoint<ItemCat>(itemcat);
    }

    updateItemCat(itemcat: ItemCat) {
        return this.itemcatEndpoint.getUpdateItemCatEndpoint<ItemCat>(
            itemcat,
            itemcat.id
        );
    }
    uploadImg(itemcat: FormData) {
        return this.itemcatEndpoint.getNewimageCatEndpoint<any>(
            itemcat,
          
        );
    }
    getItemCats(page?: number, pageSize?: number) {
        return this.itemcatEndpoint.getItemCatsEndpoint<ItemCat[]>(
            page,
            pageSize
        );
    }

    getItemCatInit() {
        return this.itemcatEndpoint.getItemCatInitEndpoint();
    }

    deleteItemCat(itemcatOrItemCatId: number): Observable<ItemCat> {
        return this.itemcatEndpoint.getDeleteItemCatEndpoint<ItemCat>(
            itemcatOrItemCatId
        );
    }
}
