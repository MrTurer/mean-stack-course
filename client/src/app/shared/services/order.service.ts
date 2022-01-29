import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  public list: OrderPosition[] = []
  public price = 0

  add(position: Position) {
    const orderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity as number,
      _id: position._id
    })

    const candidate = this.list.find(p => p._id === position._id)

    if (candidate) {
      candidate.quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }

    this.computePrice()
  }

  remove(orderPosition: OrderPosition) {
    const idx = this.list.findIndex(p => p._id === orderPosition._id)

    this.list.splice(idx, 1)

    this.computePrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }

  private computePrice() {
    this.price = 0
    this.list.forEach((item) => {
      this.price += item.quantity * item.cost
    });
  }
}
