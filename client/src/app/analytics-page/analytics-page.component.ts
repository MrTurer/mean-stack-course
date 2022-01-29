import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from "chart.js";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.sass']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  average!: number
  pending = true
  aSub!: Subscription

  constructor(
    private service: AnalyticsService
  ) {
  }

  ngAfterViewInit(): void {

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      const gainConfig: IConfig = {
        label: 'Выручка',
        color: 'rgb(255,99,132)',
        labels: data.chart.map(x => {
          return x.label
        }),
        data : data.chart.map(y => {
          return  y.gain
        })
      }

      const orderConfig: IConfig = {
        label: 'Выручка',
        color: 'rgb(54,162,235)',
        labels: data.chart.map(x => {
          return x.label
        }),
        data : data.chart.map(y => {
          return  y.order
        })
      }

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = "300px"
      orderCtx.canvas.height = "300px"

      Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);


      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig(config:IConfig):ChartConfiguration {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels:config.labels,
      datasets: [
        {
          label:config.label,
          data:config.data,
          borderColor: config.color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}

interface IConfig {
  labels:string[],
  data:number[],
  label:string,
  color:string
}
