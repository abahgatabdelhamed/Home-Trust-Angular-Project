export class PrinterSettings {
    public header: string;
    public footer: string;
    public defaultPrinter?: boolean;
    public defaultPrinterDisplay?: string;
    public tobaccoTrade?:boolean
}

export interface PrinterSettingsInterface {
    header: string;
    footer: string;
     address?: string;

    defaultPrinter?: boolean;
    defaultPrinterDisplay?: string;
}
export class ThermalPrinterSettings {
    public header: string;
    public footer: string;
    public shopName: string;
    public address?: string;
    public shopNameEn: string;
    public phone: string;
    public mobile: string;
    public vatNumber: string;
    public terms?: string;
    public replacementTerms?: string;
    public defaultThermalPrinterDisplay?: string;
    public defaultThermalPrinter?: boolean;
    public tobaccoTrade?:boolean
}

export interface ThermalPrinterSettingsInterface {
    header: string;
    footer: string;
    address?: string;

    shopName: string;
    shopNameEn: string;
    phone: string;
    mobile: string;
    vatNumber: string;
    terms?: string;
    replacementTerms?: string;
    defaultThermalPrinterDisplay?: string;
    defaultThermalPrinter?: boolean;
}
