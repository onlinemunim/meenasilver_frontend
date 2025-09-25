import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-topsell-product',
  imports: [],
  templateUrl: './topsell-product.component.html',
  styleUrl: './topsell-product.component.css'
})

export class TopsellProductComponent implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    this.topsellchart();
  }

  @ViewChild('topSellProductChart', { static: true }) topSellProductRef!: ElementRef<HTMLCanvasElement>;
  topSellProduct!: Chart;

  topSales = [80, 100, 65];
  topSellProductPercent = [80, 100, 65];

  topsellchart() {
    const ctx = this.topSellProductRef.nativeElement.getContext('2d');
    if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#0D5BAB');
    gradient.addColorStop(1, '#6AA2DD');

    this.topSellProduct = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ring', 'Mangalsutra', 'Necklace'],
        datasets: [{
          label: '',
          data: this.topSellProductPercent,
          backgroundColor: ['#0D5BAB', '#483D8B', '#C71585'],
          barThickness: 5,
          borderRadius: { topLeft: 5, topRight: 5 }
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 120,
            ticks: {
              stepSize: 10,
              callback: value => value,
              padding: 0,
              color: '#E37F7F',
              font: {
                size: 9,
                weight: 'normal',
              }
            },
            grid: {
              display: false,
            },
            border: {
              color: '#FFD1D1',
            }
          },
          x: {
            ticks: {
              padding: 0,
              color: '#5A5959',
              font: {
                size: 10,
              },
            },
            grid: {
              display: false,
            },
            border: {
              color: '#FFD1D1',
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#E37F7F',
            font: {
              size: 10,
              weight: 'normal',
            },
            formatter: value => `${value}%`
        }
      }
    },
      plugins: [ChartDataLabels]
    });
  }

  ngOnDestroy(): void {
    // this.topSellProduct.destroy();
  }
}
