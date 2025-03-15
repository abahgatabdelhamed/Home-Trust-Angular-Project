export interface PrintOptions {
    header: string;
    footer: string;
    type: boolean;
    notes: string;
    defaultPrinter?: boolean;
    defaultPrinterDisplay?: string;
}
export interface ThermalPrintOptions {
    branchName: string;
    mobile: string;
    phone: string;
    address: boolean;
    header: string;
    footer: string;
    terms: string;
    replacementTerms: string;
    defaultThermalPrinterDisplay?: string;
    defaultThermalPrinter?: boolean;
}
