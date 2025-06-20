package com.cart.ecom_proj.util;

import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

/**
 * Lớp tiện ích để hỗ trợ xử lý các tác vụ bất đồng bộ
 * Cung cấp các phương thức để theo dõi, ghi log và xử lý kết quả của CompletableFuture
 */
@Component
public class AsyncHelper {

    /**
     * Ghi log khi một tác vụ bất đồng bộ bắt đầu
     * @param operationName - Tên của tác vụ
     */
    public void logAsyncOperationStart(String operationName) {
        System.out.println("Bắt đầu tác vụ bất đồng bộ: " + operationName + " - Thread: " + Thread.currentThread().getName());
    }

    /**
     * Ghi log khi một tác vụ bất đồng bộ hoàn thành
     * @param operationName - Tên của tác vụ
     * @param result - Kết quả của tác vụ (có thể là null)
     */
    public void logAsyncOperationComplete(String operationName, Object result) {
        System.out.println("Hoàn thành tác vụ bất đồng bộ: " + operationName + " - Thread: " + Thread.currentThread().getName());
    }

    /**
     * Ghi log khi một tác vụ bất đồng bộ gặp lỗi
     * @param operationName - Tên của tác vụ
     * @param error - Lỗi phát sinh
     */
    public void logAsyncOperationError(String operationName, Throwable error) {
        System.err.println("Lỗi trong tác vụ bất đồng bộ: " + operationName + " - Thread: " + Thread.currentThread().getName());
        System.err.println("Chi tiết lỗi: " + error.getMessage());
    }

    /**
     * Bọc một CompletableFuture với các hàm ghi log
     * @param future - CompletableFuture cần bọc
     * @param operationName - Tên của tác vụ
     * @param <T> - Kiểu dữ liệu của kết quả
     * @return CompletableFuture<T> - CompletableFuture đã được bọc
     */
    public <T> CompletableFuture<T> withLogging(CompletableFuture<T> future, String operationName) {
        logAsyncOperationStart(operationName);
        
        return future.thenApply(result -> {
            logAsyncOperationComplete(operationName, result);
            return result;
        }).exceptionally(error -> {
            logAsyncOperationError(operationName, error);
            throw new RuntimeException(error);
        });
    }

    /**
     * Thực hiện một tác vụ bất đồng bộ với timeout
     * @param future - CompletableFuture cần thực hiện
     * @param fallback - Giá trị mặc định nếu timeout
     * @param <T> - Kiểu dữ liệu của kết quả
     * @return T - Kết quả hoặc giá trị mặc định
     */
    public <T> T executeWithTimeout(CompletableFuture<T> future, T fallback, long timeoutMillis) {
        try {
            return future.orTimeout(timeoutMillis, java.util.concurrent.TimeUnit.MILLISECONDS)
                    .exceptionally(ex -> {
                        System.err.println("Tác vụ bất đồng bộ bị timeout hoặc lỗi: " + ex.getMessage());
                        return fallback;
                    })
                    .get();
        } catch (Exception e) {
            System.err.println("Lỗi khi chờ kết quả bất đồng bộ: " + e.getMessage());
            return fallback;
        }
    }

    /**
     * Kết hợp nhiều CompletableFuture thành một
     * @param futures - Danh sách các CompletableFuture
     * @param <T> - Kiểu dữ liệu của kết quả
     * @return CompletableFuture<Void> - CompletableFuture hoàn thành khi tất cả đều hoàn thành
     */
    @SafeVarargs
    public final <T> CompletableFuture<Void> combineAll(CompletableFuture<T>... futures) {
        return CompletableFuture.allOf(futures);
    }
}