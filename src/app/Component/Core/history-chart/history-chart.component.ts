import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-history-chart',
  standalone: true,
  templateUrl: './history-chart.component.html',
  styleUrl: './history-chart.component.css'
})
export class HistoryChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('historyChart', { static: true }) chartRef!: ElementRef;
  chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroy old instance if exists
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const goldGradient = ctx.createLinearGradient(0, 0, 0, this.chartRef.nativeElement.height);
    goldGradient.addColorStop(0.0754, '#FFE7B9');
    goldGradient.addColorStop(0.5481, '#FFF9EF');

    const silverGradient = ctx.createLinearGradient(0, 0, 0, this.chartRef.nativeElement.height);
    silverGradient.addColorStop(0.3788, '#d9d9d9');
    silverGradient.addColorStop(0.9979, '#fafafa');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Silver',
            data: [30, 50, 58, 45, 49, 59, 40, 45, 37, 40, 35, 60, 59],
            fill: true,
            borderColor: '#8A8A8A',
            backgroundColor: silverGradient,
            borderWidth: 1,
            tension: 0.4
          },
          {
            label: 'Gold',
            data: [90, 85, 75, 85, 70, 85, 100, 75, 75, 89, 71, 90],
            fill: true,
            borderColor: '#F1A84C',
            backgroundColor: goldGradient,
            borderWidth: 1,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#444444',
              font:{
                size: 10,
              }
            }
          },
          y: {
            max: 100,
            grid: {
              display: false,
            }, 
            ticks: {
              stepSize: 10,
              color: '#444444',
              font:{
                size: 10,
              }
            }
          }
        },
        plugins: {
          datalabels: {
            display: false,
          },
          legend: {
            position: 'bottom',
            align: 'end',
                labels: {
                    color: '#767676',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Cleanup when component is destroyed
    }
  }
}
