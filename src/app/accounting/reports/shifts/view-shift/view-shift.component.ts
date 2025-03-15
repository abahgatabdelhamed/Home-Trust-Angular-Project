import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { r } from '@angular/core/src/render3';
import { CheckPermissionsService } from '../../../../services/check-permissions.service';
import { shiftItem, viewShift } from '../../models/ShiftItem';
import { ShiftsPrintService } from '../../services/shifts.print.service';

@Component({
  selector: 'app-view-shift',
  templateUrl: './view-shift.component.html',
  styleUrls: ['./view-shift.component.css']
})
export class ViewShiftComponent implements OnInit {
  data:viewShift
  public changesCancelledCallback: () => void;
  public changesSavedCallback: () => void;
  constructor(private ch:ChangeDetectorRef,
    private printService:ShiftsPrintService,
    public checkPermissionsService:CheckPermissionsService) { }

  ngOnInit() {

  }
  view(row){
    console.log(row)
   // row=this.data
    
    if(row)
  this.data=row
this.ch.detectChanges()
  }
  close() {
    
  if (this.changesCancelledCallback) this.changesCancelledCallback();

  }
  printDocumnent(){
    this.printService.printDocument(this.data,'تفاصيل الواردية','ff',true)

}
print(){
    this.printService.printDocument(this.data,'تفاصيل الواردية','ff',false)

}
}
