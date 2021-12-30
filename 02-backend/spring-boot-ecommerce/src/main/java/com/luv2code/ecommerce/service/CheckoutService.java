package com.luv2code.ecommerce.service;


import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    /**
     * Pass in a Purchase DTO and send back a Purchase Response
      * @param purchase
     * @return
     */
    PurchaseResponse placeOrder(Purchase purchase);
}
