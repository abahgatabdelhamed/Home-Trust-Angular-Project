export class AccountType{
    constructor(
        public id?:number,
        public name?:string,
        public isDefault?:boolean,
        public accounts?:any[]
    ){}
}