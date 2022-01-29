import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "../shared/services/order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersBackService} from "../shared/services/ordersBack.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.sass'],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef
  isRoot!: boolean
  modal!: MaterialInstance
  pending = false
  oSub!: Subscription

  constructor(
    private router: Router,
    public order: OrderService,
    private orderService: OrdersBackService,
  ) {
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === "/order"
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === "/order"
      }
    })
  }

  ngOnDestroy(): void {
    if (this.modal.destroy) {
      this.modal.destroy()
    }
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  open() {
    if (this.modal.open) {
      this.modal.open()
    }
  }

  cancel() {
    if (this.modal.close) {
      this.modal.close()
    }
  }

  submit() {
    this.pending = true
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }
    console.log(this.order.list)

    this.oSub = this.orderService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        if (this.modal.close) {
          this.modal.close()
        }
        this.pending = false
      }
    )
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }
}
