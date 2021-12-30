package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;



@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order,Long> {
    /**
    -> This allows users to query their order history
    -> findByCustomerEmail with param email basically does the below sql query on the backend for us
        SELECT * FROM orders LEFT OUTER JOIN customer ON orders.customer_id=customer.id WHERE customer.email=:email (this is what is passed as a @param)
     ->END POINT IS LIKE BELOW
     http://localhost:8080/api/orders/search/findByCustomerEmail?email=qa.group.notes@gmail.com
     -> Pageable is for Pagination support incase we have 100 or more orders in return
     */


    Page<Order> findByCustomerEmail(@Param("email") String email, Pageable pageable);


}
