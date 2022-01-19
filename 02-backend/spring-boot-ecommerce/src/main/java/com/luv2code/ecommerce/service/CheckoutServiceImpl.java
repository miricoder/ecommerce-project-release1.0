package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dao.CustomerRepository;
import com.luv2code.ecommerce.dto.PaymentInfo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;

    /*
    --Injecting the customerServiceRepo into CheckoutImpl via Constructor instread of @Autowired
    --@Autowired is optional since we only have a single constructor
     */
//    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey){
        this.customerRepository = customerRepository;
        //initialize Stripe API with secret key
        Stripe.apiKey=secretKey;

    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        /*
        [1] Retrieve the order info from dto
        ------------------------------------------------------------------------------------------------------------
         */
        Order order = purchase.getOrder();

        /*
        [2A] generate tracking number
        ------------------------------------------------------------------------------------------------------------
         */
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        /*
        [3] populate order with orderItems
        LAMBDA Operator for easy looping: orderItems.forEach(item -> order.add(item));
        ------------------------------------------------------------------------------------------------------------
         */
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        /*
        [4] populate order with billingAddress and shippingAddress
        ------------------------------------------------------------------------------------------------------------
         */
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        /*
        [5] populate customer with order
        ------------------------------------------------------------------------------------------------------------
         */
        Customer customer = purchase.getCustomer();
        /***
         * [LOGIC] Check if this is an existing customer
         */
        String theEmail =  customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if(customerFromDB != null){
            //If found let's assign them accordingly
            customer = customerFromDB;
        }
        customer.add(order);
        /*
        [6] save to the database
        ------------------------------------------------------------------------------------------------------------
         */
            customerRepository.save(customer);
        /*
        [7] return response
        orderTrackingNumber threw an error which was related to final keyword not being used and therefore lombok
        not creating a constructor: See ---> https://projectlombok.org
        ------------------------------------------------------------------------------------------------------------
         */
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types",paymentMethodTypes);
        params.put("description", "Luv2Shop purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());
        return PaymentIntent.create(params);
    }

    /*
    [2B] Generate a unique ID which will be hard to guess and random
     ****i.e. DO NOT USE DATA BASE GENERATE ID WHICH IS NOT FOR PUBLIC
     */
    private String generateOrderTrackingNumber() {
        /*
        [A] generate a random  UUID/Universally unique identifier number (UUID version-4)
        For details see: https://en.wikipedia.org/wiki/Universally_unique_identifier
         */
        return UUID.randomUUID().toString();
    }
}
