import { Component, OnInit } from '@angular/core';
import { BranchService } from "../../definitions/services/branch.service";
import { CostCenterService } from "../../definitions/services/cost-center.service";
import { Branch } from "../../definitions/models/branch.model";
import { CostCenterModel } from '../../shared/models/cost-center.model';
import { ProductionBill, ProductionBillItem } from '../models/production-bill.model';
import { SBillService } from "../../shared/services/sbill.service";
import { ProductionService } from '../services/production.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Utilities } from "../../../services/utilities";
import { CheckPermissionsService } from '../../../services/check-permissions.service';

@Component({
  selector: 'app-add-production-bill',
  templateUrl: './add-production-bill.component.html',
  styleUrls: ['./add-production-bill.component.css']
})
export class AddProductionBillComponent implements OnInit {

  public initialDataParam = { BillTypeCode: "PRODUCTION" };;
  branchList: Branch[] = [];
  costCenterList: CostCenterModel[] = [];
  pbillEdit: ProductionBill = new ProductionBill();
  isNewBill: boolean = true;
  public uniqueId: string = Utilities.uniqueId();
  isCCPermission:boolean=false
  constructor(private branchService: BranchService,
    private costCenterService: CostCenterService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private sbillService: SBillService,
    private productionService: ProductionService,
    private checkPermissions:CheckPermissionsService) { }

  ngOnInit() {
    
    this.loadData();
    this.isCCPermission=this.checkPermissions.checkGroup(6,11)
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] === "new") {
        this.isNewBill = true;
      } else {
        this.isNewBill = false;
        this.productionService.getItemById(params["id"]).subscribe(
          (data: ProductionBill) => {
            this.pbillEdit = data;
            this.pbillEdit.date = new Date(this.pbillEdit.date);
            this.costCenterService.getAllByBranch(this.pbillEdit.branchId).subscribe(
              (data: CostCenterModel[]) => {
                this.costCenterList = data;
              },
              (error: any) => console.error(error)
            )
          }
        )
      }
    })

    
  }


  save() {
    if (this.isNewBill) {
      this.productionService.addItem(this.pbillEdit).subscribe(
        (data: ProductionBill) => {
          this.pbillEdit = data;
         this.resetData();
        }
      )
    }
  }

  resetData(){
    this.pbillEdit = new ProductionBill();
    this.loadData();
  }

  //load all initial data
  loadData() {
    this.sbillService.getSBillInit(this.initialDataParam).subscribe(
      (data: any) => {
        this.mapInitialData(data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  mapInitialData(initailData) {
    if (this.isNewBill) {
      this.pbillEdit.receiptCode = initailData.receiptCode;
    }
    Object.assign(this.branchList, initailData.branches);
    this.branchList = [...this.branchList];
    if (!this.pbillEdit.branchId && this.isNewBill) {
      for (let branch of this.branchList) {
        if (branch.isDefault) {
          this.pbillEdit.branchId = branch.id;
          this.getCCByBranch();
          break;
        }
      }
    }
  }


  updateReciptCode() {
    this.sbillService.getSBillInitCode(this.pbillEdit.branchId, this.initialDataParam["BillTypeCode"]).subscribe(
      (data: any) => {
        this.pbillEdit.receiptCode = this.pbillEdit.receiptCode.split("-")[0] + "-" + data;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getCCByBranch() {
    this.updateReciptCode();
    this.costCenterList = [];
    this.pbillEdit.itemsUnits = [];
    this.pbillEdit.costCenterId = null;
    if (this.pbillEdit.branchId)
      this.costCenterService.getAllByBranch(this.pbillEdit.branchId).subscribe(
        (data: CostCenterModel[]) => {
          this.costCenterList = data;
        },
        (error: any) => console.error(error)
      )
  }

  selectCC() {
    this.pbillEdit.itemsUnits = [];
    if (this.pbillEdit.costCenterId) {
      this.costCenterService.getCostCenterById(this.pbillEdit.costCenterId).subscribe(
        (data: CostCenterModel) => {
          data.itemUnitBranches.forEach(
            (val, idx) => {
              let object_to_append = new ProductionBillItem();
              object_to_append.itemUnitBranchId = val.id;
              object_to_append.itemName = val.itemName;
              object_to_append.itemUnitName = val.itemUnitName;
              object_to_append.quantity = 0;
              this.pbillEdit.itemsUnits.push(object_to_append);
            }
          )
        }
      )
    }
  }

}
