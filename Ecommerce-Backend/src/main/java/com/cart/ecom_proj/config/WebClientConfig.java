package com.cart.ecom_proj.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Cấu hình WebClient để thực hiện các request HTTP bất đồng bộ
 * WebClient là một phần của Spring WebFlux, cung cấp API bất đồng bộ và non-blocking
 */
@Configuration
public class WebClientConfig {

    /**
     * Tạo và cấu hình WebClient
     * @return WebClient - Đối tượng WebClient đã được cấu hình
     */
    @Bean
    public WebClient webClient() {
        // Cấu hình kích thước bộ nhớ đệm
        final int size = 16 * 1024 * 1024; // 16MB
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        
        // Cấu hình HTTP client với timeout
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000) // Timeout kết nối: 10 giây
                .responseTimeout(Duration.ofSeconds(10)) // Timeout phản hồi: 10 giây
                .doOnConnected(conn -> 
                        conn.addHandlerLast(new ReadTimeoutHandler(10, TimeUnit.SECONDS)) // Timeout đọc: 10 giây
                            .addHandlerLast(new WriteTimeoutHandler(10, TimeUnit.SECONDS))); // Timeout ghi: 10 giây
        
        // Tạo WebClient với các cấu hình
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .filter(logRequest()) // Thêm bộ lọc để ghi log request
                .filter(logResponse()) // Thêm bộ lọc để ghi log response
                .build();
    }
    
    /**
     * Bộ lọc để ghi log request
     * @return ExchangeFilterFunction - Bộ lọc
     */
    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            System.out.println("Request: " + clientRequest.method() + " " + clientRequest.url());
            clientRequest.headers().forEach((name, values) -> 
                    values.forEach(value -> System.out.println(name + ": " + value)));
            return Mono.just(clientRequest);
        });
    }
    
    /**
     * Bộ lọc để ghi log response
     * @return ExchangeFilterFunction - Bộ lọc
     */
    private ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            System.out.println("Response status: " + clientResponse.statusCode());
            clientResponse.headers().asHttpHeaders().forEach((name, values) -> 
                    values.forEach(value -> System.out.println(name + ": " + value)));
            return Mono.just(clientResponse);
        });
    }
}