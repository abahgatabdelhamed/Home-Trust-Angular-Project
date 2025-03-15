import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class SettingsEndpoint extends EndpointFactory {
    private readonly _settingsUrl: string = "/api/setting";
    private  readonly _authSerials:string ="/api/Setting/GetLastVersion"
    get authSerialsUrl(){
        return this.configurations.baseUrl + this._authSerials
    }

    get settingsUrl() { return this.configurations.baseUrl + this._settingsUrl; }


    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getCurrentVersion() {
        let endpointUrl = this.settingsUrl + "/GetCurrentVersion";

        return this.http.get(endpointUrl)
            .catch(error => {
                return this.handleError(error, () => this.getCurrentVersion());
            });
    }

    getCurrentVersionCode() {
        let endpointUrl = this.settingsUrl + "/GetCurrentVersionCode";

        return this.http.get(endpointUrl)
            .catch(error => {
                return this.handleError(error, () => this.getCurrentVersionCode());
            });
    }

    downloadBackup(name){
        return this.http.get(`${this.configurations.baseUrl}/download/${name}`,{responseType:'application/zip' as 'json'});
       
    }
    getAllBackups() {
        return this.http.get(this.settingsUrl + "/GetAllBackups").catch(error => {
            return this.handleError(error, () => this.getAllBackups());
        });
    }

    newBackup() {
        return this.http.get(this.settingsUrl + "/CreateBackup").catch(error => {
            return this.handleError(error, () => this.newBackup());
        });
    }

    register(serial) {
        return this.http.get(this.settingsUrl + "/Register?serial=" + serial).catch(error => {
            return this.handleError(error, () => this.register(serial));
        });
    }

    restoreBackup(item) {
        return this.http.get(this.settingsUrl + "/Restore?name=" + item).catch(error => {
            return this.handleError(error, () => this.newBackup());
        });
    }

    getLatestVersion() {

        return this.http.get(`${this.authSerialsUrl}`);
    }

    getSetting() {
        let endpointUrl = this.settingsUrl + "/GetVatEnableSetting";

        return this.http.get(endpointUrl)
            .catch(error => {
                return this.handleError(error, () => this.getSetting());
            });
    }

    setVatEnableSetting(setting) {
        let endpointUrl = this.settingsUrl + "/SetVatEnableSetting";

        return this.http.put(endpointUrl, setting,this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.setVatEnableSetting(setting));
            });

    }

    uploadLogo(file) {
        return this.http.post<string>(`${this.settingsUrl}/UploadLogo`, file);
    }

    uploadFile(file) {
        return this.http.post<string>(`${this.settingsUrl}/UploadDatabaseBackup`, file);
    }

    deleteLogo(){
        return this.http.delete(`${this.settingsUrl}/DeleteLogo`)
    }
}
