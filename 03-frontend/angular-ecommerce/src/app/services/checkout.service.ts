import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase'

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    //Send the data to purchaseUrl by passing over the purchase Object
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
