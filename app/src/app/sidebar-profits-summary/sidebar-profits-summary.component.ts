import { Component, OnInit } from '@angular/core';
import { SaleService } from '../services/sale-service.service';

type saleRevenue = {
  weekSales: string,
  monthSales: string,
  yearSales: string,
}
type businessExpense = {
  weekExpenses: string,
  monthExpenses: string,
  yearExpenses: string,
}
type businessProfit = {
  weekProfits: string,
  monthProfits: string,
  yearProfits: string,
}

@Component({
  selector: 'app-sidebar-profits-summary',
  templateUrl: './sidebar-profits-summary.component.html',
  styleUrls: ['./sidebar-profits-summary.component.less']
})
export class SidebarProfitsSummaryComponent implements OnInit {
  public revenue!: saleRevenue;
  public expense!: businessExpense;
  public profit!: businessProfit;

  constructor(
    private saleService: SaleService
  ) { }

  ngOnInit(): void {
    this.saleService.getWeekMonthYearRevenues()
    .subscribe(
      (result : saleRevenue) => {
        this.revenue = result;
        // Random percentages need to be replaced with real data!
        /********************************************************************** */
        this.expense = {
          weekExpenses : (parseFloat(this.revenue.weekSales) * .3).toFixed(2),
          monthExpenses : (parseFloat(this.revenue.monthSales) * .3).toFixed(2),
          yearExpenses : (parseFloat(this.revenue.yearSales) * .3).toFixed(2),
        };
        /********************************************************************** */

        this.profit = {
          weekProfits : (parseFloat(this.revenue.weekSales) - parseFloat(this.expense.weekExpenses)).toFixed(2),
          monthProfits : (parseFloat(this.revenue.monthSales) - parseFloat(this.expense.monthExpenses)).toFixed(2),
          yearProfits : (parseFloat(this.revenue.yearSales) - parseFloat(this.expense.yearExpenses)).toFixed(2),
        };
      },
      err => {

      }
    )
  }

  getProfitDisplay(val: string){
    let profitVal = parseFloat(val);
    let leadingSign = profitVal > 0 ? '+' : '-';
    profitVal = profitVal > 0 ? profitVal : profitVal * -1;

    return leadingSign + ' ' + profitVal.toFixed(2);
  }
  getPosOrNeg(val1: string){
    return parseFloat(val1) > 0;
  }

}
