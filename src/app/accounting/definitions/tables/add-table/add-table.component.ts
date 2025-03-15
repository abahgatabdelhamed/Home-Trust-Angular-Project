import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Table } from '../../models/table.model';
import { TablesService } from '../../services/table.service';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.css']
})
export class AddTableComponent implements OnInit {
  table: Table = {

    nameAr: '',
    nameEn: '',
    capacity: 0,
    status: 0,
    branchId:0

  }
  row=null
  EditMode: boolean = false
  public changesCancelledCallback: () => void;
  public changesSavedCallback: () => void;
  branchList: Branch[];
  constructor(public bsModalRef: BsModalRef,
     private tableService: TablesService,
     private branchService:BranchService) { }

  ngOnInit() {
    this.getAllBranches()
  }
  createTable() {

    console.log(this.table)
    if (this.EditMode){
      this.tableService.editTable(this.table).subscribe(res => {
        console.log(res)
        this.row = this.table
        if (this.changesCancelledCallback) this.changesCancelledCallback();
      })
      this.EditMode=false
    }
     
      else
    this.tableService.addTable(this.table).subscribe(res => {
      console.log(res)

      if (this.changesCancelledCallback) this.changesCancelledCallback();
    })
    this.table= {

      nameAr: '',
      nameEn: '',
      capacity: 1,
      status: 0,
      branchId:0
  
    }
  }
  close() {
    this.EditMode=false
    this.table= {

      nameAr: '',
      nameEn: '',
      capacity: 1,
      status: 0,
      branchId:0
  
    }
  if (this.changesCancelledCallback) this.changesCancelledCallback();

  }
  loadTable(row) {
    this.EditMode = true
    this.table = row
    this.row = row
  }
  getAllBranches(){
    this.branchList = [];
    this.branchService.getAllBranches().subscribe(
      (data:any)=>{ 
        this.branchList = data;
        this.table.branchId=this.branchList[0].id 

 
      
       },
      (error:any)=> console.error(error)
    )
  }
}
