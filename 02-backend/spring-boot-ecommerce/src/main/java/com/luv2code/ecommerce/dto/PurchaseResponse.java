package com.luv2code.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {
    /*
    Lombok gives you constructor if you are using final keyword
    final keyword fixed the issue that happened in step 7 of CheckoutServiceImpl.java
     */
    private final String orderTrackingNumber;
}
