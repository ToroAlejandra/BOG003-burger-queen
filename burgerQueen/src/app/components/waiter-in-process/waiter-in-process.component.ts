import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/classes/order';
import { Product } from 'src/app/classes/orderProduct';
import { firebaseFunctionsService } from 'src/app/services/firebase-functions.service';

@Component({
  selector: 'app-waiter-in-process',
  templateUrl: './waiter-in-process.component.html',
  styleUrls: ['./waiter-in-process.component.css'],
})
export class WaiterInProcessComponent implements OnInit {
  orderSave: any = [];
  showFirestoreDate: Subscription | undefined;
  orderElement: Order[] = [];
  orderProducts: Product[] =[];

  constructor(private firebaseService: firebaseFunctionsService) {}

  ngOnInit(): void {
    this.firebaseService.getData();
    this.showDataFirebase();
    this.getOrderData();
  }
  showDataFirebase() {
    this.showFirestoreDate = this.firebaseService
      .getData()
      ?.subscribe((order) => {
        order.forEach((e) => {
          this.orderSave.push(e.payload.doc);
        });
      });
    console.log('Aqui esta el servicio', this.orderSave);
  }

  getOrderData() {
    this.orderSave.forEach((e: any) => {
      let newOrderElement = new Order();
      newOrderElement.creationTime = e.data().creationTime;
      newOrderElement.nameClient = e.data().nameClient;
      newOrderElement.table = e.data().table;
      e.data().products.forEach((i: any) => {
        let newProduct = new Product();
        newProduct.count = i.count;
        newProduct.nameProduct = i.nameProduct;
        newProduct.price = i.price;
        newOrderElement.products.push(newProduct);
        this.orderProducts.push(newProduct);
      });
      this.orderElement.push(newOrderElement);
    });
    console.log('prueba de e.data', this.orderElement);
  }
}
