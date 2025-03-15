import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";
import { ServiceType } from "../models/service-type.model";

@Injectable()
export class ServiceTypeEndpoint extends EndpointFactory {
    private readonly _serviceTypeUrl: string = "/api/serviceType/serviceTypes";
    private readonly _vatTypeUrl = '/api/vatType/vatTypes'

    get serviceTypeUrl() {
        return this.configurations.baseUrl + this._serviceTypeUrl;
    }

    get vatTypeUrl() {
        return this.configurations.baseUrl + this._vatTypeUrl;
    }

    getVatTypes() {
        return this.http.get<any>(`${this.vatTypeUrl}/init`).catch(error => {
            return this.handleError(error, () =>
                this.getVatTypes()
            );
        });
    }

    getAllServiceTypesEndpoint() {
        return this.http.get<ServiceType>(this.serviceTypeUrl).catch(error => {
            return this.handleError(error, () =>
                this.getAllServiceTypesEndpoint()
            );
        });
    }

    addNewServiceType(serviceType: ServiceType) {
        return this.http
            .post<ServiceType>(this.serviceTypeUrl, serviceType)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getAllServiceTypesEndpoint()
                );
            });
    }

    updateServiceType(serviceType: ServiceType, id) {
        return this.http
            .put<ServiceType>(`${this.serviceTypeUrl}/${id}`, serviceType)
            .catch(error => {
                return this.handleError(error, () =>
                    this.updateServiceType(serviceType, id)
                );
            });
    }

    deleteServiceTypeEndpoint(id: number) {
        return this.http
            .delete<ServiceType>(`${this.serviceTypeUrl}/${id}`)
            .catch(error => {
                return this.handleError(error, () =>
                    this.getAllServiceTypesEndpoint()
                );
            });
    }
}
