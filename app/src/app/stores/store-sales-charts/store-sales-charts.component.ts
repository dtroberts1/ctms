import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArcElement, Chart, CategoryScale, PointElement, LineElement, LinearScale, PieController, LineController, DoughnutController, Tooltip, Legend } from 'chart.js';

Chart.register(LineController);
Chart.register(Tooltip);
Chart.register(Legend);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

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
  
  chartInstance!: Chart;

  barFields: string[] = ['July', 'August', 'September', 'October', 'November'];
  currYear : any = [33,10,22,50,22,11];
  prevYear : any = [23,100,202,150,122,118];

  constructor() { }
  ngAfterViewInit(): void {
    this.setupBarChart();

  }

  setupBarChart(){

    let displayCount = this.currYear.length < NBR_CHART_ITEMS ? this.currYear.length : NBR_CHART_ITEMS;

    console.log({"barData":this.currYear});

    console.log("bar chart is " + this.storeSalesBarChart);

    if (this.storeSalesBarChart && this.currYear && this.currYear.length){
      this.chartInstance = new Chart(this.storeSalesBarChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.barFields,
          datasets: [{
            borderColor: '#36c0ff',
            data: this.currYear, /* this.barData.slice(0, displayCount),*/
            hoverBorderWidth: 5,
            fill: false,
            hoverBorderColor: '#42b7ff',
            tension: 0.1,
            label: '2021',

            /*hoverOffset: 15,*/
          },
          {
            borderColor: this.getColors(4, pal)[0],
            data: this.prevYear, /* this.barData.slice(0, displayCount),*/
            hoverBorderWidth: 5,
            fill: false,
            hoverBorderColor: '#42b7ff',
            tension: 0.1,
            label: '2020',

            /*hoverOffset: 15,*/
          },
        ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          /*
          layout: {
            padding: {
              left: 20,
              bottom: 30,
              top: 50,
            },
          },
          */
          plugins: {
            
            legend:{
              display: (Array.isArray(this.currYear) && this.currYear.length ? true : false),
              position: 'top',
              title: {
                text: 'Sales Results',
                display: (Array.isArray(this.currYear) && this.currYear.length ? true : false),
                font: {
                  size: 22,
                },
                color: '#42b7ff',
              },
             
            }
            
          }
        }
      });
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
