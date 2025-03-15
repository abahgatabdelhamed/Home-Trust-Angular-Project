import { Item } from './../models/item.model';
import { ItemEndpointService } from "./item-endpoint.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable()
export class ItemService {
    constructor(private itemEndpointService: ItemEndpointService) {
    }

    getItems(page?, pageSize?) {
        return this.itemEndpointService.getItems(page, pageSize);
    }

    getQuantityReport() {
        return this.itemEndpointService.getQuantityReport();
    }

    getCurrentItem(id) {
        return this.itemEndpointService.getCurrentItem(id);
    }

    newItemCat(item: any) {
        return this.itemEndpointService.addItem(item);
    }


    uploadFile(item: any) {
        return this.itemEndpointService.uploadFile(item);
    }

    updateitem(item: any, id) {
        return this.itemEndpointService.editItem(item, id)
    }

    deleteitem(id: number){
        return this.itemEndpointService.deleteItem(id)
    }

    transaction(id: number,isService) {
        return this.itemEndpointService.transaction(id,isService)
    }


    getInitItem() {
        return this.itemEndpointService.getInitItem();
    }

    getAssociatedUnits(id) {
        return this.itemEndpointService.getAssociatedUnitsEndpoint(id);
    }

    getSearchItemEndpointExchange(name: string) {
        return this.itemEndpointService.getSearchItemEndpointExchange(name);
    }
}
