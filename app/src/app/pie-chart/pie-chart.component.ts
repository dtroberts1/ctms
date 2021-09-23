import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ArcElement, Chart, PieController,  } from 'chart.js';
Chart.register(PieController);
Chart.register(ArcElement);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.less']
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;
  pieChart: any;

  constructor() { }

  ngAfterViewInit(): void {
    this.pieChartBrowser();
  }
  pieChartBrowser(): void {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Apple', 'Google', 'Facebook', 'Infosys', 'Hp', 'Accenture'],
        datasets: [{
          backgroundColor: [
            '#2ecc71',
            '#3498db',
            '#95a5a6',
            '#9b59b6',
            '#f1c40f',
            '#e74c3c'
          ],
          data: [12, 19, 3, 17, 28, 24]
        }]
      }
    });
  }
}
