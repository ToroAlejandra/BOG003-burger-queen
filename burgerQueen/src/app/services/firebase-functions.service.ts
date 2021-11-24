import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from '../classes/order';
import { Product } from '../classes/orderProduct';
import { IOrder } from '../interfaces/pedido.interface';
import { doc, onSnapshot } from "firebase/firestore";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
  })

export class firebaseFunctionsService {

  order: Order[] = [];
  product: Product[] = [];
  getOrders$: Observable<any[]> | undefined;

  constructor(private db: AngularFirestore) {}

  addOrder(order: Order) {
    this.db
      .collection('order')
      .doc()
      .set({
        nameClient: order.nameClient,
        table: order.table,
        date: order.creationTime,
        products: order.products.map((element) =>  element.toFirebase())
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log('No se pudo realizar la inserción', err);
      });
  }

  getData(){
    this.getOrders$ = this.db.collection('order').snapshotChanges();
    console.log("Este es el observable",this.getOrders$);

    return this.getOrders$

  }
}
