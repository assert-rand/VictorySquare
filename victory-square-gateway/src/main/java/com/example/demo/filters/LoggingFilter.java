package com.example.demo.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class LoggingFilter implements GatewayFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        log.info("Incoming request: Method={}, Path={}", request.getMethod(), request.getURI().getPath());

        return chain.filter(exchange).doOnSuccess(aVoid -> {
            ServerHttpResponse response = exchange.getResponse();
            log.info("Outgoing response: Status={}", response.getStatusCode());
        });
    }
}
