import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IStatisticsModel } from '../Interface/IStatisticsModel';
import { ChartsModule } from 'ng2-charts';
import { Branch } from '../../accounting/definitions/models/brach.model';
import { RouterLink , RouterLinkActive,RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-Statistics',
  templateUrl: './Statistics.component.html',
  styleUrls: ['./Statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  ngOnInit(): void {
   
  }
  StatisList: IStatisticsModel[];
  Title :string = "Statistics bahgat"
  SelectedBranchID:number = 1000
  chartLabels :string[] 

   

}
