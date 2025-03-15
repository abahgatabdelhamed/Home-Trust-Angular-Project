import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  appLogo = require("../../assets/images/logo.png");
  constructor(
  
  public config:ConfigurationService) { }
  ngOnInit() {
    let lan=this.config.language
    const layout = 
    Array.from(document.getElementsByClassName((lan=='ar'?'ltr':'rtl')) as  HTMLCollectionOf<HTMLElement>)   ;
    layout.forEach(l => {
    l.style.display = 'none';

});
  }

}
