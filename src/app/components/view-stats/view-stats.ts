import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import {Stats} from '../../services/stats';

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.html',
  styleUrl: './view-stats.css'
})
export class ViewStats implements AfterViewInit, OnDestroy {
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  barChart!: Chart;
  pieChart!: Chart;

  constructor(
    private route: ActivatedRoute,
    private statsService: Stats
  ) {}


  ngAfterViewInit() {
    const secretCode = this.route.snapshot.paramMap.get('secretCode')!;
    this.statsService.getStats(secretCode).subscribe(res => {
      const barData = {
        labels: res.uniqueVisitsPerDay.map((x: any) =>
          new Date(x.date).toLocaleDateString()
        ),
        datasets: [{
          label: 'Visits',
          data: res.uniqueVisitsPerDay.map((x: any) => x.count),
          backgroundColor: '#42a5f5'
        }]
      };

      const pieData = {
        labels: res.topIps.map((x: any) => x.ip),
        datasets: [{
          data: res.topIps.map((x: any) => x.count),
          backgroundColor: ['#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#29b6f6']
        }]
      };

      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: barData,
        options: {
          responsive: true,
        }
      });

      this.pieChart = new Chart(this.pieCanvas.nativeElement, {
        type: 'pie',
        data: pieData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' }
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }
}
