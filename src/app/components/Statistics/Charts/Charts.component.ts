import {ViewChild, Component, ElementRef, OnInit, Type } from '@angular/core';
import { IStatisticsModel, TopItemFeatureModel, TopItemModel, TopServiceModel, TopSoldTogetherModel } from '../../Interface/IStatisticsModel';
import { Branch } from '../../../accounting/definitions/models/brach.model';
import { StaticsServiceService } from '../../../services/New_Service/StaticsService.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { setDayOfYear } from 'ngx-bootstrap/chronos/units/day-of-year';
import { forEach } from '@angular/router/src/utils/collection';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, ChartConfiguration , ChartData } from 'chart.js';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-Charts',
  templateUrl: './Charts.component.html',
  styleUrls: ['./Charts.component.css']
})
export class ChartsComponent implements OnInit {
  chartInstance1: Chart;
  chartInstance2: Chart;
 StatisList: IStatisticsModel[];
 StatisticsModel: IStatisticsModel;
  Title :string = "Statistics "
  SelectedBranchID:number = -1
  chartLabels :string[] 
  fromDate: Date;
  toDate: Date;
  chartData = [
    // { data: [65, 70, 80, 85, 60, 75, 90, 95, 85, 80, 70, 60], label: 'Sales', borderColor: 'red', fill: false },
    // { data: [30, 50, 45, 40, 70, 85, 100, 95, 90, 75, 60, 50], label: 'Revenue', borderColor: 'blue', fill: false },
    // { data: [15, 25, 35, 50, 65, 70, 80, 85, 75, 60, 45, 30], label: 'Profit', borderColor: 'green', fill: false }
  ];
  // Branches
  branchList: { id: number; name: string }[] = [];

QuantityChartData = []

  topItems: TopItemModel[];
     topServices: TopServiceModel[];
     topItemFeatures: TopItemFeatureModel[];
     topSoldTogether: TopSoldTogetherModel[];





  constructor( private Service :StaticsServiceService , private cdr:ChangeDetectorRef) {


   


   }


   ngOnInit() {

    console.log( this.StatisList);

    this.Service.getBranches().subscribe({
      next: (data) => {
        this.branchList = data;
        console.log(data);
        console.log("data");
        
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
      }
    });


    this.Service.getBranchStatistcsByID(this.SelectedBranchID , new Date('2024-01-01').toISOString(), new Date('2025-01-01').toISOString())
    .subscribe({
      next:(data)=>{
        this.StatisticsModel = data
        console.log(this.StatisticsModel);
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        
          this.chartLabels = this.StatisticsModel.revenues.map((x) => 
            `${new Date(x.periodStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} `)

          this.topItems = data.topItems;
          this.topServices = data.topServices;
          this.topItemFeatures = data.topItemFeatures;
          this.topSoldTogether = data.topSoldTogether;

          var can1 =document.getElementById("canvas1")
          can1.innerHTML='' 
          var createCanvase = document.createElement("canvas");
          can1.appendChild(createCanvase);

          var can2 =document.getElementById("canvas2")
          can2.innerHTML='' 
          var createCanvase2 = document.createElement("canvas");
          can2.appendChild(createCanvase2);
          //createCanvase.getContext("2d")
         // createCanvase2.getContext("2d")

          const labels = this.chartLabels // Example labels

          const revenueChartData: ChartData = {
            labels: labels,
            datasets: [
              { label: 'الاجمالي', data:this.StatisticsModel.revenues.map(x => x.salesRevenue), borderColor: 'red', fill: false },
              { label: 'المرتجع', data: this.StatisticsModel.revenues.map(x => x.returnsTotal) , borderColor: 'blue', fill: false },
              { label: 'الصافي', data: this.StatisticsModel.revenues.map(x => x.netSalesRevenue) , borderColor: '#e8b106', fill: false }
            ]
          };
      
          const quantityChartData: ChartData = {
            labels: labels,
            datasets: [
              { label: 'الاجمالي', data: this.StatisticsModel.itemsQty.map(x => x.totalSoldItems), borderColor: 'red', fill: false },
              { label: 'المرتجع', data: this.StatisticsModel.itemsQty.map(x => x.totalReturnedItems), borderColor: 'blue', fill: false },
              { label: 'الصافي', data: this.StatisticsModel.itemsQty.map(x => x.netTotalSoldItems), borderColor: '#e8b106', fill: false }
            ]
          };
      
          // ✅ Initialize Chart.js for Revenue Chart
          this.chartInstance1 = new Chart(createCanvase, {
            type: 'line',
            data: revenueChartData,
            options: { responsive: true, maintainAspectRatio: false  }
          });
      
          // ✅ Initialize Chart.js for Quantity Chart
          this.chartInstance2 = new Chart(createCanvase2, {
            type: 'line',
            data: quantityChartData,
            options: { responsive: true, maintainAspectRatio: false }
          });
      



          var can2 =document.getElementById("canvas2")

  // ✅ Force change detection
   this.cdr.detectChanges();
          console.log(this.chartLabels);
          console.log(this.chartData);
          
         
        
        
      }, 
      error:(err)=>{
        console.log(err);
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        
      }
    })
    

  }
  
   
   // AfterViewInit علطول بتيجي مع 
  ngAfterViewInit(): void {
   
  }

 
  TrackedItem(index :number , branch:Branch){
      return branch.id
  }

  





