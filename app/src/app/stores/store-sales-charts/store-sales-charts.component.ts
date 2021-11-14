import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ArcElement, Chart, CategoryScale, TimeScale, PointElement, LineElement, LinearScale, PieController, LineController, DoughnutController, Tooltip, Legend, Tick, TooltipItem, TooltipModel } from 'chart.js';
import { registerables } from 'chart.js';
import 'chartjs-adapter-moment'; // or another adapter to avoid moment
import { SaleService } from 'src/app/services/sale-service.service';
import { StoreService } from 'src/app/services/store-service.service';
const decimals = 3;

Chart.register(LineController);
Chart.register(Tooltip);
Chart.register(Legend);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(TimeScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(...registerables);

const DATE = new Date();
const NBR_CHART_ITEMS : number = 5;

const pal = ["#001464", "#26377B", "#404F8B", "#59709A", "#8CA0B9", "#B2C7D0", "#CCDDE0"]

@Component({
  selector: 'app-store-sales-charts',
  templateUrl: './store-sales-charts.component.html',
  styleUrls: ['./store-sales-charts.component.less']
})
export class StoreSalesChartsComponent implements AfterViewInit{
  @ViewChild('storeSalesBarChart') 
  private storeSalesBarChart!: ElementRef;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  @Input()
  public storeId!: number;
  
  chartInstance!: Chart;
  startDate: Date = new Date(DATE.getFullYear(), DATE.getMonth(), 1);
  endDate: Date = new Date(DATE.getFullYear(), DATE.getMonth() + 1, 0);

  startDateStr: string = this.startDate.toISOString().substr(0, this.startDate.toISOString().indexOf('T'));
  endDateStr: string = this.endDate.toISOString().substr(0, this.endDate.toISOString().indexOf('T'));

 sales: any[] = [];

  constructor(    private saleService: SaleService,
    ) { 

    }
  ngAfterViewInit(): void {

    for (let i = 0; i < 1; i ++){
      this.saleService.getSalesByStoreAndDateRange(this.storeId, `${DATE.getFullYear() - i}-01-01`, `${DATE.getFullYear() - i}-12-31`)
      .subscribe(
        result => {
          this.sales = [];
          this.sales.push([]);
          if (Array.isArray(result)){
            result.forEach((saleDate) => {
              this.sales[i].push({
                x: saleDate.saleDate,
                y: saleDate.total,
              })
            });
  
            this.setupBarChart();
            this.updateSaleDate();
          }
  
        },
        err => {
        }
      );
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'storeId': {
            this.updateSaleDate();
          }
        }
      }
    }
  }
  
  updateSaleDate(){
    
    this.sales = [];

    for (let i = 0; i < 3; i++){
      this.sales.push([]);
      this.saleService.getSalesByStoreAndDateRange(this.storeId, `${DATE.getFullYear() - i}-01-01`, `${DATE.getFullYear() - i}-12-31`)
      .subscribe(
        result => {
          if (Array.isArray(result)){
            result.forEach((saleDate) => {
              let date = new Date(saleDate.saleDate);

              saleDate.saleDate = new Date(
                date.getFullYear() + i,
                date.getMonth(), 
                date.getDate());

              this.sales[i].push({
                x: saleDate.saleDate,
                y: saleDate.total,
              })
            });

            this.setupBarChart();
          }

        },
        err => {
        }
      );
    }
  }

  updateChart(){  
    this.chartInstance.data.datasets = [];
    for (let i = 0; i < 3; i++){
      this.chartInstance.data.datasets.push({
        borderColor: i == 0 ? '#36c0ff' : this.getColors(4, pal)[i],
        data: this.sales[i], 
        hoverBorderWidth: 5,
        fill: false,
        hoverBorderColor: '#42b7ff',
        tension: 0.1,
        label: (DATE.getFullYear() - i).toString(),
      });
    }    
    this.chartInstance.update();
  }

  setupBarChart(){

    if (this.chartInstance){
      this.updateChart();
    }
    else{
      if (this.storeSalesBarChart && this.sales && this.sales.length && this.sales[0].length){
        this.chartInstance = new Chart(this.storeSalesBarChart.nativeElement, {
          type: 'line',
          data: {
            datasets: [{
              borderColor: '#36c0ff',
              data: this.sales[0],
              hoverBorderWidth: 5,
              fill: false,
              hoverBorderColor: '#42b7ff',
              tension: 0.1,
              label: DATE.getFullYear().toString(),
              },
            {
              borderColor: this.getColors(4, pal)[0],
              data: this.sales[1],
              hoverBorderWidth: 5,
              fill: false,
              hoverBorderColor: '#42b7ff',
              tension: 0.1,
              label: '2020',
              },
          ]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                  type: 'time',
                  position: 'bottom',
                  time: {
                      displayFormats: {
                        'month': 'MMM'
                      },
                      tooltipFormat: 'MMM DD',
                      unit: 'month',
                  },
                  // leave only one label per month
                  afterTickToLabelConversion: function (data) {
                      var xLabels = data.ticks;
                      let oldLabel !: Tick;
                      xLabels.forEach(function (labels, i) {
                          if(xLabels[i] == oldLabel){
                              xLabels[i] = null as any;
                          } else {
                              oldLabel = xLabels[i];
                          }
                      });
                  }
              },
              y: {
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                      return '$' + value;
                  }
              }
              }
          },
  
            plugins: {
              legend:{
                display: (Array.isArray(this.sales) && this.sales.length && Array.isArray(this.sales[0]) && this.sales[0].length ? true : false),
                position: 'top',
                title: {
                  text: 'Sales Results',
                  display: (Array.isArray(this.sales) && this.sales.length && Array.isArray(this.sales[0]) && this.sales[0].length ? true : false),
                  font: {
                    size: 22,
                  },
                  color: '#42b7ff',
                },
               
              },
              tooltip: {
                callbacks: {
                  label: function(this: TooltipModel<"line">, tooltipItem: TooltipItem<"line">){
                    return tooltipItem.dataset.label ? (tooltipItem.dataset.label + ': $' + (<any>tooltipItem.dataset.data[tooltipItem.dataIndex]).y) : '';
                  }
              }
            }
              
            }
          }
        });
      } 
    }
  }

  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }
}
