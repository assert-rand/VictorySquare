package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.demo.filters.AuthenticationFilter;
import com.example.demo.filters.LoggingFilter;

import org.springframework.cloud.gateway.route.RouteLocator;

@Configuration
public class ApiGatewayConfiguration {
    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Autowired
    private LoggingFilter loggingFilter;

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder builder){
        GatewayFilter authFilter = authenticationFilter.apply(new AuthenticationFilter.Config());
        return builder.routes()
                .route(
                        p -> p.path("/game-service/**")
                                .filters(spec -> spec.filter(loggingFilter).filter(authFilter))
                                .uri("lb://game-service")
                )
                .route(
                        p -> p.path("/authentication-service/**")
                        .filters(spec -> spec.filter(loggingFilter))
                        .uri("lb://authentication-service")
                )
                .build();
    }
}
