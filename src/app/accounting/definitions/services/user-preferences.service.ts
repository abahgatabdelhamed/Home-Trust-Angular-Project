import { SupplierEndpointService } from "./supplier-endpoint.service";
import { Supplier } from "./../models/supplier.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "../../../services/endpoint-factory.service";
import { ConfigurationService } from "../../../services/configuration.service";

@Injectable()
export class UserPreferencesService {
    constructor() {}

    getAllUserPrefernces() {
        try {
            const theme = localStorage.getItem("theme");
            const permissions = localStorage.getItem("user_permissions");
            const remember_me = localStorage.getItem("remember_me");
            const result = { theme, permissions, remember_me };
            return result;
        } catch (error) {
            alert("you are in private mod");
        }
    }

    getTheme() {
        if (localStorage.getItem("theme") == null) return "blue";
        const theme = localStorage.getItem("theme")
        console.log("is", theme);
        if (theme == "default") {
            return "blue";
        } else {
            return theme;
        }
    }
}
