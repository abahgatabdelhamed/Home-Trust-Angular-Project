import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class FileService {
    constructor(private http: HttpClient) {}

    public getJSON() {
        return Observable.of(
            require("../../../assets/locale/sbill-table.json")
        );
    }
}
