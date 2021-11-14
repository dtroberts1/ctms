import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArcElement, Chart, CategoryScale, TimeScale, PointElement, LineElement, LinearScale, PieController, LineController, DoughnutController, Tooltip, Legend, Tick } from 'chart.js';
import { registerables } from 'chart.js';
import 'chartjs-adapter-moment'; // or another adapter to avoid moment

Chart.register(LineController);
Chart.register(Tooltip);
Chart.register(Legend);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(TimeScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(...registerables);

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

  currYear : any = [
    {x: '2020-01-25', y: 20},
    {x: '2020-02-25', y: 21},
    {x: '2020-02-28', y: 23},
    {x: '2020-03-15', y: 100},
    {x: '2020-03-16', y: 19},
    {x: '2020-03-20', y: 20},
  ]

  prevYear : any = [
    {x: '2020-01-25', y: 200},
    {x: '2020-02-25', y: 11},
    {x: '2020-02-28', y: 123},
    {x: '2020-03-15', y: 8},
    {x: '2020-03-16', y: 47},
    {x: '2020-03-20', y: 12},
  ]
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
          datasets: [{
            borderColor: '#36c0ff',
            data: this.currYear, /* this.barData.slice(0, displayCount),*/
            hoverBorderWidth: 5,
            fill: false,
            hoverBorderColor: '#42b7ff',
            tension: 0.1,
            label: 'Current',

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
          scales: {
            x: {
                type: 'time',
                position: 'bottom',
                time: {
                    displayFormats: {
                    },
                    tooltipFormat: 'MM/DD/YYYY',
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
            }
        },
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
