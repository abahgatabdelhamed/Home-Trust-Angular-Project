export interface shiftItem{
    id: any,
    name: string,
    quantity: any,
    price: any
}
export interface viewShift{
    items:shiftItem[];
    soldBalance:any
    madaSoldBalance?:any
    cashSoldBalance?:any
    startedDate:Date
    totalHour:any
    userName:any
}