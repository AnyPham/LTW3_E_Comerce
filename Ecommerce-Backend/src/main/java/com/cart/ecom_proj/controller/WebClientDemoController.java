package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.service.WebClientDemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controller demo cho việc sử dụng WebClient
 * Minh họa cách thực hiện các request HTTP bất đồng bộ
 */
@RestController
@CrossOrigin
@RequestMapping("/api/webclient-demo")
public class WebClientDemoController {

    @Autowired
    private WebClientDemoService webClientDemoService;

    /**
     * Demo GET request bất đồng bộ
     * @param url - URL của API
     * @return Mono<Map> - Kết quả bất đồng bộ
     */
    @GetMapping("/get")
    public Mono<Map> getAsync(@RequestParam String url) {
        return webClientDemoService.getAsync(url);
    }

    /**
     * Demo POST request bất đồng bộ
     * @param url - URL của API
     * @param body - Dữ liệu gửi đi
     * @return Mono<Map> - Kết quả bất đồng bộ
     */
    @PostMapping("/post")
    public Mono<Map> postAsync(@RequestParam String url, @RequestBody Map<String, Object> body) {
        return webClientDemoService.postAsync(url, body);
    }

    /**
     * Demo nhiều request bất đồng bộ
     * @return Mono<String> - Kết quả bất đồng bộ
     */
    @GetMapping(value = "/multi", produces = MediaType.TEXT_PLAIN_VALUE)
    public Mono<String> multipleRequests() {
        return webClientDemoService.fetchMultipleApis(
                "https://jsonplaceholder.typicode.com/posts/1",
                "https://jsonplaceholder.typicode.com/users/1",
                "https://jsonplaceholder.typicode.com/comments/1"
        );
    }
}