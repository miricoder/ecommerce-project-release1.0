package com.luv2code.ecommerce.dao.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/***
 * This configuration is read in CheckoutController class
 */
@Configuration
public class MyAppConfig implements WebMvcConfigurer {
    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry cors) {
        // configure cors mapping
        cors.addMapping(basePath + "/**").allowedOrigins(theAllowedOrigins);

    }
}