  //Statistics Model 

  CreateChart(event:Event): void {
     event.preventDefault(); 
    const fromDateObj = new Date(this.fromDate);
    const toDateObj = new Date(this.toDate);
    
    this.chartLabels =[]

    this.Service.getBranchStatistcsByID(this.SelectedBranchID , fromDateObj.toISOString(), toDateObj.toISOString())
    .subscribe({
      next:(data)=>{
        this.StatisticsModel = data
        console.log(this.StatisticsModel);
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        
          this.chartLabels = this.StatisticsModel.revenues.map((x) => 
            `${new Date(x.periodStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} `)

          this.topItems = data.topItems;
          this.topServices = data.topServices;
          this.topItemFeatures = data.topItemFeatures;
          this.topSoldTogether = data.topSoldTogether;

          var can1 =document.getElementById("canvas1")
          can1.innerHTML='' 
          var createCanvase = document.createElement("canvas");
          can1.appendChild(createCanvase);

          var can2 =document.getElementById("canvas2")
          can2.innerHTML='' 
          var createCanvase2 = document.createElement("canvas");
          can2.appendChild(createCanvase2);
          createCanvase.getContext("2d")
          createCanvase2.getContext("2d")

          const labels = this.chartLabels // Example labels

          const revenueChartData: ChartData = {
            labels: labels,
            datasets: [
              { label: 'الاجمالي', data:this.StatisticsModel.revenues.map(x => x.salesRevenue), borderColor: 'blue', fill: false },
              { label: 'المرتجع', data: this.StatisticsModel.revenues.map(x => x.returnsTotal) , borderColor: 'red', fill: false },
              { label: 'الصافي', data: this.StatisticsModel.revenues.map(x => x.netSalesRevenue) , borderColor: 'green', fill: false }
            ]
          };
      
          const quantityChartData: ChartData = {
            labels: labels,
            datasets: [
              { label: 'الاجمالي', data: this.StatisticsModel.itemsQty.map(x => x.totalSoldItems), borderColor: 'blue', fill: false },
              { label: 'المرتجع', data: this.StatisticsModel.itemsQty.map(x => x.totalReturnedItems), borderColor: 'red', fill: false },
              { label: 'الصافي', data: this.StatisticsModel.itemsQty.map(x => x.netTotalSoldItems), borderColor: 'green', fill: false }
            ]
          };
      
          // ✅ Initialize Chart.js for Revenue Chart
          this.chartInstance1 = new Chart(createCanvase, {
            type: 'line',
            data: revenueChartData,
            options: { responsive: true, maintainAspectRatio: false  }
          });
      
          // ✅ Initialize Chart.js for Quantity Chart
          this.chartInstance2 = new Chart(createCanvase2, {
            type: 'line',
            data: quantityChartData,
            options: { responsive: true, maintainAspectRatio: false }
          });
      



          var can2 =document.getElementById("canvas2")

  // ✅ Force change detection
   this.cdr.detectChanges();
          console.log(this.chartLabels);
          console.log(this.chartData);
          
         
        
        
      }, 
      error:(err)=>{
        console.log(err);
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        
      }
    })
    
  }



  public chartOptions = {
    responsive: true
  };
  

  

  
  public chartType = 'line';

  getselected(cat){
    this.SelectedBranchID = cat.branchesId
  }

  

  SelectedBranchName: string = "كل الفروع"; // Default selected name

onBranchChange(event: any) {
  const selectedId = event.target.value;
  if (selectedId === "-1") {
    this.SelectedBranchName = "Total Companies"; // Default option
  } else {
    const selectedBranch = this.branchList.find(branch => branch.id == selectedId);
    this.SelectedBranchName = selectedBranch ? selectedBranch.name : "Unknown";
  }
}
}
