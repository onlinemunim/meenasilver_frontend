import { Component } from '@angular/core';
import { HistoryChartComponent } from "../history-chart/history-chart.component";

@Component({
  selector: 'app-news',
  imports: [HistoryChartComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent{
  
}
