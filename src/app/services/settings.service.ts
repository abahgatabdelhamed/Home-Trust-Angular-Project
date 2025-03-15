// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { SettingsEndpoint } from './settings-endpoint.service';

@Injectable()
export class SettingsService {

    constructor(private settingsEndpoint: SettingsEndpoint) {

    }


    public getCurrentVersion() {
        return this.settingsEndpoint.getCurrentVersion();
    }

    public getCurrentVersionCode() {
        return this.settingsEndpoint.getCurrentVersionCode();
    }

    public getLatestVersion() {
        return this.settingsEndpoint.getLatestVersion();
    }

    public getAllBackups() {
        return this.settingsEndpoint.getAllBackups();    
    }

    public newBackup() {
        return this.settingsEndpoint.newBackup();    
    }

    public register(serial) {
        return this.settingsEndpoint.register(serial);
    }

    public restoreBackup(item) {
        return this.settingsEndpoint.restoreBackup(item);    
    }

    public getSetting() {
        return this.settingsEndpoint.getSetting();    
    }

    public setVatEnableSetting(setting) {
        return this.settingsEndpoint.setVatEnableSetting(setting);    
    }

    public uploadLogo(file) {
        return this.settingsEndpoint.uploadLogo(file);
    }
    public uploadFile(file) {
        return this.settingsEndpoint.uploadFile(file);
    }
    public downloadBackup(url){
        return this.settingsEndpoint.downloadBackup(url)
    }
    public deleteLogo(){
        return this.settingsEndpoint.deleteLogo();
    }
    
}
