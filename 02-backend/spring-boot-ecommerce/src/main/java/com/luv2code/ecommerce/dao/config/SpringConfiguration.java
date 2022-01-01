package com.luv2code.ecommerce.dao.config;


import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * CONFIGURATIONS FOR SECURING PROTECTED SERVICES
 */
@Configuration
public class SpringConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        //protect endpoints /api/orders
        http.authorizeRequests()
                //Apply it to /api/order/** (star means recursivly for all other sub paths)
                .antMatchers("/api/orders/**")
                //Protecting the endpoint by making it available only for the Authenticated Users
                .authenticated()
                .and()
                //Configure OAUTH2 Resource Server Support
                .oauth2ResourceServer()
                //Enable JWT-encoded bearer token support - which comes in the request header
                .jwt();
                //Add CORS filters
        http.cors();
        //force a non-empty response body for 401's to make the response more friendly
        Okta.configureResourceServer401ResponseBody(http);
    }
}
