import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, TooltipItem } from 'chart.js';
import { NgIf, NgClass } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-product-sales-report',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './product-sales-report.component.html',
  styleUrls: ['./product-sales-report.component.css']
})
export class ProductSalesReportComponent implements AfterViewInit {

  private _activeTab: 'week' | 'month' | 'year' = 'week'; 
  
  get activeTab() {
    return this._activeTab;
  }

  set activeTab(value: 'week' | 'month' | 'year') {
    this._activeTab = value;
    setTimeout(() => {
      if (value === 'week' && this.weekCanvas?.nativeElement) {
        this.destroyChart('week');
        this.createChart(this.weekCanvas.nativeElement, 'week');
      } else if (value === 'month' && this.monthCanvas?.nativeElement) {
        this.destroyChart('month');
        this.createChart(this.monthCanvas.nativeElement, 'month');
      } else if (value === 'year' && this.yearCanvas?.nativeElement) {
        this.destroyChart('year');
        this.createChart(this.yearCanvas.nativeElement, 'year');
      }
    });
  }

  @ViewChild('weekCanvas') weekCanvas?: ElementRef;
  @ViewChild('monthCanvas') monthCanvas?: ElementRef;
  @ViewChild('yearCanvas') yearCanvas?: ElementRef;

  weekChart!: Chart;
  monthChart!: Chart;
  yearChart!: Chart;

  ngAfterViewInit(): void {
    if (this.weekCanvas?.nativeElement) {
      this.createChart(this.weekCanvas.nativeElement, 'week');
    }
  }

  createChart(canvasEl: HTMLCanvasElement, type: 'week' | 'month' | 'year') {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    canvasEl.width = 400;
    canvasEl.height = 400;

    const gradients = [
      ['#9D93E6', '#575280'],
      ['#FF8686', '#995050'],
      ['#9DE094', '#567A51'],
      ['#F3D686', '#C79304'],
      ['#51D6E5', '#2D777F'],
      ['#A9CE63', '#556832'],
    ].map(([start, end]) => {
      const grad = ctx.createLinearGradient(0, 0, canvasEl.width, canvasEl.height);
      grad.addColorStop(0.146, start);
      grad.addColorStop(0.94, end);
      return grad;
    });

    const data = {
      labels: ['Ring', 'Necklace', 'Bangles', 'Earring', 'Payal', 'Bracelet'],
      datasets: [{
        label: 'Sales',
        data: [18, 18, 15, 18, 18, 18],
        backgroundColor: gradients,
        borderWidth: 0,
      }]
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: data,
      options: {
        rotation: -90,
        cutout: '65%',
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
            titleFont: { size: 10, weight: 'bold' },
            bodyFont: { size: 10 },
            callbacks: {
              label: (tooltipItem: TooltipItem<'doughnut'>) => {
                const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw : 0;
                return `₹${(value * 1000).toLocaleString('en-IN')}`;
              }
            }
          },
          datalabels: {
            display: false,
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 15,
              boxHeight: 15,
              padding: 20,
              font: { size: 12 },
            },
          },
        }
      }
    };

    const chart = new Chart(ctx, config);
    if (type === 'week') this.weekChart = chart;
    else if (type === 'month') this.monthChart = chart;
    else this.yearChart = chart;
  }

  destroyChart(type: 'week' | 'month' | 'year') {
    if (type === 'week' && this.weekChart) {
      this.weekChart.destroy();
      this.weekChart = undefined!;
    }
    if (type === 'month' && this.monthChart) {
      this.monthChart.destroy();
      this.monthChart = undefined!;
    }
    if (type === 'year' && this.yearChart) {
      this.yearChart.destroy();
      this.yearChart = undefined!;
    }
  }
}
