import {
  Component, OnInit, ViewChild,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppTranslationService } from "../../../services/app-translation.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Utilities } from "../../../services/utilities";
import { CostCenterService } from "../services/cost-center.service";
import { ExpensesTemplateService } from "../services/expenses-template.service";
import { ItemService } from "../services/item.service";
import { BranchService } from "../services/branch.service";
import { ItemUnitBranch } from "../models/item-unit-branch";


import { map } from 'rxjs/operators';
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../services/alert.service";
import { CostCenterModel } from "../../shared/models/cost-center.model";
import { ExpensesTemplateModel } from '../../shared/models/expenses-template-model';


@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.css']
})
export class CostCenterComponent implements OnInit {

  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("date")
  dateTemplate: TemplateRef<any>;

  @ViewChild("status")
  statusTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
  actionTemplate: TemplateRef<any>;

  @ViewChild("editTemplate")
  editTemplate: TemplateRef<any>;

  columns = []
  rows: CostCenterModel[] = [];
  rowsCache: CostCenterModel[] = [];
  items = []
  branchId: number;
  selectedCostCenter: CostCenterModel;
  loadingIndicator: boolean = false;
  expensesTemplates: ExpensesTemplateModel[] = [];
  selectedExpensesTemplate: number;
  modalRef: BsModalRef;
  maxDate: Date = new Date();
  minDate: Date;
  selectedItemUnitBrach:ItemUnitBranch = new ItemUnitBranch();
  branchname:string=''
  gT = (key: string) => this.translationService.getTranslation(key);

  constructor(private costCenterService: CostCenterService,
    private translationService: AppTranslationService, private expensesTemplateService: ExpensesTemplateService,
    private alertService: AlertService, private itemService: ItemService,
    private modalService: BsModalService, private rout: ActivatedRoute,
    private branchService: BranchService,) { }

  ngOnInit() {
    this.selectedCostCenter = new CostCenterModel();
    this.rout.paramMap.subscribe(
      (params: any) => {
        this.branchId = Number(params.get('branchId'));
        this.getAllByBranch();
        this.getAllItems();
        this.expensesTemplateService.getAll().subscribe(
          (data: ExpensesTemplateModel[]) => {
            this.expensesTemplates = data;
          }
        )
      }
    )

    this.intializeTableColumns();
  }

