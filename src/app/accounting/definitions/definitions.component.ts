import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { fadeInOut } from "../../services/animations";
import { CheckPermissionsService } from "../../services/check-permissions.service";
import { ConfigurationService } from "../../services/configuration.service";
import { DefinitionsGuard } from "../../services/definitions.guard";

@Component({
    selector: "app-definitions",
    template: `
        <style>
            #header-icon {
                font-size: 1.2em;
            }
            .side-menu {
                z-index: 9;
                min-width: 120px;
                position: relative;
                margin-top: 6%;
            }

            .separator-hr {
                margin-top: 0;
                margin-bottom: 10px;
            }

            [hidden] {
                display: none;
            }
        </style>
        <div class="container">
          

            <div [@fadeInOut] class="row">
           
                <div *ngIf="config.language=='en'" class="col-sm-2"></div>
                <div class="col-sm-12 col-md-10 ">
                    <div  class="tab-content">
                        <router-outlet></router-outlet>
                    </div>
                </div>  
             </div>
        </div>
    `,
    animations: [fadeInOut]
})
export class DefinitionsComponent implements OnInit {
    appLogo = require("../../assets/images/logo.png");
    isRoute:boolean=false
    features:boolean[]=[false,false,false,false,false,false,false,false,false,false]
    constructor(private CheckPermissions:CheckPermissionsService,
        private DefinitionsGuard:DefinitionsGuard,
    private router:Router,
    public config:ConfigurationService) { }
    ngOnInit() {
      let lan=this.config.language
      const layout = 
      Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
      layout.forEach(l => {
      l.style.display = 'none';
  
  });
 /*   this.router.navigate(['/definitions/'+this.DefinitionsGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(6))]); 
   */this.features.forEach((e,index) =>{
            this.features[index]=this.CheckPermissions.checkGroup(6,index+1)
            if(this.CheckPermissions.checkGroup(6,index+1)&&!this.isRoute&&this.router.url=='/definitions'){
                this.isRoute=true
                this.router.navigate(['/definitions/'+this.DefinitionsGuard.switchRoute(this.CheckPermissions.switchDefiName(index+1))]);
              
              }
          })
    }
}

//<li routerLinkActive="active">
//                            <a
//                                id="branch"
//                                [routerLink]="['/definitions/vat-type']"
//                                data-toggle="tab"
//                                ><i
//                                    class="fa fa-folder-open"
//                                    aria-hidden="true"
//                                ></i>
//                                {{ "shared.vatType" | translate }}</a
//                            >
//                        </li>
