import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from '../classes/order';
import { Product } from '../classes/orderProduct';
import { Observable, of, Subject } from 'rxjs';
import { OperationType } from '../models/operationType.enum';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root',
})

export class firebaseFunctionsService {

  order: Order[] = [];
  product: Product[] = [];
  getOrders$: Observable<any[]> | undefined;
  orderSave: any = [];
  orderElement: Order[] = [];
  orderProducts: Product[] = [];
  getOrderElements: any = [];
  statusOrder: any = "";
  private updateCard$ = new Subject<any>();

  constructor(private db: AngularFirestore) { }

  addOrder(order: Order) {
    this.db
      .collection('order')
      .doc()
      .set({
        date: order.creationTime,
        nameClient: order.nameClient,
        table: order.table,
        products: order.products.map((element) => element.toFirebase()),
        statusOrder: []
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log('No se pudo realizar la inserción', err);
      });
  }

  getData() {
    this.getOrders$ = this.db.collection('order', ref => ref.orderBy('date', 'desc'))
    .stateChanges([OperationType.modified, OperationType.added])
      //.snapshotChanges();
    return this.getOrders$;
  }

  getOrderData(): Observable<any> {
    this.orderElement = [];
    return this.getData().pipe(
      map(actions => actions.map(i => {
        console.log('\n\n', i);
        let newOrderElement = new Order();
        newOrderElement.nameClient = i.payload.doc.data().nameClient;
        newOrderElement.table = i.payload.doc.data().table;
        newOrderElement.id = i.payload.doc.ref.id;
        newOrderElement.creationTime = new Date(i.payload.doc.data().date.seconds * 1000);

        i.payload.doc.data().products.forEach((e: any) => {
          let newProduct = new Product();
          newProduct.count = e.count;
          newProduct.nameProduct = e.nameProduct;
          newProduct.price = e.price;
          newOrderElement.products.push(newProduct);
          this.orderProducts.push(newProduct);
        });
        newOrderElement.status = i.payload.doc.data().statusOrder;
        this.selectEventType({ eventType: i.payload.type as OperationType, arrayOrders: this.orderElement, item: newOrderElement });
        return newOrderElement;
      })));
  }

  private selectEventType(data: { eventType: OperationType, arrayOrders: Order[], item: Order }) {
    const { eventType, arrayOrders, item } = data;
    const orderIndex = arrayOrders.findIndex((value: Order) => item.id == value.id);

    if (eventType == OperationType.modified) {
      arrayOrders.splice(orderIndex, 1, item);
    } else if (eventType == OperationType.added && orderIndex === -1) {
      arrayOrders.push(item);
    }
  }

  editCard(id: string, state: any): Promise<any> {
    this.statusOrder = state;
    return this.db.collection('order').doc(id).update({ statusOrder: this.db.firestore.FieldValue state });
  }

  updateState(item: Order) {
    this.updateCard$.next(item);
  }

  getState(): Observable<any> {
    return this.updateCard$.asObservable();
  }
}
