package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import com.cart.ecom_proj.util.AsyncHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Service demo cho các tác vụ bất đồng bộ phức tạp
 * Minh họa cách sử dụng bất đồng bộ cho các tác vụ nặng
 */
@Service
public class AsyncDemoService {

    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private AsyncHelper asyncHelper;

    /**
     * Tìm kiếm sản phẩm song song theo nhiều tiêu chí khác nhau
     * Thực hiện nhiều tìm kiếm đồng thời và kết hợp kết quả
     * @param keyword - Từ khóa tìm kiếm chung
     * @return CompletableFuture<List<Product>> - Danh sách sản phẩm kết quả
     */
    public CompletableFuture<List<Product>> parallelProductSearch(String keyword) {
        // Ghi log bắt đầu tác vụ
        asyncHelper.logAsyncOperationStart("parallelProductSearch");
        
        // Tạo các tác vụ tìm kiếm song song
        CompletableFuture<List<Product>> byName = searchByName(keyword);
        CompletableFuture<List<Product>> byCategory = searchByCategory(keyword);
        CompletableFuture<List<Product>> byBrand = searchByBrand(keyword);
        
        // Kết hợp kết quả từ tất cả các tìm kiếm
        return CompletableFuture.allOf(byName, byCategory, byBrand)
                .thenApply(v -> {
                    List<Product> combinedResults = new ArrayList<>();
                    
                    try {
                        // Lấy kết quả từ các tìm kiếm
                        combinedResults.addAll(byName.get());
                        combinedResults.addAll(byCategory.get());
                        combinedResults.addAll(byBrand.get());
                        
                        // Loại bỏ các sản phẩm trùng lặp
                        List<Product> uniqueResults = combinedResults.stream()
                                .distinct()
                                .collect(Collectors.toList());
                        
                        // Ghi log hoàn thành
                        asyncHelper.logAsyncOperationComplete("parallelProductSearch", uniqueResults.size() + " sản phẩm");
                        
                        return uniqueResults;
                    } catch (Exception e) {
                        // Ghi log lỗi
                        asyncHelper.logAsyncOperationError("parallelProductSearch", e);
                        throw new RuntimeException("Lỗi khi kết hợp kết quả tìm kiếm", e);
                    }
                });
    }

    /**
     * Tìm kiếm sản phẩm theo tên
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<List<Product>> - Danh sách sản phẩm kết quả
     */
    @Async("asyncExecutor")
    public CompletableFuture<List<Product>> searchByName(String keyword) {
        // Giả lập tác vụ nặng
        simulateHeavyTask(500);
        
        // Thực hiện tìm kiếm
        List<Product> products = productRepo.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
        
        return CompletableFuture.completedFuture(products);
    }

    /**
     * Tìm kiếm sản phẩm theo danh mục
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<List<Product>> - Danh sách sản phẩm kết quả
     */
    @Async("asyncExecutor")
    public CompletableFuture<List<Product>> searchByCategory(String keyword) {
        // Giả lập tác vụ nặng
        simulateHeavyTask(700);
        
        // Thực hiện tìm kiếm
        List<Product> products = productRepo.findAll().stream()
                .filter(p -> p.getCategory().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
        
        return CompletableFuture.completedFuture(products);
    }

    /**
     * Tìm kiếm sản phẩm theo thương hiệu
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<List<Product>> - Danh sách sản phẩm kết quả
     */
    @Async("asyncExecutor")
    public CompletableFuture<List<Product>> searchByBrand(String keyword) {
        // Giả lập tác vụ nặng
        simulateHeavyTask(600);
        
        // Thực hiện tìm kiếm
        List<Product> products = productRepo.findAll().stream()
                .filter(p -> p.getBrand().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
        
        return CompletableFuture.completedFuture(products);
    }

    /**
     * Giả lập một tác vụ nặng bằng cách ngủ một khoảng thời gian
     * @param millis - Thời gian ngủ (milliseconds)
     */
    private void simulateHeavyTask(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Xử lý hàng loạt sản phẩm theo cách bất đồng bộ
     * Ví dụ: cập nhật giá, tính toán khuyến mãi, v.v.
     * @return CompletableFuture<Integer> - Số lượng sản phẩm đã xử lý
     */
    @Async("asyncExecutor")
    public CompletableFuture<Integer> batchProcessProducts() {
        List<Product> allProducts = productRepo.findAll();
        int count = 0;
        
        for (Product product : allProducts) {
            // Giả lập xử lý mỗi sản phẩm
            simulateHeavyTask(100);
            count++;
        }
        
        return CompletableFuture.completedFuture(count);
    }
}