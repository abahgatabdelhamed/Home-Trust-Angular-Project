// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { SettingsService } from "../../services/settings.service";


import { Chart } from 'chart.js';
import { ReportsService } from '../../accounting/reports/services/reports.service';
import { SBillService } from '../../accounting/shared/services/sbill.service';
import { V } from '@angular/core/src/render3';
import { CheckPermissionsService } from '../../services/check-permissions.service';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeInOut]
})
export class HomeComponent {
     baseUrl =this.configurations.baseUrl
    // baseUrl =''
appLogo = require("../../assets/images/logo.png");
logo
stistics:{name:string,amount?:number,count?:number}[]=[]
   profit:{name:string,total?:number ,cost?:number,sales?:number}={
    name:'',total:null ,cost:null,sales:null
   }
    constructor(public configurations: ConfigurationService,
        private settingsService: SettingsService,
        private reportService:ReportsService,
        private sbillService: SBillService,
        private checkPermissins:CheckPermissionsService) {
        //  this.baseUrl =configurations.baseUrl
        
        this.settingsService.getSetting().subscribe(res => {
            this.logo = res.logoPath;
        })
    
    }
    ngOnInit() {
        if(this.checkPermissins.checkGroup(5,20))
     this.getResult('w')
    }
    getResult(value){
        this.stistics=[]
        //console.log(value.target.value)
       // value=value.target.value
        let from:Date=new Date()
        let to:Date=new Date()
        if(value=='d')
        from.setHours(0, 0, 0, 0)
        if(value=='w'){
            from=this.getMonday(from)
            from.setFullYear(new Date().getFullYear(),new Date().getMonth())
            from.setHours(0, 0, 0, 0)
        }
      
        if(value=='m')
        from=new Date(from.getFullYear(),from.getMonth(),1)
        if(value=='y')
        from=new Date(from.getFullYear(),1,1)
        this.reportService.getStatistics(from.toUTCString(),to.toUTCString()).subscribe(res=>{
            this.stistics.push({name:'mainMenu.Sales',amount:res.sale.amout,count:res.sale.count})
            this.stistics.push({name:'shared.AllRSalesBill',amount:res.rsale.amout,count:res.rsale.count})
            this.stistics.push({name:'mainMenu.Purchase',amount:res.purch.amout,count:res.purch.count})
            this.stistics.push({name:'shared.AllRPurchBill',amount:res.rpurch.amout,count:res.rpurch.count})
            this.stistics.push({name:'mainMenu.Expenses',amount:res.expenses.amount,count:res.expenses.count})
            this.profit={name:'shared.profit',cost:res.profit.cost,sales:res.profit.sales,total:res.profit.total}
          
            console.log(this.stistics)
        })
    }
     getMonday  (d)  {
        const dt = new Date(d);
        const day = dt.getDay()
        const diff = dt.getDate() - day + (day === 0 ? -7 : 1);
        return new Date(dt.setDate(diff));
      }
}