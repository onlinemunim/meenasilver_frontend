import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  chart!: Chart;

  ngOnInit(): void {
    const data = {
      labels: ['Working Days', 'On Leave', 'Holiday', 'Remaining Days'],
      datasets: [{
        label: 'Days',
        data: [18, 1, 3, 8],
        backgroundColor: [
          '#23AF11',
          '#BE1111',
          '#EFB250',
          '#E4E4E4',
        ],
        borderWidth: 0,
      }]
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: data,
      options: {
          rotation: -90, 
           cutout: '75%',
        responsive: true,
        plugins: {
          tooltip: {
              backgroundColor: '#FFF6DB', 
              titleColor: '#444444',      
              bodyColor: '#444444',       
              borderColor: '#898989',     
              borderWidth: 1,
              displayColors: false, 
              yAlign: 'bottom',
               titleFont: {
              size: 10, 
              weight: 'bold',
            },
            bodyFont: {
              size: 10, 
            },
          },
           datalabels: {
            display: false,
          },
          legend: {
             display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,       
              pointStyle: 'rectRounded', 
              boxWidth: 10,              
              boxHeight: 10,             
              padding: 8,
              font: {
              size: 10,
            }
            },
          },
        }
      }
    };

    setTimeout(() => {
      this.chart = new Chart(this.doughnutCanvas.nativeElement, config);
    });
  }
}
