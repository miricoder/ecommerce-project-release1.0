import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { isThisTypeNode } from 'typescript';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[]=[];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  handleOrderHistory(){
    //read the user's email address from browser storage 
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!); // userEmail-> is the key

    //retrieve data from the service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data=>{
        //assign data to orderHistoryList by subscribing to service and getting data from service 
        this.orderHistoryList = data._embedded.orders; 
      }
    );
  }

}
