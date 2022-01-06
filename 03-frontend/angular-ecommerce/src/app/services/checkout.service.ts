import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = environment.luv2shopApiUrl+'/checkout/purchase'

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    //Send the data to purchaseUrl by passing over the purchase Object
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
