package com.example.demo.filters;

import com.example.demo.config.RouteValidator;
import com.example.demo.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {
    public AuthenticationFilter(){
        super(Config.class);
    }

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtService jwtService;

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (((exchange, chain) -> {
            if(validator.isSecured.test(exchange.getRequest())){
                //header contains token or not
                if(!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)){
                    return onError(exchange, "Missing auth header", HttpStatus.FORBIDDEN);
                }
                String authHeader = exchange.getRequest().getHeaders().get(org.springframework.http.HttpHeaders.AUTHORIZATION).get(0);
                if(authHeader != null && authHeader.startsWith("Bearer ")){
                    authHeader = authHeader.substring(7);
                }
                try{
                    jwtService.validateToken(authHeader);
                }catch(Exception e){
                    return onError(exchange, "Invalid token", HttpStatus.FORBIDDEN);
                }
                String email = jwtService.extractUsername(authHeader);
                exchange
                        .getRequest()
                        .mutate()
                        .header("x-email", email)
                        .build();
            }
            return chain.filter(exchange);
        }));
    }

    public static class Config{
    }
}
