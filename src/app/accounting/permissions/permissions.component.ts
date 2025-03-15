import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ConfigurationService } from '../../services/configuration.service';
import { StatementsGuard } from '../../services/statements.guard';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  appLogo = require("../../assets/images/logo.png");
  features:boolean[]=[false,false]
  isRoute:boolean=false
  constructor(private CheckPermissions:CheckPermissionsService,
      private statementsGuard:StatementsGuard,
      private router:Router,
      public config:ConfigurationService) { }
      ngOnInit() {
        let lan=this.config.language
        const layout = 
        Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
        layout.forEach(l => {
        l.style.display = 'none';
    
    });
     // this.router.navigate(['/permissions/'+this.statementsGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(4))]); 
      
    this.features.forEach((e,index) =>{
      this.features[index]=this.CheckPermissions.checkGroup(4,index+1)
      if(this.CheckPermissions.checkGroup(4,index+1)&&!this.isRoute&&this.router.url=='/permissions'){
        this.isRoute=true
        this.router.navigate(['/permissions/'+this.statementsGuard.switchRoute(this.CheckPermissions.switchStatementName(index+1))]);
      
      }
      
    })

  }

}
