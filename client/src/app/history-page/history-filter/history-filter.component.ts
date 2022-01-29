import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialDatepicker, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.sass']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef!: ElementRef
  @ViewChild('end') endRef!: ElementRef

  start!: MaterialDatepicker
  end!: MaterialDatepicker
  order!: number

  isValid = true


  constructor() {
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  ngOnDestroy(): void {
    if (this.start.destroy) {
      this.start.destroy()
    }
    if (this.end.destroy) {
      this.end.destroy()
    }
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }

    this.isValid = this.start.date < this.end.date
    console.log(this.isValid)

  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }
    if (this.start.date) {
      filter.start = this.start.date
    }
    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter)
  }
}
