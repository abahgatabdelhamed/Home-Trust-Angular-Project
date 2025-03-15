import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BranchService } from '../../definitions/services/branch.service';
import * as XLSX from "xlsx";
import { ExcelService } from '../../../services/excel.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { FilterData } from '../../shared/models/branch-cc-filter.model';
import { CostCenterService } from '../../definitions/services/cost-center.service';
import { CostCenterModel } from '../../shared/models/cost-center.model';
import { CheckPermissionsService } from '../../../services/check-permissions.service';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.itemName.indexOf(filter) !== -1 || item.itemUnitName.indexOf(filter) !== -1);
    }
}


@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
    CCPermissions:boolean=false
    branchs: any;
    keyword: any;
    filterData: FilterData = {
        selectedBillType: '',
        selectedBranch: null,
        selectedCC: null,
        selectedExpensesId: null,
        serachModel:{from:null,to:null}
    };
    selsectedCC: string;
    constructor(private costCenterService: CostCenterService,private branchService: BranchService, private translationService: AppTranslationService, private excelService: ExcelService,
        private checkPermissions:CheckPermissionsService 
            
        
        ) { }
    
    
        ngOnInit() {
            this.CCPermissions=this.checkPermissions.checkGroup(6,11)
        this.branchService.getWarehouseInventory(null,null).subscribe(
            branchs => {
                console.log(branchs);
                this.branchs = branchs
            }
        );
    }

    gT = (key: string) => this.translationService.getTranslation(key);

    headers = {
        id: {
            title: "",
            order: 0,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitName: {
            title: this.gT("shared.itemUnitName"),
            order: 1,
            excel_cell_header: "A1",
            isVis: true
        },
        itemName: {
            title: this.gT("shared.itemName"),
            order: 2,
            excel_cell_header: "B1",
            isVis: true
        },
        code: {
            title: this.gT("shared.code"),
            order: 3,
            excel_cell_header: "C1",
            isVis: true
        },
        initialQuantity: {
            title: this.gT("shared.initialQuantity"),
            order: 4,
            excel_cell_header: "D1",
            isVis: true
        },
        realQuantity: {
            title: this.gT("shared.realQuantity"),
            order: 5,
            excel_cell_header: "E1",
            isVis: true
        },
        branchId: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        itemUnitId: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        quantity: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        expireDate: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        branch: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        costCenter: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
        costCenterId: {
            title: '',
            order: -1,
            excel_cell_header: "",
            isVis: false
        },
    };

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

    exportAsXLSX(branch): void {
        let exportedRows: any[] = [];
        Object.assign(exportedRows, branch['itemUnitBranches']);
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
        this.excelService.exportAsExcelFile(worksheet, branch.name);
    }

    filter(filterData){
        this.selsectedCC=null
        console.log(filterData)

    this.filterData=filterData
       console.log(filterData,this.filterData)
       this.branchService.getWarehouseInventory(this.filterData.selectedBranch,this.filterData.selectedCC).subscribe(
        branchs => {
            console.log(branchs);
            this.branchs = branchs
            
        }
        

    );
    if(filterData.selectedCC){
        this.costCenterService.getAllByBranch(this.filterData.selectedBranch).subscribe(
            (data:CostCenterModel[])=>{
            
              data.forEach(element => {
                if(element.id==filterData.selectedCC)
                this.selsectedCC=element.nameAr
              });
            },
            (error:any)=> console.error(error)
          )    
    }
      // this.handleSubmit()
       
    }
}