  getAllItems() {
    this.itemService.getItems().subscribe(
      (data: any) => {
        this.items = data.data
      }
    )
  }

  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r =>
      Utilities.searchArray(value, false, r.nameAr)
    );
  }

  getAllByBranch() {
    this.loadingIndicator = true;
    return this.costCenterService.getAllByBranch(this.branchId)
      .pipe(map(res => res.map((val, i) => { val.index = i + 1; return val; }))).subscribe(
        (data: CostCenterModel[]) => {
         // console.log(data);
          this.rows = data;
          if(this.rows.length>0)
          this.branchname=data[0].branch.name
          this.rowsCache = data;
          this.loadingIndicator = false;
          //console.log(this.rows);
        },
        (error: any) => {
          this.loadingIndicator = false;
        }
      )
  }

  intializeTableColumns() {
    this.columns = [
      {
        prop: "index",
        name: "#",
        width: 30,
        cellTemplate: this.indexTemplate,
        canAutoResize: false
      },
      { prop: "nameAr", name: this.gT("shared.NameAr") },
      { prop: "nameEn", name: this.gT("shared.nameEn") },
      { prop: "branch.name", name: this.gT("shared.branch") },
      { prop: "item.nameAr", name: this.gT("shared.item") },
      { prop: "startDate", name: this.gT("shared.startDate"), cellTemplate: this.dateTemplate },
      { prop: "status", name: this.gT("shared.status"), cellTemplate: this.statusTemplate },
      { prop: "closedDate", name: this.gT("shared.closedDate"), cellTemplate: this.dateTemplate },
      {
        width: 250,
        cellTemplate: this.actionTemplate,
        resizeable: false,
        canAutoResize: false,
        sortable: false,
        draggable: false
      }
    ]
  }

  openEditModal() {
    this.selectedCostCenter = new CostCenterModel();
    this.resetUnitBranchForm();
    this.modalRef = this.modalService.show(this.editTemplate, {
      backdrop: 'static',
      keyboard: false
    });
  }

  edit(row: CostCenterModel) {
    Object.assign(this.selectedCostCenter, JSON.parse(JSON.stringify(row)));
    this.modalRef = this.modalService.show(this.editTemplate, {
      backdrop : 'static',
      keyboard : false
});
    console.log(this.selectedCostCenter);
  }

  save() {
    if (this.selectedCostCenter.id) {
      this.editItem();
    } else {
      this.addNew();
    }
  }

  editItem() {
    this.costCenterService.editItem(this.selectedCostCenter).subscribe(
      (data: CostCenterModel) => {
        console.log(data);
        Object.assign(this.selectedCostCenter, JSON.parse(JSON.stringify(data)));
        this.getAllByBranch();
      }
    )
  }

  getCCById(id: number) {
    this.costCenterService.getCostCenterById(id).subscribe(
      (data: CostCenterModel) => {
        this.selectedCostCenter = data;
      }
    )
  }

  addNew() {
    this.selectedCostCenter.branchId = this.branchId;
    let objectToAdd: CostCenterModel = new CostCenterModel();
    Object.assign(objectToAdd, { ...this.selectedCostCenter, templateTreeId: this.selectedExpensesTemplate })
    this.costCenterService.addItem(objectToAdd).subscribe(
      (data: CostCenterModel) => {
        console.log(data);
        Object.assign(this.selectedCostCenter, JSON.parse(JSON.stringify(data)));
        console.log(data);
        console.log(this.selectedCostCenter);
        this.getAllByBranch();
      }
    )
  }



  delete(row: CostCenterModel) {
    this.alertService.showDialog(
      `${this.gT("messages.confirmDeleting")} ${row.nameAr}/${row.nameEn} ?`,
      DialogType.confirm,
      () => this.deleteItem(row.id)
    );
  }

  deleteItem(id) {
    this.costCenterService.deleteItem(id).subscribe(
      (data: any) => {
        this.getAllByBranch();
      }
    )
  }



  openCloseModal(row: CostCenterModel, template: TemplateRef<any>) {
    Object.assign(this.selectedCostCenter, row);
    this.minDate = new Date(row.startDate);
    this.modalRef = this.modalService.show(template, {
      backdrop : 'static',
      keyboard : false
});
  }

  closeCostCenter(closeDate: Date) {
    let modelToPut = { id: this.selectedCostCenter.id, closeDate: closeDate };
    this.costCenterService.closeCostCenter(modelToPut).subscribe(
      (data: any) => {
        this.closeModal();
      }
    )
  }

  closeModal() {
    this.modalRef.hide();
    this.selectedCostCenter = new CostCenterModel();
    this.resetUnitBranchForm();
    this.getAllByBranch();
  }


  saveItemUnit() {
    let objectToSave = {
      id: this.selectedItemUnitBrach.id,
      itemUnitId: this.selectedItemUnitBrach.itemUnitId,
      expireDate: this.selectedItemUnitBrach.expireDate,
      initialQuantity: this.selectedItemUnitBrach.initialQuantity,
    }
    this.branchService.saveItemUnitBranch(objectToSave).subscribe(
      (data: any) => {
        this.resetUnitBranchForm();
        this.getCCById(this.selectedCostCenter.id);
      }
    )
  }

  editUnitBranch(itemUnitBranch) {
    Object.assign(this.selectedItemUnitBrach, itemUnitBranch);
  }

  resetUnitBranchForm() {
    this.selectedItemUnitBrach.expireDate = null;
    this.selectedItemUnitBrach.initialQuantity = null;
    this.selectedItemUnitBrach.id = null;
  }






}
