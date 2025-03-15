import { PrintItemService } from './../services/item.print.service';
import { TranslateService } from "@ngx-translate/core";
import { ItemCatService } from "./../services/itemcat.service";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap,
    catchError
} from "rxjs/operators";
import { ItemUnit, ItemUnitInitialValue } from "./../models/item-unit.model";
import { ItemService } from "./../services/item.service";
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    TemplateRef,
    Input,
    NgZone
} from "@angular/core";
import {
    AlertService,
    DialogType,
    MessageSeverity
} from "../../../services/alert.service";
import { AppTranslationService } from "../../../services/app-translation.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { ExcelService } from "../../../services/excel.service";
import { Permission } from "../../../models/permission.model";
import { ItemCat } from "../models/itemcat.model";
import { ItemCatInfoComponent } from "../itemcat/modal/itemcat-info.component";
import { element } from "protractor";
import { ItemInterface } from "../models/item.model";
import { e } from "@angular/core/src/render3";
import {
    ItemFeature,
    ItemFeatureInitialValue
} from "../models/item-feature.model";
import { SupplierService } from "../services/supplier.service";
import { Supplier } from "../models/supplier.model";
import { createElement } from '@angular/core/src/view/element';
import { CheckPermissionsService } from '../../../services/check-permissions.service';
import { SettingsService } from '../../../services/settings.service';
import { ToastyService } from 'ng2-toasty';

@Component({
    selector: "app-add-item",
    templateUrl: "./add-item.component.html",
    styleUrls: ["./add-item.component.css"]
})
export class AddItemComponent {
    hasClickedEdit = false;
    imgPath = '';
    hasClickedEditFeature = false;
    editingUnit = { editing: false, target: 0 };
    editingFeature = { editing: false, target: 0 };
    editingMode: boolean;
    categries;
    people;
    vatTyepes;
    //All variables for Vat included helper
    u_priceWithoutVat = 0;
    u_priceCents = 0;
    u_vat = 0;
    u_priceWithVat = 0;
    isWithVat: boolean = false;
    //
    itemOffer = { id: 0 };
    isEdit: boolean = false;
    isDefaultPurcExist: boolean = false
    isDefaultSaleExist: boolean = false
    Exist: boolean = false
    public item3input$ = new Subject<string>();
    public item3$: Observable<any[]>;
    public item3Loading: boolean = false;
    public selectedItem: any;
    uploadDone = false;
    item: ItemInterface = {
        itemIndex: 0,
        code: "",
        nameAr: "",
        nameEn: "",
        notes: "",
        itemCategoryId: 0,
        itemCategoryName: "",
        vatTypeId: 0,
        vatType: {},
        vatTypeTwoId: null,
        //   vatTypes: [],
        imagePath: "",
        itemPeopleId: [],
        offerItems: [],
        itemUnits: [],
        itemFeatures: [],
        specification: "",
        vatTypeName: "",
        realQuantity: 0,
        initialQuantity: 0,
        offerId: null,
        isOffer: false

    };
    //itemUnit: ItemUnit = ItemUnitInitialValue;
    itemUnit: ItemUnit = new ItemUnit();
    itemFeature: ItemFeature = ItemFeatureInitialValue;
    gT = (key: string) => this.translationService.getTranslation(key);
    isVatEnable: boolean;
    transferAmount: boolean;

    constructor(
        private itemService: ItemService,
        private itemCat: ItemCatService,
        private navigator: Router,
        private alertService: AlertService,
        private  toastyService: ToastyService,
        private router: ActivatedRoute,
        private translationService: AppTranslationService,
        private printService: PrintItemService,
        public checkPermissions: CheckPermissionsService,
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.settingsService.getSetting().subscribe(res => {
            this.isVatEnable = res.isVatEnable;

        })
        this.router.params.subscribe(params => {
            if (params.id) {
                this.loadItemDate(params.id);
                this.isEdit = true;
                this.itemUnit = new ItemUnit();
            }
        });
        this.loadInit();
        this.loadItem3();
    }

    nearestCentsValue(remainedCents) {
        if (remainedCents >= 0.8) {
            return 0.8
        }
        if (remainedCents >= 0.6) {
            return 0.6
        }
        if (remainedCents >= 0.4) {
            return 0.4
        }
        if (remainedCents >= 0.2) {
            return 0.2
        }
        return 0
    }
    setvattype() {

        this.item.vatTypeTwoId = 0
    }
    utilityChanged(centsChanged = false) {
        console.log(this.u_priceCents)
        let priceWithoutVat = this.u_priceWithVat / 1.15;
        this.u_priceWithoutVat = this.truncatDecimals(priceWithoutVat, 0)
        if (!centsChanged) {
            this.u_priceCents = this.nearestCentsValue(priceWithoutVat - this.u_priceWithoutVat)
        }
        this.u_vat = (+this.u_priceCents + this.u_priceWithoutVat) * 0.15
        this.u_priceWithVat = (+this.u_priceCents + this.u_priceWithoutVat) * 1.15
    }
    approvePrice() {
        this.isWithVat = false;
        this.itemUnit.price = +this.u_priceCents + this.u_priceWithoutVat
        this.u_priceWithoutVat = 0
        this.u_priceWithVat = 0
        this.u_priceCents = 0
        this.u_vat = 0
    }

