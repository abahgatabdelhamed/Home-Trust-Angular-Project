import { PrintBranchService } from './../services/branch.print.service';
import { ItemUnit } from "./../models/item-unit.model";
import { Item } from "./../models/item.model";
import { ItemService } from "./../services/item.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, HostListener } from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { BranchInterface } from "../models/branch.model";
import { element } from "protractor";
import { SupplierService } from "../services/supplier.service";
import { Supplier } from "../models/supplier.model";
import { BranchService } from "../services/branch.service";
import { ItemUnitBranchInterface, ItemUnitBranch } from "../models/item-unit-branch";
import { concat } from "rxjs/operator/concat";
import { PrinterSettingsService } from '../services/printer-settings.service';
import Page from '../../shared/models/page.model';
import { AuthService } from '../../../services/auth.service';



@Component({
    selector: "add-branch",
    templateUrl: "./add-branch.component.html",
    styleUrls: ["./add-branch.component.css"]
})

export class AddBranchComponent {



    canSelectFromUnits: boolean = false;
    viewSaveEdited = false;
    itemUnitSelect: ItemUnit[] = [];

    gT = (key: string) => this.translationService.getTranslation(key);

    items: Item[];
    // itemUnitBranch: ItemUnitBranchInterface = {
    //     initialQuantity: 0,
    //     expireDate: "",
    //     itemUnitId: 0,
    //     branchId: 0,
    //     itemName: "",
    //     itemUnitName: ""
    // };
    itemUnitBranch: ItemUnitBranch = new ItemUnitBranch();
    editingMode: boolean;
    branch: BranchInterface = {
        id: 0,
        branchIndex: 0,
        name: "",
        nameEn: '',
        isDefault: false,
        phone: "",
        notes: "",
        itemUnitBranches: [],
        expensesBills: []
    };
    printerHeader: any;
    itemsSettings: {};
    itemUnitBranchesSettings: {};
    selectedItemUnitBranch = new ItemUnitBranch();
    page = new Page(10,1)
    searchTerm = '';
    isSuperAdmin:boolean=false
    searchDisable = false;
    constructor(
        private branchService: BranchService,
        private alertService: AlertService,
        private router: ActivatedRoute,
        private printer: PrintBranchService,
        private itemService: ItemService,
        private route: Router,
        private settingService: PrinterSettingsService,
        private translationService: AppTranslationService,
        private authService:AuthService
    ) { }


    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        // visible height + pixel scrolled >= total height 
        if ((event.target.offsetHeight + event.target.scrollTop > event.target.scrollHeight) && this.page.count != this.branch.itemUnitBranches.length) {
            this.getPaginatedItemUnit()
        }
    }

    getPaginatedItemUnit() {
        this.branchService.getItemsUnitsBranch(this.branch.id, null,this.searchTerm, this.page.size, this.page.offset + 1).
            subscribe((data: any) => {
                if (this.page.offset < data.currentPageNumber) {
                    this.branch.itemUnitBranches = [...this.branch.itemUnitBranches, ...data.content]
                }
                this.page.offset = data.currentPageNumber;
                this.page.count = data.totalCount;
            }
            )
    }

    searchItemUnit() {
        this.branchService.getItemsUnitsBranch(this.branch.id, null, this.searchTerm, this.page.size, this.page.offset + 1).
            subscribe((data: any) => {
                this.branch.itemUnitBranches = data.content;
                this.searchDisable = false;
                this.page.offset = data.currentPageNumber;
                this.page.count = data.totalCount;
            },
                (error: any) => {
                    this.searchDisable = false;
                    this.branch.itemUnitBranches = []
                }
            )
    }

    searchForItemUnit(event) {
        this.searchDisable = true;
        this.page.offset = 0;
        this.branch.itemUnitBranches = [];
        this.searchItemUnit();

    }

    ngOnInit() {
        this.isSuperAdmin = this.authService.userInStorage.value.roles.includes('superadmin')
        this.router.params.subscribe(params => {
            if (params.id) {
                this.loadBranchDate(params.id);
            }

            this.settingService.getPrinterSettings().subscribe(res => {
                console.log('ress is', res);
                this.printerHeader = res.normalPrinter.header;
            });
            this.itemService.getItems().subscribe(res => {
                this.items = res.data;
                console.log(this.items);
            });
        });
        this.itemsSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'nameAr',
            allowSearchFilter: true
        };
        this.itemUnitBranchesSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            allowSearchFilter: true
        };
    }

    public showErrorAlert(caption: string, message: string) {
       // this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    loadBranchDate(id) {
        this.editingMode = true;
        this.branchService.getCurrentBranch(id).subscribe(res => {
            console.log(res);
            res.itemUnitBranches.forEach(
                e =>{
                    e.expireDate
                }
            )
            this.branch = res;
            console.log('branch is', this.branch);
            if (!this.branch.itemUnitBranches) {
                this.branch.itemUnitBranches = [];
            }
        });
    }

    justPrint() {
        this.printer.printDocument(this.branch, 'فرع', this.printerHeader);

    }

    saveAndPrint(justPrint = false) {
        if (justPrint) {
            this.printer.printDocument(this.branch, 'فرع', this.printerHeader);

        } else {
            this.handleSubmit(true);
        }
    }

    editUnitBranch(i) {
        console.log(i)
        this.itemUnitBranch = i;

        this.saveEdited(i)
      /*  this.viewSaveEdited = true;
        this.itemUnitBranch = i;
        this.itemUnitBranch.expireDate = new Date(this.itemUnitBranch.expireDate)
    */}

    saveEdited(i) {
        this.viewSaveEdited = false;
        let objectToSave = {
            id: this.itemUnitBranch.id,
            itemUnitId: this.itemUnitBranch.itemUnitId,
            expireDate: this.itemUnitBranch.expireDate,
            initialQuantity: this.itemUnitBranch.initialQuantity
        }
        this.branchService.saveItemUnitBranch(objectToSave).subscribe(
            (data:any)=>{
               // i=data
                this.branch.itemUnitBranches.forEach((element:any,index) => {
                    if(element.id==objectToSave.id){
                        this.branch.itemUnitBranches[index]=data
                     //   console.log(element,data,this.branch.itemUnitBranches)

                    }
                   

                });
               // this.branch.itemUnitBranches = []
               // this.resetUnitBranchForm();
              //  this.page.offset = 0;
               // this.getPaginatedItemUnit()
            }
        )
    }

    handleSubmit(print = false) {
        console.log(this.branch);
        this.branch.expensesBills = [];
        if (this.editingMode) {
            this.branchService
                .editBranch(this.branch, this.branch["id"])
                .subscribe(res => this.indicateSuccess(res, print));
        } else {
            this.branchService
                .addBranch(this.branch)
                .subscribe(res => this.indicateSuccess(res, print));
        }
    }

    indicateSuccess(res: any, print) {
        let i = 0;
        while (i < 1 && print) {
            this.printer.printDocument(this.branch, 'فرع', this.printerHeader);
            i = 1;
        }
        console.log(res);
        const msg = this.editingMode
            ? this.gT("messages.updateSuccess")
            : this.gT("messages.addSuccess");
        this.alertService.showMessage(msg);
        this.route.navigate(["/definitions/branch"]);
    }

    getAssociatedUnits(e) {
        this.itemUnitBranch.itemUnitId = null;
        this.canSelectFromUnits = e ? true : false;
        if(e){
            this.itemService.getAssociatedUnits(e.id).subscribe(res => {
                this.itemUnitSelect = res;
                console.log("itemUnitSelect", this.itemUnitSelect);
            });
        }
        
    }

    addUnitBranch(e) {
        if (this.itemUnitBranch.itemUnitId) {
            var itemUnit = this.itemUnitSelect.find(
                i => i.id == this.itemUnitBranch.itemUnitId
            );

            if (itemUnit) {
                let objectToPost = {
                    branchId: this.branch.id,
                    itemUnitId: this.itemUnitBranch.itemUnitId,
                    expireDate: this.itemUnitBranch.expireDate,
                    initialQuantity: this.itemUnitBranch.initialQuantity
                }
                this.branchService.addItemUnitBranch(objectToPost).subscribe(
                    (data: any) => {
                        this.resetUnitBranchForm();
                        this.branch.itemUnitBranches = [];
                        this.page.offset = 0;
                        this.getPaginatedItemUnit()
                    }
                )
            }
        }
    }

    // deleteUnitBranch(itemunit) {
    //     const target = this.branch.itemUnitBranches.indexOf(itemunit);
    //     this.branch.itemUnitBranches.splice(target, 1);
    //     console.log('this.branch.itemUnitBranches', this.branch.itemUnitBranches);

    // }

    //TransferUnitBranch(itemunit) {

    //}

    resetUnitBranchForm() {
        this.itemUnitBranch = {
            itemUnitId: null,
            branchId: null,
            initialQuantity: null,
            expireDate: null,
            itemId: null
        };
    }
}
