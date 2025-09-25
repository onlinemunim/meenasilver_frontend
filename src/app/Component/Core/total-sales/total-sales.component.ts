import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-total-sales',
  standalone: true,
  templateUrl: './total-sales.component.html',
  styleUrl: './total-sales.component.css'
})
export class TotalSalesComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    initFlowbite();
  }
  
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.createChart(); // Week chart
    });
  }

  @ViewChild('weekChart') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthChart') monthChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('yearChart') yearChartRef!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;
  monthChart!: Chart;
  yearChart!: Chart;

  // Weekly Data
  weekSales = [75000, 35000, 63000, 50000, 58000, 74000, 80000];
  weekSalesPercent = [75, 35, 63, 50, 28, 74, 80];

  // Monthly Data
  monthSales = [45000, 53000, 58000, 40000, 60000, 76000, 50000, 57000, 62000, 78000, 85000, 98000];
  monthSalesPercent = [45, 53, 58, 40, 60, 76, 50, 57, 62, 78, 85, 98];

  // Yearly Data
  yearSales = [350000, 460000, 520000, 580000, 650000];
  yearSalesPercent = [35, 46, 52, 58, 65];

  onTabChange(tab: string) {
    setTimeout(() => {
      if (tab === 'month' && !this.monthChart && this.monthChartRef?.nativeElement?.offsetParent !== null) {
        this.createMonthChart();
      } else if (tab === 'year' && !this.yearChart && this.yearChartRef?.nativeElement?.offsetParent !== null) {
        this.createYearChart();
      }
    }, 100);
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const canvasWidth = this.chartRef.nativeElement.clientWidth;
    const dynamicThickness = Math.max(canvasWidth / 16, 8); 

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#0D5BAB');
    gradient.addColorStop(1, '#6AA2DD');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Sales',
          data: this.weekSalesPercent,
          backgroundColor: gradient,
          barThickness: dynamicThickness,
          borderRadius: { topLeft: 5, topRight: 5 }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: value => value + '%',
              padding: 10,
            },
            grid: {
              drawTicks: false,
              lineWidth: 1,
            },
            border: {
              display: false,
            }
          },
          x: {
            border: {
              display: false,
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          tooltip: {
            displayColors: false,
            yAlign: 'bottom', 
            position: 'nearest',
            callbacks: {
              title: () => '',
              label: context => {
                const index = context.dataIndex;
                return `₹${this.weekSales[index].toLocaleString()}`;
              }
            },
            backgroundColor: '#E5E7FF',
            bodyColor: '#0D5BAB',
            borderColor: '#0D5BAB',
            borderWidth: 1,
            cornerRadius: 5,
            caretSize: 6,
            caretPadding: 6,
            padding: { top: 5, bottom: 5, left: 10, right: 10 }
          },
          legend: {
            display: false,
          }
        }
      }
    });
  }

  createMonthChart() {
    const ctx2 = this.monthChartRef.nativeElement.getContext('2d');
    if (!ctx2) return;

    const canvasWidth1 = this.monthChartRef.nativeElement.clientWidth;
    const dynamicThickness1 = Math.max(canvasWidth1 / 20, 8); 

    const gradient = ctx2.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#007200');
    gradient.addColorStop(1, '#38b000');

    this.monthChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales',
          data: this.monthSalesPercent,
          backgroundColor: gradient,
          barThickness: dynamicThickness1,
          borderRadius: { topLeft: 5, topRight: 5 }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: value => value + '%',
              padding: 10,
            },
            grid: {
              drawTicks: false,
              lineWidth: 1,
            },
            border: {
              display: false,
            }
          },
          x: {
            border: {
              display: false,
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          tooltip: {
            displayColors: false,
            yAlign: 'bottom', 
            position: 'nearest',
            callbacks: {
              title: () => '',
              label: context => {
                const index = context.dataIndex;
                return `₹${this.monthSales[index].toLocaleString()}`;
              }
            },
            backgroundColor: '#DEFFEA',
            bodyColor: '#007200',
            borderColor: '#007200',
            borderWidth: 1,
            cornerRadius: 5,
            caretSize: 6,
            caretPadding: 6,
            padding: { top: 5, bottom: 5, left: 10, right: 10 }
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  createYearChart() {
    const ctx3 = this.yearChartRef.nativeElement.getContext('2d');
    if (!ctx3) return;

    const canvasWidth2 = this.yearChartRef.nativeElement.clientWidth;
    const dynamicThickness2 = Math.max(canvasWidth2 / 10, 8);
    
    const gradient = ctx3.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#9d0208');
    gradient.addColorStop(1, '#d00000');

    this.yearChart = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'],
        datasets: [{
          label: 'Sales',
          data: this.yearSalesPercent,
          backgroundColor: gradient,
          barThickness: dynamicThickness2,
          borderRadius: { topLeft: 5, topRight: 5 }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: value => value + '%',
              padding: 10,
            },
            grid: {
              drawTicks: false,
              lineWidth: 1,
            },
            border: {
              display: false,
            }
          },
          x: {
            border: {
              display: false,
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          tooltip: {
            displayColors: false,
            yAlign: 'bottom', 
            position: 'nearest',
            callbacks: {
              title: () => '',
              label: context => {
                const index = context.dataIndex;
                return `₹${this.yearSales[index].toLocaleString()}`;
              }
            },
            backgroundColor: '#FFEBEB',
            bodyColor: '#d00000',
            borderColor: '#d00000',
            borderWidth: 1,
            cornerRadius: 5,
            caretSize: 6,
            caretPadding: 6,
            padding: { top: 5, bottom: 5, left: 10, right: 10 }
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.monthChart?.destroy();
    this.yearChart?.destroy();
  }
}
