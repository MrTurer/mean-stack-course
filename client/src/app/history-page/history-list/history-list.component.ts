import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders!: Order[]
  @ViewChild('modal') modalRef!: ElementRef

  selectedOrder!: Order
  modal!: MaterialInstance

  constructor(

  ) { }

  ngOnDestroy(): void {
     if (this.modal.destroy) {
       this.modal.destroy()
     }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  computePrice(order: Order): number {
    let total = 0
    order.list.forEach((item) => {
      total += item.quantity * item.cost
    });
    return total
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    if (this.modal.open) {
      this.modal.open()
    }
  }

  closeModal() {
    if (this.modal.close) {
      this.modal.close()
    }
  }
}
