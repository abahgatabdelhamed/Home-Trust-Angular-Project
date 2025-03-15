
import { environment } from '../../../../environments/environment';

export default class Page{
   public size = environment.pagination.size;
    constructor(public offset:number,
        public count?:number){

    }
}
