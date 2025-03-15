export class VatType {
    constructor() {}
    public id?: number;
    public name: string;
    public defaultValue: number;
    public isDefault: boolean;
    public isDefaultDisplay?: string;
    public notes?: string;
}

export interface VatTypeInterface {
    id?: number;
    name: string;
    defaultValue: number;
    isDefault: boolean;
    isDefaultDisplay?: string;
    notes?: string;
}
