import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ArcElement, Chart, PieController, DoughnutController, Tooltip, Legend } from 'chart.js';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { HighLvlSaleData } from 'src/app/interfaces/sale';
import { Store } from 'src/app/interfaces/store';
import { SaleService } from 'src/app/services/sale-service.service';
Chart.register(PieController);
Chart.register(ArcElement);
Chart.register(DoughnutController);
Chart.register(Tooltip);
Chart.register(Legend);

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const NBR_CHART_ITEMS : number = 5;

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.less']
})
export class SalesOverviewComponent implements AfterViewInit {
  @ViewChild('popularityChartCanvas') 
  private popularityChartCanvas!: ElementRef;
  @ViewChild('tasteTestChartCanvas') 
  private tasteTestChartCanvas!: ElementRef;
  @Input() menuItems!: MenuItem[];
  @Input() stores !: Store[];
  @Input() startDate!: string;
  @Input() endDate!: string;

  highLvlSales: HighLvlSaleData = {
    salesForCurrYear: 0,
    salesForCurrMonth: 0,
    menuPopularitySales: [],
    storePopularitySales: [],
    revenuePeriodSales: {
      periodRevenue: null,
      periodCosts: null,
    },
  }
  menuItemNames!: string[];
  menuRatings !: number[];
  menuQtySold !: number[];
  popularityChart!: Chart;
  tasteTestChart: any;
  mostPopularItem !: string;
  leastPopularItem !: string;
  bestReviewedItem !: string;
  worstReviewedItem !: string;
  monthName: string = '';
  currYear!: number;

  constructor(private saleService: SaleService) { }
  
  ngOnInit(){
    var d = new Date();
    this.currYear = d.getFullYear();
    this.monthName = monthNames[d.getMonth()]
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'startDate': {
            this.saleService.getHighLvlSalesData(this.startDate, this.endDate).toPromise()
            .then((result : any) => {
              if (result){
                this.setMenuItems();
              }
            })
          }
          break;
          case 'endDate': {
            this.saleService.getHighLvlSalesData(this.startDate, this.endDate).toPromise()
            .then((result : any) => {
              if (result){
                this.highLvlSales = result.highLvlSales;
                this.setMenuItems();
              }
            })
          }
          break;
        }
      }
    }
  }

  setMenuItems(){
    if (Array.isArray(this.highLvlSales.menuPopularitySales) && this.highLvlSales.menuPopularitySales.length){
      this.highLvlSales.menuPopularitySales.forEach((saleItem) => {
        if (Array.isArray(this.menuItems) && this.menuItems.length){
          let menuItemName = this.menuItems.find(item => item.id == saleItem.menuItemId)?.name;
          if (menuItemName){
            saleItem.menuName = menuItemName;
          }
        }
      });
    }
    
    if (Array.isArray(this.highLvlSales.storePopularitySales) && this.highLvlSales.storePopularitySales.length){
      this.highLvlSales.storePopularitySales.forEach((storeItem) => {
        if (Array.isArray(this.stores) && this.stores.length){
          let storeName = this.stores.find(item => item.storeId == storeItem.storeId)?.storeName;
          if (storeName){
            storeItem.storeName = storeName;
          }
        }
      })
    }
  }



  setMenuOverviewDetails(obj: any){

  }

  getMostLeastPopularItem(){
    if (Array.isArray(this.highLvlSales) && this.highLvlSales.length){
      this.highLvlSales[0]
    }
    return '';
  }

  getBestWorstReviewedItem(menuItems: MenuItem[], byBest: boolean){
    if (Array.isArray(menuItems) && menuItems.length){
      let popularItems = (<MenuItem[]>menuItems).filter(item => item.reviewRank != null);
      if (Array.isArray(popularItems) && popularItems.length){
        let sorted = popularItems.sort((item1 :MenuItem, item2 : MenuItem) => 
        {
          return item1.reviewRank - item2.reviewRank
        })
        if (!byBest){
          sorted.reverse();
        }
        return sorted[0].name;
      }
    }
    return '';
  }

  ngAfterViewInit(): void {
  }
  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }

  pieChartBrowser(): void {

    if (true){
      return;
    }





    let pal = ["#001464", "#26377B", "#404F8B", "#59709A", "#8CA0B9", "#B2C7D0", "#CCDDE0"]

    if (!this.popularityChart){
      this.popularityChart = new Chart(this.popularityChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.menuItemNames.slice(0, NBR_CHART_ITEMS),
          datasets: [{
            backgroundColor: this.getColors(4, pal),
            data: this.menuQtySold.slice(0, NBR_CHART_ITEMS),
            hoverBorderWidth: 5,
            hoverBorderColor: '#42b7ff',
            hoverOffset: 15,
          }]
        },
        options: {
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 30,
              right: 30,
              bottom: 30,
            },
          },
          plugins: {
            legend:{
              display: true,
              position: 'right',
              title: {
                text: 'Menu Items',
                display: true,
                font: {
                  size: 22,
                }
              },
              
            }
            
          }
        }
      });
    }
    else{
      // Update chart data 
      this.popularityChart.data.datasets = [{
        backgroundColor: this.getColors(4, pal),
        data: this.menuQtySold.slice(0, NBR_CHART_ITEMS),
        hoverBorderWidth: 5,
        hoverBorderColor: '#42b7ff',
        hoverOffset: 15,
      }];
    }
    if (!this.tasteTestChart){
      this.tasteTestChart = new Chart(this.tasteTestChartCanvas.nativeElement, {
        type: 'doughnut',
        
        data: {
          labels: this.menuItemNames.slice(0, NBR_CHART_ITEMS),
          datasets: [{
            backgroundColor: this.getColors(4, pal),
            data: this.menuRatings.splice(0, NBR_CHART_ITEMS),
            hoverBorderWidth: 5,
            hoverBorderColor: '#42b7ff',
            hoverOffset: 15,
          }]
        },
        options: {
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 30,
              right: 30,
              bottom: 30,
            }
          },
          plugins: {
            legend:{
              display: true,
              position: 'right',
              title: {
                text: 'Menu Items',
                display: true,
                font: {
                  size: 22,
                }
              },
            },         
          }
        }
      });
    }
    else{
      // Update chart data 
      this.popularityChart.data.datasets = [{
        backgroundColor: this.getColors(4, pal),
        data: this.menuRatings.splice(0, NBR_CHART_ITEMS),
        hoverBorderWidth: 5,
        hoverBorderColor: '#42b7ff',
        hoverOffset: 15,
      }];
    }
  }
}
