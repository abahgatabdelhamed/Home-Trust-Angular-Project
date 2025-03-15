import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut } from '../../services/animations';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ConfigurationService } from '../../services/configuration.service';
import { PurchGuard } from '../../services/purch.guard';

@Component({
  selector: 'app-purch',
    templateUrl: './purch.component.html',
    styleUrls: ['./purch.component.css'],
  animations: [fadeInOut]
})
export class PurchComponent implements OnInit {
    appLogo = require("../../assets/images/logo.png");
    isRoute:boolean=false
    features:boolean[]=[false,false,false,false]
    constructor(private CheckPermissions:CheckPermissionsService,
     private purchGuard:PurchGuard,
      private router:Router ,
         public config:ConfigurationService) { }
      ngOnInit() {
        let lan=this.config.language
        const layout = 
        Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
        layout.forEach(l => {
        l.style.display = 'none';
    
    });
     // this.router.navigate(['/purch'+this.purchGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(2))]); 
            
    this.features.forEach((e,index) =>{
      this.features[index]=this.CheckPermissions.checkGroup(2,index+1)
      if(this.CheckPermissions.checkGroup(2,index+1)&&!this.isRoute&&this.router.url=='/purch'){
        this.isRoute=true
        this.router.navigate(['/purch'+this.purchGuard.switchRoute(this.CheckPermissions.switchPurchName(index+1))]);
      
      }else if(index==1&&!this.CheckPermissions.checkGroup(1,index+1)&&this.CheckPermissions.checkGroup(1,5)&&!this.isRoute&&this.router.url=='/purch'){
        this.isRoute=true
        this.router.navigate(['/purch'+this.purchGuard.switchRoute(this.CheckPermissions.switchPurchName(5))]);
     
      }
    })
  }

}
