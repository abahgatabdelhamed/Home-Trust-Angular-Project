
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { r } from '@angular/core/src/render3';
import { object } from 'underscore';
import { CheckPermissionsService } from '../../../../services/check-permissions.service';
import { Accounting, AccountingInterface } from '../../models/accounting.model';
import { AccountingService } from '../../services/accounting.service';


@Component({
  selector: 'app-add-delivery-app',
  templateUrl: './add-delivery-app.component.html',
  styleUrls: ['./add-delivery-app.component.css']
})
export class AddDeliveryAppComponent implements OnInit {
  data: {id?:any, name: string, initialBalance: number } = { name: '', initialBalance: 0 }
  isEdit: boolean = false
  public changesCancelledCallback: () => void;
  public changesSavedCallback: () => void;
  constructor(private ch: ChangeDetectorRef,
    private accounting: AccountingService,
    public checkPermissionsService: CheckPermissionsService) { }

  ngOnInit() {

  }
  new() {
    this.isEdit = false
    this.data = { name: '', initialBalance: 0 }
  }
  view(row) {
    this.isEdit = true
    // console.log(row)
    // row=this.data

    if (row)
      this.data = row
  }
  close() {

    if (this.changesCancelledCallback) this.changesCancelledCallback();

  }
  submit() {
    if(this.isEdit)
    this.accounting.updateDeliveryApp(this.data,this.data.id).subscribe(res => {
      console.log(res)
      if (this.changesCancelledCallback) this.changesCancelledCallback();

    })
    else
    this.accounting.addDeliveryApp(this.data).subscribe(res => {
      console.log(res)
      if (this.changesCancelledCallback) this.changesCancelledCallback();
    })
  }
}
