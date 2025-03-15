export interface ServiceTypeInterface {
    nameAr: string;
    code: string;
    nameEn: string;
    defaultCost: number;
    vatTypeId: number;
    notes: string;
    index?: number;
}

export class ServiceType {
    public nameAr: string;
    public code: string;
    public nameEn: string;
    public defaultCost: number;
    public vatTypeId: number;
    public notes: string;
    public index?: number;
}
