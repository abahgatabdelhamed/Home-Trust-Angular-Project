import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-tabs',
  templateUrl: './sale-tabs.component.html',
  styleUrls: ['./sale-tabs.component.css']
})
export class SalesTabsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
      this.router.navigate(['/sales/bill/sale'])
  }

  setBackgroundColor(currentTab) {
    const sales = document.querySelector(".sales");
    const purch = document.querySelector(".purch");
    const bill = document.querySelector(".bill");
      const exchange = document.querySelector(".exchange");
    if (currentTab == "sales") {
        sales.classList.add("current");
        purch.classList.remove("current");
        bill.classList.remove("current");
        exchange.classList.remove("current");
    } else if (currentTab == "purch") {
        purch.classList.add("current");
        sales.classList.remove("current");
        bill.classList.remove("current");
        exchange.classList.remove("current");
    } else if (currentTab == "bill") {
        purch.classList.remove("current");
        sales.classList.remove("current");
        bill.classList.add("current");
        exchange.classList.add("current");
    } else if (currentTab == "exchange") {
        purch.classList.remove("current");
        sales.classList.remove("current");
        bill.classList.remove("current");
        exchange.classList.add("current");
    } else {
        sales.classList.remove("current");
        purch.classList.remove("current");
        bill.classList.remove("current");
        exchange.classList.remove("current");
    }
}
}