    truncatDecimals(num, afterPointDigits) {
        if (num.toString().indexOf(".") === -1) {
            return num
        }
        return +num.toString().slice(0, (num.toString().indexOf(".")) + (afterPointDigits + 1));
    }

    loadItemDate(id) {
        this.editingMode = true;
        this.itemService.getCurrentItem(id).subscribe(item => {
            this.item = item;
            console.log(item);
            if (this.item['itemPeople']) {
                this.item.itemPeopleId = this.item['itemPeople'].map(e => e['personId']);
            }
            if (!item.itemUnits) {
                this.item.itemUnits = []
            }
            if (!item.itemFeatures) {
                this.item.itemFeatures = []

            }
            console.log('current item people are', this.item.itemPeopleId)
            if (this.item.itemUnits) {
                item.itemUnits.forEach((unit, index) => {
                    if(unit.transferAmount==1&&!unit.isFeature)
            this.transferAmount=true
                    if (unit.isDefaultPurc)
                        this.isDefaultPurcExist = true
                    if (unit.isDefaultSale)
                        this.isDefaultSaleExist = true
                    unit["isDefaultPurchDisplay"] = unit.isDefaultPurc
                        ? this.gT("shared.yes")
                        : this.gT("shared.no");
                    unit["isDefaultSaleDisplay"] = unit.isDefaultSale
                        ? this.gT("shared.yes")
                        : this.gT("shared.no");
                    unit["isWithVatDisplay"] = unit.isWithVat
                        ? this.gT("shared.yes")
                        : this.gT("shared.no");

                    unit["isAdditionDisplay"] = unit.isFeature
                        ? this.gT("shared.yes")
                        : this.gT("shared.no");
                });
            }
            console.log("item is", this.item);
        });
    }

    watch(e) {
        console.log(e.target.value);
    }

    public showErrorAlert(caption: string, message: string) {
        //   this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    loadInit() {
        this.itemService.getInitItem().subscribe(inits => {
            console.log("init is", inits);
            this.vatTyepes = inits.vatTypes;
            if (this.item.id == null) {
                this.item.vatTypeId = this.vatTyepes[0].id;
                console.log(this.vatTyepes)

            }
            this.vatTyepes.splice(2, 1)
            this.people = inits.people;
            this.categries = inits.itemCategories;
            console.log(inits.people);
            if (!this.isVatEnable)
                this.item.vatTypeId = 1012
        });
    }

    saveAndPrint(justPrint = false) {
        
        let count:number=0
      this.item.itemUnits.forEach(u =>{
           if(u.transferAmount==1){
            count++
           }
      })
      if(count>1)
      this.transferAmount=false
       if(!this.isDefaultPurcExist||!this.isDefaultSaleExist)
       {
        this.alertService.showMessage(this.gT("messages.isDefaultReqiered"), "", MessageSeverity.error)
        this.alertService.showDialog(
            this.gT("messages.isDefaultReqiered"),
           
        );
        return
      
       }
       if(!this.transferAmount)
       {
        this.alertService.showMessage(this.gT("messages.transferAmount"), "", MessageSeverity.error)
        this.alertService.showDialog(
            this.gT("messages.transferAmount"),
           
        );
        return
      
       }

        this.item.itemPeople = this.item.itemPeopleId.reduce((acc, curr) => {
            const person = this.people.find(e => e.id == curr);
            acc.push(person);
            return acc;
        }, []);

        const vat = this.vatTyepes.find(e => e.id == this.item.vatTypeId);
        if (vat) {
            this.item.vatTypeName = vat.name;
        }

        const cat = this.categries.find(e => e.id == this.item.itemCategoryId);
        if (cat) {
            this.item.itemCategoryName = cat.nameAr;
        }
        console.log('ppl are', this.item.itemPeople);
        if (justPrint) {

            this.printService.printDocument(this.item, "صنف", "ترويشة");
        }
        else {
            this.handleSubmit(true);
        }
    }

    justPrint() {
        this.saveAndPrint(true);
    }

