package com.luv2code.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="order_tracking_number")
    private String orderTrackingNumber;

    @Column(name="total_quantity")
    private int totalQuantity;

    @Column(name="total_price")
    private BigDecimal totalPrice;

    @Column(name="status")
    private String status;

    @Column(name="date_created")
    @CreationTimestamp //From Hibernate
    private Date dateCreated;

    @Column(name="last_updated")
    @UpdateTimestamp //From Hibernate
    private Date lastUpdated;

    /***
     * Entity Relationship between Order-->OrderItems (Zero to Many)
     */
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private Set<OrderItem> orderItems = new HashSet<>();

    /***
     * Entity Relationship between Order-->Customer (Zero to Many)
     */
    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

    /***
     * Entity Relationship: Order-->Address (One to One)
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
    private Address shippingAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
    private Address billingAddress;


    /**
     * Convenience method to add items (
     * @param item
     */
    public void add(OrderItem item){
        if(item != null ){
            //If order items is empty create a new one
            if(orderItems == null ){
                orderItems = new HashSet<>();
            }
            orderItems.add(item);
            //Setting by-directional connection with orderItem usig "this"
            item.setOrder(this);

        }
    }
}

