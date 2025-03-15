import { Base } from "./base.model";
import { ExpensesTreeModel } from "./expenses-tree";
import { ItemUnitBranch } from "../../definitions/models/item-unit-branch";
import { nodeChildrenAsMap } from "@angular/router/src/utils/tree";



export class CostCenterModel extends Base{

    id?: number;
    index?: number;
    nameAr: string;
    nameEn: string;
    itemId: number;
    item?: {id: number, nameAr: string, nameEn: string};
    startDate: Date;
    closedDate?: Date;
    status?: number;
    branchId: number;
    branch?: {id: number, name:string};
    isDeleted?: boolean;
    expensesTreeHeadId?: number;
    treeOfExpensesNodes?: {data: ExpensesTreeModel[]};
    itemUnitBranches?: ItemUnitBranch[];
    
    constructor(){
        super();
        this.id = null;
        this.nameAr = '';
        this.nameEn = '';
        this.startDate = new Date();
        this.branchId = null;
        this.itemId = null;
        this.itemUnitBranches = []
    }

    

}

export interface summarizedTreeNode{
    'name': string,
     'id': number
    }

export class CostCenterHelper{
    constructor(private CostCenter:CostCenterModel){

    }

    public  flatExpensesLables(accumelatedflatedLabels:summarizedTreeNode[]){
        this.getFlatedLabels(accumelatedflatedLabels, this.CostCenter.treeOfExpensesNodes.data[0], null);
    }

    private getFlatedLabels(accumelatedflatedLabels:summarizedTreeNode[], node:ExpensesTreeModel
        , parent: ExpensesTreeModel){
        if(node.children.length < 1){
            let object_to_push = {
                name: parent.data.nameAr+'/'+node.data.nameAr,
                id: node.data.id
            }
            if(parent)
                accumelatedflatedLabels.push(object_to_push)
        }
        else{
            for(let child of node.children){
                this.getFlatedLabels(accumelatedflatedLabels, child, node);
            }
        }
    }
}