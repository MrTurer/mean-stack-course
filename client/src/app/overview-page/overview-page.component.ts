import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.sass']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef

  tapTarget!: MaterialInstance
  data$!: Observable<OverviewPage>
  yesterday = new Date()
  constructor(
    private service: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.data$ = this.service.getOverview()

    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(): void {
    if (this.tapTarget.destroy) {
      this.tapTarget.destroy()
    }
  }

  openInfo() {
    if (this.tapTarget.open) {
      this.tapTarget.open()
    }
  }
}
