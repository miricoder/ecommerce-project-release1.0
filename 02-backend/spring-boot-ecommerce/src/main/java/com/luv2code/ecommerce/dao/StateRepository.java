package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

//@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {
    /**
     *
     * @param code
     * @return
     * http://localhost:8080/api/states
     * http://localhost:8080/api/states/search/findByCountryCode?code=IN
     * http://localhost:8080/api/states/search/findByCountryCode?code=US
     *
     */

    List<State> findByCountryCode(@Param("code") String code);
}
