package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Controller xử lý các request bất đồng bộ liên quan đến sản phẩm
 * Các endpoint có tiền tố /api/async để phân biệt với các endpoint đồng bộ
 */
@RestController
@CrossOrigin
@RequestMapping("/api/async")
public class AsyncProductController {

    @Autowired
    private ProductService service;

    /**
     * Lấy tất cả sản phẩm theo cách bất đồng bộ
     * @return CompletableFuture<ResponseEntity<List<Product>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/products")
    public CompletableFuture<ResponseEntity<List<Product>>> getAllProductsAsync() {
        CompletableFuture<ResponseEntity<List<Product>>> result = new CompletableFuture<>();
        
        service.getAllProductsAsync()
                .thenAccept(products -> {
                    result.complete(new ResponseEntity<>(products, HttpStatus.OK));
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi lấy danh sách sản phẩm: " + ex.getMessage());
                    result.complete(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
                    return null;
                });
                
        return result;
    }

    /**
     * Lấy sản phẩm theo ID theo cách bất đồng bộ
     * @param id - ID của sản phẩm
     * @return CompletableFuture<ResponseEntity<Product>> - Kết quả bất đồng bộ
     */
    @GetMapping("/product/{id}")
    public CompletableFuture<ResponseEntity<Product>> getProductAsync(@PathVariable int id) {
        CompletableFuture<ResponseEntity<Product>> result = new CompletableFuture<>();
        
        service.getProductByIdAsync(id)
                .thenAccept(product -> {
                    if (product != null) {
                        result.complete(new ResponseEntity<>(product, HttpStatus.OK));
                    } else {
                        result.complete(new ResponseEntity<>(HttpStatus.NOT_FOUND));
                    }
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi lấy sản phẩm: " + ex.getMessage());
                    result.complete(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
                    return null;
                });
                
        return result;
    }

    /**
     * Thêm sản phẩm mới theo cách bất đồng bộ
     * @param product - Thông tin sản phẩm
     * @param imageFile - File hình ảnh
     * @return CompletableFuture<ResponseEntity<?>> - Kết quả bất đồng bộ
     */
    @PostMapping("/product")
    public CompletableFuture<ResponseEntity<?>> addProductAsync(
            @RequestPart Product product, 
            @RequestPart MultipartFile imageFile) {
        
        CompletableFuture<ResponseEntity<?>> result = new CompletableFuture<>();
        
        try {
            service.addProductAsync(product, imageFile)
                    .thenAccept(savedProduct -> {
                        result.complete(new ResponseEntity<>(savedProduct, HttpStatus.CREATED));
                    })
                    .exceptionally(ex -> {
                        System.err.println("Lỗi khi thêm sản phẩm: " + ex.getMessage());
                        result.complete(new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
                        return null;
                    });
        } catch (IOException e) {
            result.complete(new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
        
        return result;
    }

    /**
     * Lấy hình ảnh sản phẩm theo ID theo cách bất đồng bộ
     * @param productId - ID của sản phẩm
     * @return CompletableFuture<ResponseEntity<byte[]>> - Kết quả bất đồng bộ
     */
    @GetMapping("product/{productId}/image")
    public CompletableFuture<ResponseEntity<byte[]>> getImageByProductIdAsync(@PathVariable int productId) {
        CompletableFuture<ResponseEntity<byte[]>> result = new CompletableFuture<>();
        
        service.getProductByIdAsync(productId)
                .thenAccept(product -> {
                    if (product != null) {
                        byte[] imageFile = product.getImageDate();
                        ResponseEntity<byte[]> response = ResponseEntity.ok()
                                .contentType(MediaType.valueOf(product.getImageType("")))
                                .body(imageFile);
                        result.complete(response);
                    } else {
                        result.complete(new ResponseEntity<>(HttpStatus.NOT_FOUND));
                    }
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi lấy hình ảnh sản phẩm: " + ex.getMessage());
                    result.complete(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
                    return null;
                });
                
        return result;
    }

    /**
     * Cập nhật sản phẩm theo cách bất đồng bộ
     * @param id - ID của sản phẩm
     * @param product - Thông tin sản phẩm cập nhật
     * @param imageFile - File hình ảnh mới
     * @return CompletableFuture<ResponseEntity<String>> - Kết quả bất đồng bộ
     */
    @PutMapping("/product/{id}")
    public CompletableFuture<ResponseEntity<String>> updateProductAsync(
            @PathVariable int id,
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {
        
        CompletableFuture<ResponseEntity<String>> result = new CompletableFuture<>();
        
        try {
            service.updateProductAsync(id, product, imageFile)
                    .thenAccept(updatedProduct -> {
                        if (updatedProduct != null) {
                            result.complete(new ResponseEntity<>("Cập nhật thành công", HttpStatus.OK));
                        } else {
                            result.complete(new ResponseEntity<>("Cập nhật thất bại", HttpStatus.BAD_REQUEST));
                        }
                    })
                    .exceptionally(ex -> {
                        System.err.println("Lỗi khi cập nhật sản phẩm: " + ex.getMessage());
                        result.complete(new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
                        return null;
                    });
        } catch (IOException e) {
            result.complete(new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
        
        return result;
    }

    /**
     * Xóa sản phẩm theo cách bất đồng bộ
     * @param id - ID của sản phẩm cần xóa
     * @return CompletableFuture<ResponseEntity<String>> - Kết quả bất đồng bộ
     */
    @DeleteMapping("/product/{id}")
    public CompletableFuture<ResponseEntity<String>> deleteProductAsync(@PathVariable int id) {
        CompletableFuture<ResponseEntity<String>> result = new CompletableFuture<>();
        
        service.getProductByIdAsync(id)
                .thenAccept(product -> {
                    if (product != null) {
                        service.deleteProductAsync(id)
                                .thenAccept(v -> {
                                    result.complete(new ResponseEntity<>("Xóa thành công", HttpStatus.OK));
                                })
                                .exceptionally(ex -> {
                                    System.err.println("Lỗi khi xóa sản phẩm: " + ex.getMessage());
                                    result.complete(new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
                                    return null;
                                });
                    } else {
                        result.complete(new ResponseEntity<>("Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND));
                    }
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi tìm sản phẩm: " + ex.getMessage());
                    result.complete(new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
                    return null;
                });
                
        return result;
    }

    /**
     * Tìm kiếm sản phẩm theo từ khóa theo cách bất đồng bộ
     * @param keyword - Từ khóa tìm kiếm
     * @return CompletableFuture<ResponseEntity<List<Product>>> - Kết quả bất đồng bộ
     */
    @GetMapping("/products/search")
    public CompletableFuture<ResponseEntity<List<Product>>> searchProductsAsync(@RequestParam String keyword) {
        System.out.println("Tìm kiếm bất đồng bộ với từ khóa: " + keyword);
        
        CompletableFuture<ResponseEntity<List<Product>>> result = new CompletableFuture<>();
        
        service.searchProductsAsync(keyword)
                .thenAccept(products -> {
                    result.complete(new ResponseEntity<>(products, HttpStatus.OK));
                })
                .exceptionally(ex -> {
                    System.err.println("Lỗi khi tìm kiếm sản phẩm: " + ex.getMessage());
                    result.complete(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
                    return null;
                });
                
        return result;
    }
}