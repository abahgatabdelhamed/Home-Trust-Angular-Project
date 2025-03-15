export class Supplier {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {}

    public id: number;
    public phone: string;
    public nameAr: string;
    public nameEn: string;
    public notes?: string;
    public vatNumber: number;
    public canLoan: boolean;
    public loanLimit: number;
    public email: string;
    public city: string;
    public bills: any[];
    public identificationNumber?:string
    public mobile: string;
    public neighborhood: string;
    public fax: string;
    public personTypeId?: number;
    public isDefault?: boolean;
    public canLoanDisplay?: string;
}

export interface SupplierInterface {
    id: number;
    phone: string;
    nameAr: string;
    notes?: string;
    nameEn: string;
    vatNumber: number;
    canLoan: boolean;
    loanLimit: number;
    email: string;
    city: string;
    bills: any[];
    identificationNumber?:string
    mobile: string;
    neighborhood: string;
    fax: string;
    personTypeId?: number;
    isDefault?: boolean;
    canLoanDisplay?: string;
}
