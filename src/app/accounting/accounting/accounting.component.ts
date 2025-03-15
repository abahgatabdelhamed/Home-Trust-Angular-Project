import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingGuard } from '../../services/accounting.guard';
import { fadeInOut } from '../../services/animations';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-accounting',
    templateUrl: './accounting.component.html',
    styleUrls: ['./accounting.component.css'],
  animations: [fadeInOut]
})
export class AccountingComponent implements OnInit {
    appLogo = require("../../assets/images/logo.png");
    isRoute:boolean=false
    features:boolean[]=[false,false,false,false,false,false,false,false,false,false,false]
    constructor(private CheckPermissions:CheckPermissionsService,
      private accountingGuard:AccountingGuard,
      private router:Router,
      public config:ConfigurationService) { }
      ngOnInit() {
        let lan=this.config.language
        const layout = 
        Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
    layout.forEach(l => {
        l.style.display = 'none';
    
    });
     /* console.log('/accounting/'+this.accountingGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(3)))
      this.router.navigate(['/accounting/'+this.accountingGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(3))]); 
      */
    this.features.forEach((e,index) =>{
      this.features[index]=this.CheckPermissions.checkGroup(3,index+1)
      if(this.CheckPermissions.checkGroup(3,index+1)&&!this.isRoute&&this.router.url=='/accounting'){
        this.isRoute=true
        this.router.navigate(['/accounting/'+this.accountingGuard.switchRoute(this.CheckPermissions.switchAccName(index+1))]);
      
      }
    })
  }

}
