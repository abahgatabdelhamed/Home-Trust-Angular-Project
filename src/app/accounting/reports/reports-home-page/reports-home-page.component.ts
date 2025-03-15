import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut } from '../../../services/animations';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { ReportsGuard } from '../../../services/reports.guard';

@Component({
  selector: 'app-reports-home-page',
  templateUrl: './reports-home-page.component.html',
  styleUrls: ['./reports-home-page.component.css'],
  animations: [fadeInOut]
})
export class ReportsHomePageComponent implements OnInit {

  features:boolean[]=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
  constructor(private CheckPermissions:CheckPermissionsService,private reportGuard:ReportsGuard,
    private router:Router,   public config:ConfigurationService) { }
    appLogo = require("../../../assets/images/logo.png");
    isRoute:boolean=false
    ngOnInit() {
      let lan=this.config.language
      const layout = 
      Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
      layout.forEach(l => {
      l.style.display = 'none';
  
  });
  
 
    
    /*this.router.navigate(['/reports/'+this.reportGuard.switchRoute(this.CheckPermissions.getFirstFeatureActive(5))]); 
    */this.features.forEach((e,index) =>{
      this.features[index]=this.CheckPermissions.checkGroup(5,index+1)
      console.log(this.CheckPermissions.checkGroup(5,index+1),'/////////')
      if(this.CheckPermissions.checkGroup(5,index+1)&&!this.isRoute&&this.router.url=='/reports'){
        this.isRoute=true
        this.router.navigate(['/reports/'+this.reportGuard.switchRoute(this.CheckPermissions.switchReportName(index+1))]);
      
      }
    })
    this.features[17]=this.CheckPermissions.checkGroup(5,19)
    console.log(this.features[6])
  }

}
