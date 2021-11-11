import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent implements OnInit {
  @Input() myDish: any;
  @Input() screen:any;
  @Input() arrayDish: any;
  @Output() sendOrder = new EventEmitter<any>();
  @Output() acumulatorTotal = new EventEmitter<number>();

  value : number | undefined;

  constructor() { }

  ngOnInit(): void {
    console.log(this.myDish);
  }

  addDish(item: any){
    this.sendOrder.emit(item);
  }

  totalOrder(item: any){
    this.acumulatorTotal.emit(item);
    console.log("total order ", item);
  }

  increment(item: any) {
    item.count += 1;
    console.log('Acumulador', item.count);
    return item.count;
  }

  decrement(item: any) {
    if (item.count > 1) {
      item.count -= 1;
    }
    return item.count;
  }

}