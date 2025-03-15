import { Injectable } from "@angular/core";
import { Expenses } from "../models/expenses.model";
import { ExpensesEndpoint } from "./expenses-endpoint.service";
import { Observable } from "rxjs/Observable";
import { Pagination } from "../../shared/models/pagination.model";

@Injectable()
export class ExpensesService {
    constructor(private expensesEndpoint: ExpensesEndpoint) {}

    newExpenses(expenses: Expenses) {
        return this.expensesEndpoint.getNewExpensesEndpoint<Expenses>(expenses);
    }

    updateExpenses(expenses: Expenses) {
        return this.expensesEndpoint.getUpdateExpensesEndpoint<Expenses>(
            expenses,
            expenses.id
        );
    }

    getExpensess(searchModel,searchQuery:string, branchId:number,costCenterId:number, selectedExpensesId:number, pageSize: number, page: number):Observable<Pagination<Expenses>> {
        return this.expensesEndpoint.getExpensessEndpoint<Pagination<Expenses>>(
            searchModel,
            searchQuery,
            branchId,
            costCenterId,
            selectedExpensesId,
            pageSize,
            page
        );
    }

    getExpensesInit() {
        return this.expensesEndpoint.getExpensesInitEndpoint();
    }

    deleteExpenses(expensesOrExpensesId: number): Observable<Expenses> {
        return this.expensesEndpoint.getDeleteExpensesEndpoint<Expenses>(
            expensesOrExpensesId
        );
    }


    refundBill(id, date){
        return this.expensesEndpoint.refundBill(id, date);
    }

    getAvailableExpensesBillForRefunde(){
        return this.expensesEndpoint.getAvailableExpensesBillForRefunde();
    }
}
