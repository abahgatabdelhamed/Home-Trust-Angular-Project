// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { RoleEditorComponent } from "./role-editor.component";
import { SettingsService } from "../../services/settings.service"

@Component({
    selector: 'backup-management',
    templateUrl: './backup-management.component.html',
    styleUrls: ['./backup-management.component.css']
})
export class BackupManagementComponent implements OnInit, AfterViewInit {
    backups=[];
    loadingIndicator: boolean;  
    fileToUpload: FormData;
    fileURL: string | ArrayBuffer;
    uploadDone:boolean

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService,
    private settingService: SettingsService) {
    }

    gT = (key: string) => this.translationService.getTranslation(key);

    ngOnInit() {
        this.loadData();
    }


    handleFileChange(e: MouseEvent) {
        let reader = new FileReader();
        if (event.target['files'] && event.target['files'].length > 0) {
            const file = new FormData();
            file.append('files', event.target['files'][0]);
            file.append('fileName', event.target['files'][0].name);
            this.preview(event.target['files']);
            this.fileToUpload = file;
            this.uploadDone=true
        }
    }
    preview(files) {
        if (files && files[0]) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = e => this.fileURL = reader.result;

            reader.readAsDataURL(file);
        }
    }
    uploadFile(){
          this.settingService.uploadFile(this.fileToUpload).subscribe( res =>{
            this.fileURL=''
          })
    }

    download(name){
       this.settingService.downloadBackup(name).subscribe({next:(res:any)=>{
           console.log(res)
            let dataType = res;

// let binaryData = [];
// console.log(res)
// binaryData.push(res);
// let downloadLink = document.createElement('a');
// downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'zip'}));
//     downloadLink.setAttribute('download', 'backup');
// document.body.appendChild(downloadLink);
// downloadLink.click();
//        }
//     }
// let r:any={
//     "fileContents": res,
//     "contentType": "application/zip",
//     "fileDownloadName": "files.zip",
//     "lastModified": null,
//     "entityTag": null
//   }
// const blob = new Blob([res,{type:'zip'}]);
// let downloadLink = document.createElement('a');
// downloadLink.href = r;
//   downloadLink.setAttribute('download', 'backup');
//  document.body.appendChild(downloadLink);
//  downloadLink.click();



 
const blob = new Blob([res], {
    type: 'application/zip'
  });
  const url = window.URL.createObjectURL(blob);
  window.open(url);

        },
  })
    }
    ngAfterViewInit() {
    }

    restoreBackup(item) {
        this.alertService.showDialog(
            'هل أنت متأكد من عملية استرجاع قاعدة المعطيات؟ سيتم استبدال كافة المعطيات الجديدة بالقديمة',
            DialogType.confirm,
            () => {
               // this.alertService.startLoadingMessage();
                this.loadingIndicator = true;

                this.settingService.restoreBackup(item).subscribe(res => {
                    console.log('ress is', res);
                 //   this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                 /*   this.alertService.showMessage(
                        this.gT("shared.OperationSucceded"),
                        "تم استعادة قاعدة المعطيات بنجاح",
                        MessageSeverity.success
                    );*/
                    this.loadData();
                });
            }
        );
    }

    newBackup() {
     //   this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.settingService.newBackup().subscribe(res => {
            console.log('ress is', res);
         //   this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            // this.alertService.showMessage(
            //     this.gT("shared.OperationSucceded"),
            //     this.gT("shared.CreationSucceded") + +" " +res + " " +
            //     this.gT("shared.Successfully"),
            //     MessageSeverity.success
            // );
            this.loadData();
        });
    }

    loadData() {
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.settingService.getAllBackups().subscribe(res => {
            console.log('ress is', res);
            this.backups = res;
       //     this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
        });
    }

}
