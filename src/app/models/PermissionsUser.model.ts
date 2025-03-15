export class PermissionsUser{
     id:number;
     isActive:boolean
     groupCode:string
     features:features[];
     name:string;
     arabicName:string
}
export class features{
     id: number;
     name: string;
     arabicName: string;
     description: string;
     featureCode: string;
     isActive: boolean
}
   