package com.luv2code.ecommerce.controller;

import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    /*
    Injecting CheckoutService by using a constructor
    We could use @Autowired instead but we only have one constructor so we inject CheckoutService instead
     */
    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        /*
        Calling the CheckoutService to handle purchase

        PurchaseResponse -> DTO
         */
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }
}
