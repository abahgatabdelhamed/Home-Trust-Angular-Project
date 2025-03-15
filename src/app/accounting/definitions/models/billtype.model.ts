// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

export class BillType {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id?: number, name?: string, code?: string) {

        this.id = id;
        this.name = name;
        this.code = code;
    }

    public id: number;
    public name: string;
    public code: string;
}
