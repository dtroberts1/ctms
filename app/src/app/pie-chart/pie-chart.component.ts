import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ArcElement, Chart, PieController, DoughnutController, Tooltip, Legend } from 'chart.js';
Chart.register(PieController);
Chart.register(ArcElement);
Chart.register(DoughnutController);
Chart.register(Tooltip);
Chart.register(Legend);


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.less']
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('popularityChartCanvas') 
  private popularityChartCanvas!: ElementRef;
  @ViewChild('tasteTestChartCanvas') 
  private tasteTestChartCanvas!: ElementRef;

  popularityChart: any;
  tasteTestChart: any;


  constructor() { }

  ngAfterViewInit(): void {
    this.pieChartBrowser();
  }
  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }

  pieChartBrowser(): void {
    let pal = ["#001464", "#26377B", "#404F8B", "#59709A", "#8CA0B9", "#B2C7D0", "#CCDDE0"]

    this.popularityChart = new Chart(this.popularityChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Apple', 'Google', 'Facebook', 'Infosys'],
        datasets: [{
          backgroundColor: this.getColors(4, pal),
          data: [12, 19, 3, 17],
          label: 'Popularity',
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
            top: 30,
            bottom: 30,
          }
        },
        plugins: {
          legend:{
            display: true,
            position: 'right',
            title: {
              text: 'Popularity',
              display: true,
              font: {
                size: 22,
              }
            },
            
          }
          
        }
      }
    });

    this.tasteTestChart = new Chart(this.tasteTestChartCanvas.nativeElement, {
      type: 'doughnut',
      
      data: {
        labels: ['Apple', 'Google', 'Facebook', 'Infosys'],
        datasets: [{
          backgroundColor: this.getColors(4, pal),
          data: [12, 19, 3, 17],
          label: 'Rankings',
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
            top: 30,
            bottom: 30,
          }
        },
        plugins: {
          legend:{
            display: true,
            position: 'right',
            title: {
              text: 'Popularity',
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
}
