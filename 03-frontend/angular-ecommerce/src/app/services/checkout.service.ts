import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = environment.luv2shopApiUrl+'/checkout/purchase'

  private paymentIntentUrl = environment.luv2shopApiUrl+'/checkout/payment-intent'
  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    //Send the data to purchaseUrl by passing over the purchase Object
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any>{
    //Making a Rest Call to the backend making a PaymentIntent  
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
