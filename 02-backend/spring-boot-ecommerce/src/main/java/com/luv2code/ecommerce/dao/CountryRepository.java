package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@CrossOrigin("http://localhost:4200")
//Expose /countries endpoint ---> http://localhost:8080/api/countries
//to get country id number 4 ---> http://localhost:8080/api/countries/4
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryRepository extends JpaRepository<Country, Integer> {

}
