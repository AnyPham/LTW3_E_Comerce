package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.service.AsyncDemoService;
import com.cart.ecom_proj.service.ProductService;
import com.cart.ecom_proj.util.AsyncHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Controller demo cho các tính năng bất đồng bộ nâng cao
 * Minh họa các cách khác nhau để xử lý bất đồng bộ trong Spring
 */
@RestController
@CrossOrigin
@RequestMapping("/api/async-demo")
public class AsyncDemoController {

    @Autowired
    private AsyncDemoService asyncDemoService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private AsyncHelper asyncHelper;

    /**
     * Demo tìm kiếm song song theo nhiều tiêu chí
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<ResponseEntity<List<Product>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/parallel-search")
    public CompletableFuture<ResponseEntity<List<Product>>> parallelSearch(@RequestParam String keyword) {
        return asyncDemoService.parallelProductSearch(keyword)
                .thenApply(products -> new ResponseEntity<>(products, HttpStatus.OK))
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi tìm kiếm song song: " + ex.getMessage());
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                });
    }

    /**
     * Demo sử dụng DeferredResult để xử lý bất đồng bộ
     * DeferredResult cho phép giải phóng thread của servlet container
     * trong khi vẫn đang xử lý request
     * @param keyword - Từ khóa tìm kiếm
     * @return DeferredResult<ResponseEntity<List<Product>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/deferred-search")
    public DeferredResult<ResponseEntity<List<Product>>> deferredSearch(@RequestParam String keyword) {
        // Tạo DeferredResult với timeout 10 giây
        DeferredResult<ResponseEntity<List<Product>>> deferredResult = new DeferredResult<>(10000L);
        
        // Đặt kết quả mặc định nếu timeout
        deferredResult.onTimeout(() -> {
            deferredResult.setErrorResult(
                    ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                            .body("Tìm kiếm đã hết thời gian chờ")
            );
        });
        
        // Thực hiện tìm kiếm bất đồng bộ
        asyncDemoService.parallelProductSearch(keyword)
                .thenAccept(products -> {
                    // Đặt kết quả cho DeferredResult khi hoàn thành
                    deferredResult.setResult(new ResponseEntity<>(products, HttpStatus.OK));
                })
                .exceptionally(ex -> {
                    // Đặt lỗi cho DeferredResult nếu có ngoại lệ
                    deferredResult.setErrorResult(
                            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Lỗi khi tìm kiếm: " + ex.getMessage())
                    );
                    return null;
                });
        
        return deferredResult;
    }

    /**
     * Demo kết hợp nhiều tác vụ bất đồng bộ
     * @return CompletableFuture<ResponseEntity<Map<String, Object>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/combined-operations")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> combinedOperations() {
        // Thực hiện nhiều tác vụ bất đồng bộ đồng thời
        CompletableFuture<List<Product>> allProducts = productService.getAllProductsAsync();
        CompletableFuture<Integer> processedCount = asyncDemoService.batchProcessProducts();
        
        // Kết hợp kết quả từ tất cả các tác vụ
        return CompletableFuture.allOf(allProducts, processedCount)
                .thenApply(v -> {
                    try {
                        Map<String, Object> result = new HashMap<>();
                        result.put("totalProducts", allProducts.get().size());
                        result.put("processedProducts", processedCount.get());
                        result.put("timestamp", System.currentTimeMillis());
                        
                        return new ResponseEntity<>(result, HttpStatus.OK);
                    } catch (Exception e) {
                        throw new RuntimeException("Lỗi khi kết hợp kết quả", e);
                    }
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi trong tác vụ kết hợp: " + ex.getMessage());
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                });
    }

    /**
     * Demo xử lý timeout cho tác vụ bất đồng bộ
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<ResponseEntity<List<Product>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/timeout-search")
    public CompletableFuture<ResponseEntity<List<Product>>> timeoutSearch(@RequestParam String keyword) {
        return asyncDemoService.parallelProductSearch(keyword)
                // Đặt timeout 5 giây
                .orTimeout(5, TimeUnit.SECONDS)
                .thenApply(products -> new ResponseEntity<>(products, HttpStatus.OK))
                .exceptionally(ex -> {
                    if (ex.getCause() instanceof java.util.concurrent.TimeoutException) {
                        System.err.println("Tìm kiếm đã hết thời gian chờ");
                        return new ResponseEntity<>(HttpStatus.REQUEST_TIMEOUT);
                    } else {
                        System.err.println("Lỗi khi tìm kiếm: " + ex.getMessage());
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                });
    }
}