import { Product } from "./orderProduct";

export class Order {
  nameClient: string = '';
  table: string = '';
  creationTime: Date = new Date(Date.now());
  products: Product[] = [];
  id:string = "";
  status: string[] = [];
}