    getLogo(res): string {
        return res;
    }
    fileToUpload: any;
    handleFileChange(e: MouseEvent) {
        let reader = new FileReader();
        if (event.target['files'] && event.target['files'].length > 0) {
            const file = new FormData();
            file.append('files', event.target['files'][0]);
            file.append('fileName', event.target['files'][0].name);
            this.preview(event.target['files']);
            this.fileToUpload = file;
        }
    }
    preview(files) {
        if (files && files[0]) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = e => this.imgURL = reader.result;

            reader.readAsDataURL(file);
        }
    }
    public imagePath;
    imgURL: any;

    handleSubmit(printable = false) {

        let count:number=0
      this.item.itemUnits.forEach(u =>{
           if(u.transferAmount==1){
            count++
           }
      })
      if(count>1)
      this.transferAmount=false
       if(!this.isDefaultPurcExist||!this.isDefaultSaleExist)
       {
        this.alertService.showMessage(this.gT("messages.isDefaultReqiered"), "", MessageSeverity.error)
        this.alertService.showDialog(
            this.gT("messages.isDefaultReqiered"),
           
        );
        return
      
       }
       if(!this.transferAmount)
       {
        this.alertService.showMessage(this.gT("messages.transferAmount"), "", MessageSeverity.error)
        this.alertService.showDialog(
            this.gT("messages.transferAmount"),
           
        );
        return
      
       }

        if (this.item.vatTypeTwoId)
            this.item.vatTypeTwoId = 1013
        else
            this.item.vatTypeTwoId = null
        console.log(this.item);
        if (this.fileToUpload) {
            console.log(this.fileToUpload[0]);

            this.itemService.uploadFile(this.fileToUpload).subscribe(res => {
                this.item.imagePath = "uploads/" + res;
                this.uploadDone = true;
                console.log(res);
                console.log(this.item.imagePath);
                console.log(this.item);
                let i = 0;
                while (printable && i < 1) {
                    this.printService.printDocument(this.item, "صنف", "ترويشة");
                    i = 1;
                }
                let newItemPeople = [];
                if (this.item.itemPeopleId != undefined) {
                    this.item.itemPeopleId.forEach(i => {
                        var t = {};
                        t["PersonId"] = i;
                        t["ItemId"] = this.item.id;
                        newItemPeople.push(t);
                    });
                    this.item.itemPeople = newItemPeople;
                }
                if (!this.editingMode) {
                    this.itemService.newItemCat(this.item).subscribe(item => {
                        this.indicateSuccess();
                    });
                } else {
                    this.itemService
                        .updateitem(this.item, this.item.id)
                        .subscribe(res => {
                            this.indicateSuccess();
                        });
                }
            });
        } else {
            let i = 0;
            while (printable && i < 1) {
                this.printService.printDocument(this.item, "صنف", "ترويشة");
                i = 1;
            }
            let newItemPeople = [];
            if (this.item.itemPeopleId != undefined) {
                this.item.itemPeopleId.forEach(i => {
                    var t = {};
                    t["PersonId"] = i;
                    t["ItemId"] = this.item.id;
                    newItemPeople.push(t);
                });
                this.item.itemPeople = newItemPeople;
            }
            if (!this.editingMode) {
                this.itemService.newItemCat(this.item).subscribe(item => {
                    this.indicateSuccess();
                });
            } else {
                this.itemService
                    .updateitem(this.item, this.item.id)
                    .subscribe(res => {
                        this.indicateSuccess();
                    });
            }
        }

    }

    indicateSuccess() {
        const msg = this.editingMode
            ? this.gT("messages.updateSuccess")
            : this.gT("messages.addSuccess");
        // this.alertService.showMessage(msg);
        this.navigator.navigate(["/definitions/item"]);
    }

    pushUnit() {
        console.log('edit')
        if (!this.itemUnit.name) {
            return;
        }
         if(this.itemUnit.isDefaultPurc)
         this.item.itemUnits.map(val => val.isDefaultPurc=false)
         if(this.itemUnit.isDefaultSale)
         this.item.itemUnits.map(val => val.isDefaultSale=false)
        if (this.editingUnit.editing) {
            const target = this.item.itemUnits.find(
                e => e.id === this.editingUnit.target
            );
            const index = this.item.itemUnits.indexOf(target);
            this.item.itemUnits.splice(index, 1);
            this.item.itemUnits.splice(index, 0, this.itemUnit);
        }
        this.item.itemUnits.push(this.itemUnit);
        this.isDefaultPurcExist=false
        this.isDefaultSaleExist=false
        this.transferAmount=false
        this.item.itemUnits.forEach(unit => {
            if(unit.transferAmount==1&&!unit.isFeature)
            this.transferAmount=true
            if (unit.isDefaultPurc)
                this.isDefaultPurcExist = true
            if (unit.isDefaultSale)
                this.isDefaultSaleExist = true
            unit["isDefaultPurchDisplay"] = unit.isDefaultPurc
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isDefaultSaleDisplay"] = unit.isDefaultSale
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isWithVatDisplay"] = unit.isWithVat
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isAdditionDisplay"] = unit.isFeature
                ? this.gT("shared.yes")
                : this.gT("shared.no");

        });
        // if (!this.isDefaultPurcExist)
        //     this.preparePurchItemUnits()
        // if(!this.isDefaultSaleExist)
        //    this.prepareSaleItemUnits()

        this.itemUnit = {
            id: 0,
            name: "",
            nameEn:'',
            isDefaultPurc: false,
            isDefaultSale: false,
            transferAmount: 0,
            itemId: 0,
            price: 0,
            cost: 0,
            barCode: "",
            notes: "",
            isWithVat: false,
            isFeature: false
        };
        console.log(this.isDefaultPurcExist, this.isDefaultSaleExist)
    }
    isAdditionTrigger(checked) {

        this.itemUnit.isDefaultPurc = false
        this.itemUnit.isDefaultSale = false
    }
    isDefaultPurcTrigger(checked) {
        this.itemUnit.isFeature = false
    }
    isDefaultSaleTrigger(checked) {
        this.itemUnit.isFeature = false
    }
    pushFeature() {
        if (!this.itemFeature.name || !this.itemFeature.price) {
            return;
        }
        this.item.itemFeatures.push(this.itemFeature);
        this.itemFeature = {
            id: 0,
            name: "",
            price: 0
        };
    }
    checktobaco(e) {
        console.log(e)


    }
    editUnit(unit) {
        this.itemUnit = unit;
        console.log('itemUnit', this.itemUnit);
        this.editingUnit = { editing: true, target: unit["id"] };
        this.hasClickedEdit = true;
        console.log(this.editingUnit);
    }

    editFeature(f) {
        this.itemFeature = f;
        this.hasClickedEditFeature = true
        this.editingFeature = { editing: false, target: 0 };
    }

    deleteUnit(unit) {
        console.log(unit);
        const indexTarget = this.item.itemUnits.indexOf(unit);
        this.item.itemUnits.splice(indexTarget, 1);
    }

    saveEdited() {
         if(this.itemUnit.isDefaultPurc){
            this.item.itemUnits.map(val => val.isDefaultPurc=false)
            this.itemUnit.isDefaultPurc=true
         }
         
         if(this.itemUnit.isDefaultSale){
            this.item.itemUnits.map(val => val.isDefaultSale=false)
            this.itemUnit.isDefaultSale=true
        
         }
         
        this.editingUnit = { editing: false, target: null };
        this.isDefaultPurcExist=false
        this.isDefaultSaleExist=false
        this.transferAmount=false
        this.hasClickedEdit = false;
        this.item.itemUnits.forEach(unit => {
            if(unit.transferAmount==1&&!unit.isFeature)
            this.transferAmount=true
            if (unit.isDefaultPurc)
                this.isDefaultPurcExist = true
            if (unit.isDefaultSale)
                this.isDefaultSaleExist = true
            unit["isDefaultPurchDisplay"] = unit.isDefaultPurc
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isDefaultSaleDisplay"] = unit.isDefaultSale
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isWithVatDisplay"] = unit.isWithVat
                ? this.gT("shared.yes")
                : this.gT("shared.no");
            unit["isAdditionDisplay"] = unit.isFeature
                ? this.gT("shared.yes")
                : this.gT("shared.no");

        });
      
        this.itemUnit = {
            id: 0,
            name: "",
            isDefaultPurc: false,
            isDefaultSale: false,
            transferAmount: 0,
            itemId: 0,
            price: 0,
            cost: 0,
            barCode: "",
            notes: "",
            isWithVat: false,
            isFeature: false
        };
    }

    saveFeatureEdited() {
        this.hasClickedEditFeature = false;
        this.editingFeature = { editing: false, target: null };
        this.itemFeature = {
            id: 0,
            name: "",
            price: 0
        };
    }

    itemSearchSelected(item) {
        if (item) {
            this.item.offerItems.push(item.item);
        }
    }

    private loadItem3() {
        this.item3$ = concat(
            of([]), // default items
            this.item3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.item3Loading = true)),
                switchMap(term =>
                    this.itemService
                        .getSearchItemEndpointExchange(term)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.item3Loading = false))
                        )
                )
            )
        );
    }
    deleteFeature(f) {
        const indexTarget = this.item.itemFeatures.indexOf(f);
        this.item.itemFeatures.splice(indexTarget, 1);
    }

    deleteItemOffer(f) {
        const indexTarget = this.item.offerItems.indexOf(f);
        this.item.offerItems.splice(indexTarget, 1);
    }
    changeFormProcess(event) {
        var target = event.target;
        target.checked ? this.item.isOffer = !this.item.isOffer : this.item.isOffer;
        console.log("this.item.isOffer", this.item.isOffer);
    }
}
