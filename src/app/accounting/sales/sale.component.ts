import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { fadeInOut } from '../../services/animations';
import { CheckPermissionsService } from '../../services/check-permissions.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SalesGuard } from '../../services/sales.guard';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
  animations: [fadeInOut]
})
export class SaleComponent implements OnInit {
    appLogo = require("../../assets/images/logo.png");
    isRoute:boolean=false
    features:boolean[]=[false,false,false,false,false,false,false]
  constructor(private CheckPermissions:CheckPermissionsService,
    private salesGuard:SalesGuard,
    private checkPermissions:CheckPermissionsService,
    private router:Router,
    public config:ConfigurationService) { }
  ngOnInit() {
    let lan=this.config.language
    const layout = 
    Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
    layout.forEach(l => {
    l.style.display = 'none';

});


  /*  this.features.forEach((e,index)  =>{
      console.log(this.CheckPermissions.checkGroup(1,index+1))
      
      
    
    });
    */    
 
    this.features.forEach((e,index) =>{
      this.features[index]=this.CheckPermissions.checkGroup(1,index+1)
      if(this.CheckPermissions.checkGroup(1,index+1)&&!this.isRoute&&this.router.url=='/sales'){
        this.isRoute=true
        this.router.navigate(['/sales'+this.salesGuard.switchRoute(this.CheckPermissions.switchSalesName(index+1))]);
      
      }else if(index==2&&!this.CheckPermissions.checkGroup(1,index+1)&&this.CheckPermissions.checkGroup(1,7)&&!this.isRoute&&this.router.url=='/sales'){
        this.isRoute=true
        this.router.navigate(['/sales'+this.salesGuard.switchRoute(this.CheckPermissions.switchSalesName(7))]);
     
      }
    })
    
  }
}
