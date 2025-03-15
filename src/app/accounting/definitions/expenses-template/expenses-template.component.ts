import {
  Component, OnInit, ViewChild,
  TemplateRef,
} from '@angular/core';
import { ExpensesTemplateModel } from "../../shared/models/expenses-template-model";
import { ExpensesTemplateService } from "../services/expenses-template.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { map } from 'rxjs/operators';
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../services/alert.service";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expenses-template',
  templateUrl: './expenses-template.component.html',
  styleUrls: ['./expenses-template.component.css']
})
export class ExpensesTemplateComponent implements OnInit {

  @ViewChild("indexTemplate")
  indexTemplate: TemplateRef<any>;

  @ViewChild("actionsTemplate")
  actionTemplate: TemplateRef<any>;

  expensesTemplate: ExpensesTemplateModel = new ExpensesTemplateModel("", "");
  rows: ExpensesTemplateModel[] = [];
  loadingIndicator: boolean = false;
  columns = [];
  isSuperAdmin:boolean=false
  gT = (key: string) => this.translationService.getTranslation(key);

  constructor(private expensesTemplateService: ExpensesTemplateService,
    private translationService: AppTranslationService
    , private alertService: AlertService
    , private authService:AuthService) { }

  ngOnInit() {
    this.intializeTableColumns();
    this.getAllData();
    this.isSuperAdmin = this.authService.userInStorage.value.roles.includes('superadmin')
 
  }

  getAllData() {
    this.loadingIndicator = true;
    this.expensesTemplateService.getAll().pipe(map(res => res.map((val, index) => { val.index = index + 1; return val; }))).subscribe(
      (data: ExpensesTemplateModel[]) => {
        this.rows = data;
        this.loadingIndicator = false;
      }
    );
  }

  save() {
    if (this.expensesTemplate.id) {
      this.editItem();
    } else {
      this.addNew();
    }
  }

  edit(row: ExpensesTemplateModel) {
    Object.assign(this.expensesTemplate, row);
  }

  delete(row: ExpensesTemplateModel) {
    this.alertService.showDialog(
      `${this.gT("messages.confirmDeleting")} ${row.nameAr}/${row.nameEn} ?`,
      DialogType.confirm,
      () => this.deleteItem(row.id)
    );
  }

  addNew() {
    this.expensesTemplateService.addItem(this.expensesTemplate).subscribe(
      (data: ExpensesTemplateModel) => {
        this.getAllData();
        this.resetForm();
      }
    );
  }

  editItem() {
    this.expensesTemplateService.editItem(this.expensesTemplate).subscribe(
      (data: ExpensesTemplateModel) => {
        this.getAllData();
        this.resetForm();
      }
    )
  }

  deleteItem(id: number) {
    this.expensesTemplateService.deleteItem(id).subscribe(
      (data: any) => {
        this.getAllData();
        this.resetForm();
      }
    )
  }

  intializeTableColumns() {
    this.columns = [
      {
        prop: "index",
        name: "#",
        width: 60,
        cellTemplate: this.indexTemplate,
        canAutoResize: false
      },
      { prop: "nameAr", name: this.gT("shared.NameAr"), width: 70 },
      { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
      {  
        width: 200,
        cellTemplate: this.actionTemplate,
        resizeable: false,
        canAutoResize: false,
        sortable: false,
        draggable: false}
    ]
  }

  resetForm() {
    this.expensesTemplate = new ExpensesTemplateModel();
  }

}
