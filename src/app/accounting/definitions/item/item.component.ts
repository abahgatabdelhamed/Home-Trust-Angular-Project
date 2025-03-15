import { UserPreferencesService } from "./../services/user-preferences.service";
import { ItemService } from "./../services/item.service";
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef,
    Input
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { ItemCatService } from "../services/itemcat.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { ItemCat } from "../models/itemcat.model";
import { ItemCatInfoComponent } from "../itemcat/modal/itemcat-info.component";
import * as XLSX from "xlsx";
import { element } from "protractor";
import { Item } from "../models/item.model";
import { ItemModalComponent } from "./item-modal/item-modal.component";
import Page from "../models/page.model";
import { size, tap } from "underscore";
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { catchError, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ItemSearchService } from "../../shared/services/item-search.service";
import { Router } from '@angular/router'
import { Branch } from "../models/brach.model";
import { BranchService } from '../services/branch.service';



@Component({
    selector: "app-item",
    templateUrl: "./item.component.html",
    styleUrls: ["./item.component.css"]
})
export class ItemComponent implements OnInit {
    editingName: { nameAr: string };
    sourceItemCat: Item;
    editedItemCat: Item;
    rows: Item[] = [];
    rowsCache: Item[] = [];
    columns: any[] = [];
    page:Page = new Page(0, 0)
    loadingIndicator: boolean;
    gT = (key: string) => this.translationService.getTranslation(key);
    report: any;
    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        index: {
            title: this.gT("shared.index"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        code: {
            title: this.gT("shared.code"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        nameAr: {
            title: this.gT("shared.nameAr"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        nameEn: {
            title: this.gT("shared.nameEn"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
      
        itemCategoryName: {
            title: this.gT("shared.itemCategoryName"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        soldQuantity: {
            title: this.gT("shared.soldQuantity"),
            order: 6,
            excel_cell_header: "F1",
            isVis: true
        },
        cost: {
            title: this.gT("shared.cost"),
            order: 7,
            excel_cell_header: "G1",
            isVis: true
        },
        price: {
            title: this.gT("shared.price"),
            order: 8,
            excel_cell_header: "H1",
            isVis: true
        },
      
        
        specification: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatTypeDefaultValue: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatTypeId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        notes: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnits: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemPeopleId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemCategoryId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        imagePath: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemFeatures: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        vatTypeName: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemPeople: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        offerId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        offerItems: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        branchId: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        isOffer: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        }
    };
    public defaultBranch:Branch;

    @ViewChild("indexTemplate")
    indexTemplate: TemplateRef<any>;

    @ViewChild("editorModal")
    editorModal: ModalDirective;

    @ViewChild("itemModalEditor")
    itemModalEditor: ItemModalComponent;

    @ViewChild("actionsTemplate")
    actionsTemplate: TemplateRef<any>;

    @ViewChild("parentCategory")
    parentCategory: TemplateRef<any>;
    excelLabel: string = "Items";
    selectdItem
    items$: Observable<any[]>;
    itemSearchLoading = false;
    itemsInput$ = new Subject<string>();


    constructor(
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private itemcatService: ItemCatService,
        private itemService: ItemService,
        private excelService: ExcelService,
        private userPreferences: UserPreferencesService,
        private itemSearchService: ItemSearchService,
        private router: Router,
        private branchService:BranchService
    ) { }

    ngOnInit() {
        this.columns = [
            {
                prop: "index",
                name: "#",
                width: 30,
                cellTemplate: this.indexTemplate,
                canAutoResize: false
            },
            { prop: "id", name: this.gT("shared.id"), width: 40 },
            { prop: "code", name: this.gT("shared.code"), width: 40 },

            { prop: "nameAr", name: this.gT("shared.nameAr"), width: 70 },
            { prop: "nameEn", name: this.gT("shared.nameEn"), width: 70 },
            {
                prop: "itemCategoryName",
                name: this.gT("shared.itemCategoryName"),
                width: 70
            },
            
            {
                prop: "soldQuantity", name: this.gT("shared.soldQuantity"), width: 50
            },
            {
                prop: "cost",
                name: this.gT("shared.cost"),
                width: 70
            },
            {
                prop: "price",
                name: this.gT("shared.price"),
                width: 70
            },
            
            {
                prop: "discountPrice",
                name: this.gT("shared.discountPrice"),
                width: 70
            },
            
            { prop: "isOfferDisplay", name: "", width: 70 },
        ];
        if (this.canManageItemCat) {
            this.columns.push({
                name: "",
                width: 200,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false
            });
        }
        this.loadData();
        this.loadItems();
    }



    SearchSelected(){
        this.router.navigate(['definitions', 'item','add-item', this.selectdItem.id ])
    }

    private loadItems() {
        this.items$ =concat(
            of([]), // default items
            this.itemsInput$.pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                switchMap(term =>
                    this.itemSearchService
                        .getSearchItemNameEndpoint(term)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                        )
                )
            )
        );
    }



    ngAfterViewInit() {
        this.itemModalEditor.changesSavedCallback = () => {
            //this.addNewItemCatToList();
            this.editorModal.hide();
            this.loadData();
        };

        this.itemModalEditor.changesCancelledCallback = () => {
            this.editedItemCat = null;
            this.sourceItemCat = null;
            this.editorModal.hide();
        };
    }

    loadData() {
        this.branchService.getDefaultBranch().subscribe(
            (data:Branch)=>{
                this.defaultBranch = data;
            }
        )
      //  this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.itemService.getItems(this.page.offset+1, this.page.size).subscribe(
            items => {
                this.page.count = items.count
                this.onDataLoadSuccessful(items.data), console.error(items);
            },
            error => {
                this.onDataLoadFailed(error);
            }
        );
    }

    onDataLoadSuccessful(items: Item[]) {
        console.log(items);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        items.forEach((bt, index, itemcat) => {
            (<any>bt).index = index + 1;
            bt.isOfferDisplay = bt.isOffer ? "عرض" : "";
            bt.itemUnits.forEach(e => {
                e['isDefaultPurchDisplay'] = e.isDefaultPurc ? this.gT("shared.yes")
                : this.gT("shared.no");
                e['isDefaultSaleDisplay'] = e.isDefaultSale ? this.gT("shared.yes")
                : this.gT("shared.no");
                e['isWithVatDisplay'] = e.isWithVat ? this.gT("shared.yes")
                : this.gT("shared.no");
            });
        });

        this.rowsCache = [...items];
        this.rows = items;
    }

    onDataLoadFailed(error: any) {
      //  this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

       /* this.alertService.showStickyMessage(
            this.gT("messages.loadError"),
            `Unable to retrieve itemcat from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(
                error
            )}"`,
            MessageSeverity.error,
            error
        );*/
    }

    setPage(pageInfo:any){
        console.log(pageInfo)
        this.page.offset = pageInfo.offset;
        this.loadData();
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r =>
            Utilities.searchArray(value, false, r.nameAr, r.code, r.nameEn)
        );
    }

    addNewItemCatToList() {
        if (this.sourceItemCat) {
            Object.assign(this.sourceItemCat, this.editedItemCat);
            this.rows = [...this.rows];
            this.editedItemCat = null;
            this.sourceItemCat = null;
        } else {
            let itemcat = new Item();
            Object.assign(itemcat, this.editedItemCat);
            this.editedItemCat = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if (<any>u != null && (<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }
            (<any>itemcat).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, itemcat);
            this.rows.splice(0, 0, itemcat);
            this.rows = [...this.rows];
        }
    }

    onEditorModalHidden() {
        this.editingName = null;
        this.itemModalEditor.resetForm(true);
    }

    newItemCat() {
        this.editingName = null;
        this.sourceItemCat = null;
        this.editedItemCat = this.itemModalEditor.newItemCat();
        this.showModal();
    }

    editItemCat(row: Item) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceItemCat = row;
        this.editedItemCat = this.itemModalEditor.editItemCat(row);
        this.showModal();
    }

    onSelect(row) {
        this.editingName = { nameAr: row.nameAr };
        this.sourceItemCat = row;
        this.itemModalEditor.displayItemCat(row);
        this.showModal();
    }

    showModal() {
        this.transformDataToModal();
        this.editorModal.show();
    }

    deleteItemCat(row: Item) {
        this.alertService.showDialog(
            `${this.gT("messages.confirmDeleting")} ${row.nameAr} ?`,
            DialogType.confirm,
            () => this.deleteItemCatHelper(row)
        );
    }

    printReport() {
        let printContents, popupWin;
        printContents = document.getElementById('printedArea').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>

          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }

    // transaction(row: Item) {
    //     this.loadingIndicator = true;
    //     this.alertService.startLoadingMessage("جاري توليد التقرير...");
    //     this.itemService.transaction(row["id"]).subscribe(
    //         result => {
    //             console.log(result, row["id"]);
    //             this.report = result;
    //             this.alertService.stopLoadingMessage();
    //             this.loadingIndicator = false;
    //         },
    //         error => {
    //        //     this.alertService.stopLoadingMessage();
    //             this.loadingIndicator = false;

    //          /*   this.alertService.showStickyMessage(
    //                 this.gT("messages.deleteError"),
    //                 `An error occured whilst generating report.\r\nError: "${Utilities.getHttpResponseMessage(
    //                     error
    //                 )}"`,
    //                 MessageSeverity.error,
    //                 error
    //             );*/
    //         }
    //     );
    // }

    deleteItemCatHelper(row: Item) {
        this.alertService.startLoadingMessage(this.gT("messages.deleting"));
        this.loadingIndicator = true;
        this.itemService.deleteitem(row["id"]).subscribe(
            result => {
                console.log(result, row["id"]);
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row);
                this.rows = this.rows.filter(item => item !== row);
            },
            error => {
               // this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

               /* this.alertService.showStickyMessage(
                    this.gT("messages.deleteError"),
                    `An error occured whilst deleting the itemcat.\r\nError: "${Utilities.getHttpResponseMessage(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );*/
            }
        );
    }

    get canManageItemCat() {
        //return this.accountService.userHasPermission(
        //    Permission.manageItemCatPermission
        //);
        return true;
    }

    transformDataToModal() {
        Object.assign(
            this.itemModalEditor.allItemCategoryParent,
            this.rowsCache
        );
    }
    getRemovedHeadersArray() {
        let list: string[] = [];
        for (var key in this.headers) {
            if (this.headers[key].isVis == false) {
                list.push(key);
            }
        }
        return list;
    }

    getOrderedHeadersArray() {
        let list: string[] = [];
        let counter: number = 1;
        while (true) {
            let isFounded: boolean = false;
            for (var key in this.headers) {
                if (this.headers[key].order == counter) {
                    list.push(key);
                    isFounded = true;
                    break;
                }
            }
            if (!isFounded) {
                break;
            }
            counter++;
        }
        return list;
    }
    async getDataForExport(){

        return this.itemService.getItems(-1, -1).toPromise().then(items => items.data)

    }

    async exportAsXLSX() {
        this.loadingIndicator = true;
        let rows = await this.getDataForExport();
        rows.forEach((element ,index)=> {
            element.index=index+1
        });
        this.loadingIndicator = false;
        let exportedRows: any[] = [];
        Object.assign(exportedRows, rows);
        let removedKeyArr: string[] = this.getRemovedHeadersArray();
        for (var removedKey of removedKeyArr) {
            for (var row of exportedRows) {
                delete row[removedKey];
            }
        }
        let orderedKeyArr: string[] = this.getOrderedHeadersArray();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            exportedRows,
            { header: orderedKeyArr }
        );
        for (var key in this.headers) {
            if (
                this.headers[key].isVis &&
                this.headers[key].excel_cell_header != ""
            ) {
                worksheet[this.headers[key].excel_cell_header].v = this.headers[
                    key
                ].title;
            }
        }

        console.error(worksheet);
        this.excelService.exportAsExcelFile(worksheet, this.excelLabel);

    }
}
