export class Person {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public personId: number;
    public nameAr: string;
    public nameEn: string;
    public personType: string;


    createFakePeople(): Person[] {
        const mohammed = new Person();
        mohammed.personId = 1;
        mohammed.nameAr = "محمد";
        mohammed.nameEn = "Mohammed";
        mohammed.personType = "customer";
        const khaled = new Person();
        mohammed.personId = 2;
        mohammed.nameAr = "خالد";
        mohammed.nameEn = "khaled";
        mohammed.personType = "seller";
        const sami = new Person();
        sami.personId = 3;
        sami.nameAr = "سامي";
        sami.nameEn = "Sami";
        sami.personType = "customer";
        const rima = new Person();
        mohammed.personId = 1;
        mohammed.nameAr = "ريما";
        mohammed.nameEn = "Rima";
        mohammed.personType = "seller";
        return [mohammed, khaled, sami, rima];
    }
}
