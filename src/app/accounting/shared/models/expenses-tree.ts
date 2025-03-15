export class ExpensesTreeItemModel {
    id?: number;
    nameAr: string;
    nameEn: string;
    expensesTreeId?: number;

    constructor(){
        this.nameAr = "";
        this.nameEn = "";
        this.id = null;
        this.expensesTreeId = null;
    }

}

export class ExpensesTreeNodeModel {
    id?: number;
    nameAr: string;
    nameEn: string;
    parentId?: number;

    constructor(){
        this.nameAr = "";
        this.nameEn = "";
        this.id = null;
        this.parentId = null;
    }

}

export class ExpensesTreeModel {
    data: ExpensesTreeNodeModel;
    children: ExpensesTreeModel[];

    constructor(){
        this.data = new ExpensesTreeNodeModel();
        this.children = [];
    }
}

