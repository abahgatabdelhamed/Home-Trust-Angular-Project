import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class ItemCatEndpoint extends EndpointFactory {
    private readonly _itemcatUrl: string = "/api/itemCategory/itemCategories";
    private readonly _imageUrl: string = "/api/ItemCategory/UploadItemCategoryImage";

    get itemcatUrl() {
        return this.configurations.baseUrl + this._itemcatUrl;
    }
    get imageUrl() {
        return this.configurations.baseUrl + this._imageUrl;
    }

    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector
    ) {
        super(http, configurations, injector);
    }

    getItemCatsEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl =
            page && pageSize
                ? `${this.itemcatUrl}/${page}/${pageSize}`
                : this.itemcatUrl;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getItemCatsEndpoint(page, pageSize)
                );
            });
    }

    getItemCatInitEndpoint() {
        return this.http.get(`${this.itemcatUrl}/init`);
    }

    getNewItemCatEndpoint<T>(itemcatObject: any): Observable<T> {
        console.log(JSON.stringify(itemcatObject));
        return this.http
            .post<T>(
                this.itemcatUrl,
                JSON.stringify(itemcatObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewItemCatEndpoint(itemcatObject)
                );
            });
    }
    
    
    getNewimageCatEndpoint<T>(file: FormData) : Observable<T> {
       
        return this.http.post<string>(`${this.imageUrl}`,file) .catch(error => {
            return this.handleError(error, () =>
                this.getNewimageCatEndpoint(file)
            );
        });;
    }

    getUpdateItemCatEndpoint<T>(
        itemcatObject: any,
        itemcatId?: number
    ): Observable<T> {
        let endpointUrl = itemcatId
            ? `${this.itemcatUrl}/${itemcatId}`
            : this.itemcatUrl;
        console.log(JSON.stringify(itemcatObject));
        return this.http
            .put<T>(
                endpointUrl,
                JSON.stringify(itemcatObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateItemCatEndpoint(itemcatObject, itemcatId)
                );
            });
    }

    getDeleteItemCatEndpoint<T>(itemcatId: number): Observable<T> {
        let endpointUrl = `${this.itemcatUrl}/${itemcatId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteItemCatEndpoint(itemcatId)
                );
            });
    }
}
