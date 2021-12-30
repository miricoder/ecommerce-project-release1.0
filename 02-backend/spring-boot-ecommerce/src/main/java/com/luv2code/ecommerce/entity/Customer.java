package com.luv2code.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="customer")
@Getter
@Setter
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders = new HashSet<>();

    /***
     * Convenience Method to adding new order for the customer
     */
    public void add(Order order){
        if(order != null){
            if(orders == null ){
                orders = new HashSet<>();
            }
            orders.add(order);
            //Setting a By-Directional connection back to Customer - lambok handles this 
            order.setCustomer(this);
        }
    }



}
