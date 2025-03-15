export class ExpensesTemplateModel{
    
    public nameAr: string;
    public nameEn: string;
    public index?: number;
    public id?: number;
    public treeHeadId?: number;

    constructor(nameAr?: string, nameEn?: string){
        this.nameAr = nameAr ? nameAr : "";
        this.nameEn = nameEn ? nameEn : "";
    }

}
