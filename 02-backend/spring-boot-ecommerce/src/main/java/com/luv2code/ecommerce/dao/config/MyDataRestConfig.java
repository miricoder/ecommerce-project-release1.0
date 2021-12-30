package com.luv2code.ecommerce.dao.config;


import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    /**
     * For reading data from application.properties file
     */
    @Value("${allowed.Origins}")
    private String[] theAllowedOrigins;

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        //disable HTTP methods for Product: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
                .withCollectionExposure((((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))));
        //disable HTTP methods for Product Category: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
                .withCollectionExposure((((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))));
        //Call internal helper method
        exposeIds(config);

        /**
         * As part of December 29 2021 refactoring effort - Configuring  CORS Mapping
         * Remove the cross origin @CrossOrigin anotoation from StateRepository.java class
         */
        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(theAllowedOrigins);
    }
    private void exposeIds(RepositoryRestConfiguration config){
        //expose entity ids
        //
        // - get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of the entity types
        List<Class> entityCLasses = new ArrayList<>();

        // - get the entity types for the entities
        for (EntityType tempEntityType: entities){
            entityCLasses.add(tempEntityType.getJavaType());
        }
        // - expose the entity types for the array of entity/domain types
        Class[] domainTypes = entityCLasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}

