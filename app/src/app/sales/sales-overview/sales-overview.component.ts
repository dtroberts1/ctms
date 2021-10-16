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
const pal = ["#001464", "#26377B", "#404F8B", "#59709A", "#8CA0B9", "#B2C7D0", "#CCDDE0"]

const NBR_CHART_ITEMS : number = 5;


@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.less']
})
export class SalesOverviewComponent implements AfterViewInit {
  @ViewChild('menuPopularityChartCanvas') 
  private menuPopularityChartCanvas!: ElementRef;
  @ViewChild('storeRevChartCanvas') 
  private storeRevChartCanvas!: ElementRef;
  @Input() menuItems!: MenuItem[];
  @Input() stores !: Store[];
  @Input() startDateStr!: string;
  @Input() endDateStr!: string;


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
  storeNames!: string[];

  menuRatings !: number[];
  menuItemRevenues !: (number | null)[];
  storeRevenues !: (number | null)[];
  menuPopularityChart!: Chart;
  storeRevChart!: Chart;
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

  public sharedFunction(){
  }

  updateChartData(startDateStr: string, endDateStr: string){

    this.saleService.getHighLvlSalesData(startDateStr, endDateStr).toPromise()
    .then((result : any) => {
      if (result){
        this.setMenuItems();
      }
    });
    this.saleService.getHighLvlSalesData(startDateStr, endDateStr).toPromise()
    .then((result : any) => {
      if (result){
        this.highLvlSales = result.highLvlSales;
        this.setMenuItems();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'startDateStr': {
            this.saleService.getHighLvlSalesData(this.startDateStr, this.endDateStr).toPromise()
            .then((result : any) => {
              if (result){
                this.setMenuItems();
              }
            })
          }
          break;
          case 'endDateStr': {
            this.saleService.getHighLvlSalesData(this.startDateStr, this.endDateStr).toPromise()
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
      else{
      }
    }
  }

  setMenuItems(){
    if (Array.isArray(this.highLvlSales.menuPopularitySales) && this.highLvlSales.menuPopularitySales.length){
      this.menuItemNames = [];
      let itemNames: string[] = [];
      this.highLvlSales.menuPopularitySales.forEach((saleItem) => {
        if (Array.isArray(this.menuItems) && this.menuItems.length){
          let menuItemName = this.menuItems.find(item => item.id == saleItem.menuItemId)?.name;
          if (menuItemName){
            saleItem.menuName = menuItemName;
            itemNames.push(menuItemName);
          }
        }
      });
      if (Array.isArray(itemNames) && itemNames.length){
        itemNames[0] = itemNames[0] + '      '; // Add length to the first 
        this.menuItemNames = itemNames;
      }
      this.menuItemRevenues = this.highLvlSales.menuPopularitySales.map(sale => sale.salesForItem);
    }
    else{
    }
    
    if (Array.isArray(this.highLvlSales.storePopularitySales) && this.highLvlSales.storePopularitySales.length){
      this.storeNames = [];
      let itemNames: string[] = [];

      this.highLvlSales.storePopularitySales.forEach((storeItem) => {
        if (Array.isArray(this.stores) && this.stores.length){
          let storeName = this.stores.find(item => item.storeId == storeItem.storeId)?.storeName;
          if (storeName){
            storeItem.storeName = storeName;
            itemNames.push(storeName);
          }
        }
      });

      if (Array.isArray(itemNames) && itemNames.length){
        itemNames[0] = itemNames[0] + '      '; // Add length to the first 
        this.storeNames = itemNames;
      }
      this.storeRevenues = this.highLvlSales.storePopularitySales.map(sale => sale.salesForStore);
    }
    else{
    }

    this.pieChartBrowser();
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

  updateMenuPopularityChart(){

    let popularityDispCount = this.highLvlSales.menuPopularitySales.length < NBR_CHART_ITEMS ? this.highLvlSales.menuPopularitySales.length : NBR_CHART_ITEMS;
    this.menuPopularityChart.data =
    {
      labels: popularityDispCount > 0 ? this.menuItemNames.slice(0, popularityDispCount): ['No Sales'],
      datasets: [{
        backgroundColor: this.getColors(4, pal),
        data: popularityDispCount > 0 ? this.menuItemRevenues.slice(0, popularityDispCount) : [],
        hoverBorderWidth: 5,
        hoverBorderColor: '#42b7ff',
        hoverOffset: 15,
      }]
    };

    this.menuPopularityChart.update();
  }

  updateStoreRevChart(){

    let storeDispCount = this.highLvlSales.storePopularitySales.length < NBR_CHART_ITEMS ? this.highLvlSales.storePopularitySales.length : NBR_CHART_ITEMS;

    this.storeRevChart.data = {
      labels: storeDispCount > 0 ? this.storeNames.splice(0, storeDispCount): ['No Sales'],
      datasets: [{
        backgroundColor: this.getColors(4, pal),
        data: storeDispCount > 0 ? this.storeRevenues.slice(0, storeDispCount) : [],
        hoverBorderWidth: 5,
        hoverBorderColor: '#42b7ff',
        hoverOffset: 15,
      }]
    }
  
    this.storeRevChart.update();
  }

  pieChartBrowser(): void {

    if (this.menuPopularityChart && this.storeRevChart){
      this.updateMenuPopularityChart();
      this.updateStoreRevChart();
      return;
    }

    if (this.menuPopularityChartCanvas && Array.isArray(this.menuItemNames) && Array.isArray(this.menuItemRevenues)){
      if (this.menuPopularityChart){
      }
      let displayCount = this.menuItemRevenues.length < NBR_CHART_ITEMS ? this.menuItemRevenues.length : NBR_CHART_ITEMS;

      this.menuPopularityChart = new Chart(this.menuPopularityChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.menuItemNames.slice(0, displayCount),
          datasets: [{
            backgroundColor: this.getColors(4, pal),
            data: this.menuItemRevenues.slice(0, displayCount),
            hoverBorderWidth: 5,
            hoverBorderColor: '#42b7ff',
            hoverOffset: 15,
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          
          layout: {
            padding: {
              left: 60,
              right: 10,
              bottom: 30,
              top: 50,
            },
          },
          plugins: {
            
            legend:{
              display: (Array.isArray(this.menuItemRevenues) && this.menuItemRevenues.length ? true : false),
              position: 'left',
              title: {
                text: 'Menu Items',
                display: (Array.isArray(this.menuItemRevenues) && this.menuItemRevenues.length ? true : false),
                font: {
                  size: 22,
                }
              },
             
            }
            
          }
        }
      });
    }
    if (this.storeRevChartCanvas && Array.isArray(this.storeNames) && Array.isArray(this.storeRevenues)){
      if(this.storeRevChart){
      }
      let displayCount = this.storeRevenues.length < NBR_CHART_ITEMS ? this.storeRevenues.length : NBR_CHART_ITEMS;
      this.storeRevChart = new Chart(this.storeRevChartCanvas.nativeElement, {
        type: 'doughnut',
        
        data: {
          labels: this.storeNames.length ? this.storeNames.slice(0, displayCount) : [],
          datasets: [{
            backgroundColor: this.getColors(4, pal),
            data: this.storeRevenues.slice(0, displayCount),
            hoverBorderWidth: 5,
            hoverBorderColor: '#42b7ff',
            hoverOffset: 15,
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          layout: {
            padding: {
              left: 60,
              right: 10,
              bottom: 30,
              top: 50,
            }
          },
          plugins: {
            legend:{
              display: (Array.isArray(this.storeRevenues) && this.storeRevenues.length ? true : false),
              position: 'left',
              
              title: {
                text: 'Stores',
                display: (Array.isArray(this.storeRevenues) && this.storeRevenues.length ? true : false),
                font: {
                  size: 22,
                }
              },
              
              labels: {
                
              }
            },         
          }
        }
      });
    }
  }


}
