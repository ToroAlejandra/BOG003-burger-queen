import { Component, OnInit, AfterContentInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { sendDataService } from 'src/app/services/carry-cards';
import { firebaseFunctionsService } from 'src/app/services/firebase-functions.service';

@Component({
  selector: 'app-view-chef-order',
  templateUrl: './view-chef-order.component.html',
  styleUrls: ['./view-chef-order.component.css'],
})

export class ViewChefOrderComponent implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy{

  getDataSuscription!: Subscription;
  cardsElements: any;
  stateBarChange: string = "";
  idOrder: string = "";
  stateSave: string ="";
  private subscriptions: Subscription[] = []; 

  constructor(private sendCardsService: sendDataService, private firebaseService: firebaseFunctionsService) {

  }

  ngOnInit(): void {
    this.getDataOrderChef();
    this.subscriptions.push(
      this.firebaseService.getState().subscribe((res: any) => {
        this.idOrder = res.id;
          this.stateSave = res.status;
          console.log(res, "estado orden", this.stateBarChange&&this.stateBarChange, "estado", this.stateSave);
          this.cardChefEdit(this.idOrder);
      })
    )
  }
  
  ngAfterContentInit(): void {
  }
  
  ngAfterViewChecked(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.map((subscription)=>{subscription.unsubscribe()});
  }

  getDataOrderChef() {
    this.subscriptions.push(
      this.firebaseService.getOrderData().subscribe((res: any) => {
        this.cardsElements = res;
        console.log('\n\n res -----',res);
      })
    );
    return this.cardsElements;
  }

  stateOrderChange(event: string){
    this.stateBarChange = event;
  }

  cardChefEdit(id: string){
    const order: any = {
      statusOrder: this.stateBarChange
    }

    this.firebaseService.editCard(id, order.statusOrder)
    .then((res)=>{
      //modificar estado en la barra de estado en caso que sea exitoso
    }, error => console.log(error));
  }
}
