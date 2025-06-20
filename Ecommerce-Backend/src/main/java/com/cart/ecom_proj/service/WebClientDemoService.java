package com.cart.ecom_proj.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service demo cho việc sử dụng WebClient
 * Minh họa cách thực hiện các request HTTP bất đồng bộ
 */
@Service
public class WebClientDemoService {

    @Autowired
    private WebClient webClient;

    /**
     * Thực hiện GET request bất đồng bộ
     * @param url - URL của API
     * @return Mono<Map> - Kết quả bất đồng bộ
     */
    public Mono<Map> getAsync(String url) {
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnSuccess(response -> System.out.println("GET request thành công: " + url))
                .doOnError(error -> System.err.println("Lỗi GET request: " + error.getMessage()));
    }

    /**
     * Thực hiện POST request bất đồng bộ
     * @param url - URL của API
     * @param body - Dữ liệu gửi đi
     * @return Mono<Map> - Kết quả bất đồng bộ
     */
    public Mono<Map> postAsync(String url, Object body) {
        return webClient.post()
                .uri(url)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnSuccess(response -> System.out.println("POST request thành công: " + url))
                .doOnError(error -> System.err.println("Lỗi POST request: " + error.getMessage()));
    }

    /**
     * Thực hiện nhiều request bất đồng bộ và kết hợp kết quả
     * @param urls - Danh sách URL
     * @return Mono<String> - Kết quả bất đồng bộ
     */
    public Mono<String> fetchMultipleApis(String... urls) {
        // Tạo danh sách các Mono từ các URL
        if (urls.length == 0) {
            return Mono.just("Không có URL nào được cung cấp");
        }
        
        // Tạo danh sách các Mono
        List<Mono<String>> monoList = new ArrayList<>();
        
        for (int i = 0; i < urls.length; i++) {
            final int index = i;
            Mono<String> mono = webClient.get()
                    .uri(urls[i])
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(response -> "API " + (index + 1) + ": " + response.substring(0, Math.min(100, response.length())) + "...")
                    .onErrorResume(e -> Mono.just("API " + (index + 1) + ": Lỗi - " + e.getMessage()));
            
            monoList.add(mono);
        }
        
        // Xử lý trường hợp chỉ có 1 URL
        if (urls.length == 1) {
            return monoList.get(0);
        }
        
        // Xử lý trường hợp có 2 URL
        if (urls.length == 2) {
            return Mono.zip(monoList.get(0), monoList.get(1))
                    .map(tuple -> {
                        StringBuilder result = new StringBuilder("Kết quả từ 2 API:\n");
                        result.append(tuple.getT1()).append("\n");
                        result.append(tuple.getT2()).append("\n");
                        return result.toString();
                    });
        }
        
        // Xử lý trường hợp có nhiều URL bằng cách sử dụng Flux
        return Flux.fromIterable(monoList)
                .flatMap(mono -> mono)
                .collectList()
                .map(responses -> {
                    StringBuilder result = new StringBuilder("Kết quả từ " + responses.size() + " API:\n");
                    for (String response : responses) {
                        result.append(response).append("\n");
                    }
                    return result.toString();
                });
    }
}