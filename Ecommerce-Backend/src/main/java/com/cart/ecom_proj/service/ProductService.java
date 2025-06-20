package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    /**
     * Phương thức đồng bộ để lấy tất cả sản phẩm
     */
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    /**
     * Phương thức bất đồng bộ để lấy tất cả sản phẩm
     * CompletableFuture cho phép xử lý bất đồng bộ và trả về kết quả trong tương lai
     */
    @Async("asyncExecutor")
    public CompletableFuture<List<Product>> getAllProductsAsync() {
        List<Product> products = repo.findAll();
        return CompletableFuture.completedFuture(products);
    }

    /**
     * Phương thức đồng bộ để lấy sản phẩm theo ID
     */
    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    /**
     * Phương thức bất đồng bộ để lấy sản phẩm theo ID
     */
    @Async("asyncExecutor")
    public CompletableFuture<Product> getProductByIdAsync(int id) {
        Product product = repo.findById(id).orElse(null);
        return CompletableFuture.completedFuture(product);
    }

    /**
     * Phương thức đồng bộ để thêm sản phẩm mới
     */
    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    /**
     * Phương thức bất đồng bộ để thêm sản phẩm mới
     */
    @Async("asyncExecutor")
    public CompletableFuture<Product> addProductAsync(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        Product savedProduct = repo.save(product);
        return CompletableFuture.completedFuture(savedProduct);
    }

    /**
     * Phương thức đồng bộ để cập nhật sản phẩm
     */
    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        product.setImageDate(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        return repo.save(product);
    }

    /**
     * Phương thức bất đồng bộ để cập nhật sản phẩm
     */
    @Async("asyncExecutor")
    public CompletableFuture<Product> updateProductAsync(int id, Product product, MultipartFile imageFile) throws IOException {
        product.setImageDate(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        Product updatedProduct = repo.save(product);
        return CompletableFuture.completedFuture(updatedProduct);
    }

    /**
     * Phương thức đồng bộ để xóa sản phẩm
     */
    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    /**
     * Phương thức bất đồng bộ để xóa sản phẩm
     */
    @Async("asyncExecutor")
    public CompletableFuture<Void> deleteProductAsync(int id) {
        repo.deleteById(id);
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Phương thức đồng bộ để tìm kiếm sản phẩm
     */
    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }

    /**
     * Phương thức bất đồng bộ để tìm kiếm sản phẩm
     */
    @Async("asyncExecutor")
    public CompletableFuture<List<Product>> searchProductsAsync(String keyword) {
        List<Product> products = repo.searchProducts(keyword);
        return CompletableFuture.completedFuture(products);
    }
}
