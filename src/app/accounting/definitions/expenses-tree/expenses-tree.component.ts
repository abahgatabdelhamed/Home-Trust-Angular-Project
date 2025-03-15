import { Component, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpensesTreeService } from '../services/expenses-tree.service';
import { ExpensesTreeModel, ExpensesTreeItemModel, ExpensesTreeNodeModel } from "../../shared/models/expenses-tree";
import { map } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";


@Component({
  selector: 'app-expenses-tree',
  templateUrl: './expenses-tree.component.html',
  styleUrls: ['./expenses-tree.component.css']
})
export class ExpensesTreeComponent implements OnInit {
  headId:number;
  tree:  ExpensesTreeModel[];
  selectedTreeNode: ExpensesTreeModel;
  newTreeItem: ExpensesTreeItemModel;
  modalRef: BsModalRef;

  gT = (key: string) => this.translationService.getTranslation(key);
  constructor(private route:ActivatedRoute,
     private expensesTreeService : ExpensesTreeService,
     private modalService: BsModalService,
     private alertService: AlertService,
     private translationService: AppTranslationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params:any)=>{
        this.headId = Number(params.get('headId'));
        this.getTree(this.headId);
      }
    );
  }

  getTree(headId:number){
    this.expensesTreeService.getTree(headId).pipe(map(res => res.data)).subscribe(
      (data:ExpensesTreeModel[])=>{
        this.tree = data;
      }
    )
  }

  openModal(template:TemplateRef<any>, selectedRow:any){
    if(selectedRow.node){
      this.selectedTreeNode = new ExpensesTreeModel();
      this.selectedTreeNode.children = [];
      Object.assign(this.selectedTreeNode.data, selectedRow.node.data);
      this.newTreeItem = new ExpensesTreeItemModel()
      this.newTreeItem.expensesTreeId = this.selectedTreeNode.data.id;
      this.modalRef = this.modalService.show(template, {
        backdrop : 'static',
        keyboard : false
  });
    }
  }

  addTreeNode(){
    this.expensesTreeService.addItem(this.newTreeItem).subscribe(
      (data:ExpensesTreeItemModel)=>{
        this.newTreeItem = new ExpensesTreeItemModel();
        this.newTreeItem.expensesTreeId = this.selectedTreeNode.data.id;
        this.getTree(this.headId);
      }
    )
  }

  editTreeNode(){
    let modelToEdit : ExpensesTreeItemModel  = <ExpensesTreeItemModel>this.selectedTreeNode.data;
    console.log(modelToEdit);
    modelToEdit.expensesTreeId = this.selectedTreeNode.data.parentId;
    console.log(modelToEdit);
    this.expensesTreeService.editItem(modelToEdit).subscribe(
      (data:ExpensesTreeItemModel)=>{
        this.modalRef.hide();
        this.newTreeItem = new ExpensesTreeItemModel();
        this.selectedTreeNode = new ExpensesTreeModel();
        this.getTree(this.headId);
      }
    )
  }

  delete() {
    this.alertService.showDialog(
      `${this.gT("messages.confirmDeleting")} ${this.selectedTreeNode.data.nameAr}/${this.selectedTreeNode.data.nameEn} ?`,
      DialogType.confirm,
      () => this.deleteItem(this.selectedTreeNode.data.id)
    );
  }

  deleteItem(id:number){
    this.expensesTreeService.deleteItem(id).subscribe(
      (data:any)=>{
        this.modalRef.hide();
        this.newTreeItem = new ExpensesTreeItemModel();
        this.selectedTreeNode = new ExpensesTreeModel();
        this.getTree(this.headId);
      }
    )
  }

}
