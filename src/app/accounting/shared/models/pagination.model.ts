export class Pagination<T>{
    public currentPageNumber: number;
    public totalPages: number;
    public totalCount: number;
    public content: T[];
    constructor(){
        
    }
}