import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { Discount } from "../models/discount.model";

@Injectable()
export class DiscountManagementEndPoint extends EndpointFactory {
    private readonly _Url: string = "/api/Item/ManageDiscountPrices";
    private readonly _resetURL:string="/api/Item/ResetDiscountPrices"
    private readonly _EnableUrl: string = "/api/Item/EnableDiscount";
    private readonly _statusURL:string="/api/Item/GetDiscountStatus"

    get Url() {
        return this.configurations.baseUrl + this._Url;
    }
    get ResetUrl() {
        return this.configurations.baseUrl + this._resetURL;
    }
    get EnableUrl() {
        return this.configurations.baseUrl + this._EnableUrl;
    }
    get statusURL() {
        return this.configurations.baseUrl + this._statusURL;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    PostDiscount(obj:Discount) {

        return this.http.post(this.Url,this.convertToFormData(obj));
    }
    ResetDiscount() {

        return this.http.post(this.ResetUrl,{});
    }
    EnableDiscount(Enable:boolean) {

        return this.http.post(`${this.EnableUrl}?enableDiscount=${Enable}`,{});
    }
    getStatusDiscount() {

        return this.http.post<any>(this.statusURL,{});
    }
    convertToFormData(obj:Discount){
           let postDiscount:FormData=new FormData()
           obj.ItemCategoriesId.forEach(e=>{
            postDiscount.append('ItemCategoriesId',e.toString())
           })
           obj.ItemsId.forEach(e=>{
            postDiscount.append('ItemsId',e.toString())
           })
           obj.ServicesId.forEach(e=>{
            postDiscount.append('ServicesId',e.toString())
           })
           postDiscount.append('AllItemsAndServices',obj.AllItemsAndServices.toString())
           postDiscount.append('PercentageValue',obj.PercentageValue.toString())
           postDiscount.append('DiscountedValue',obj.DiscountedValue.toString())
           return postDiscount
    }
}
