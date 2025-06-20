package com.cart.ecom_proj.exception;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Lớp xử lý ngoại lệ cho các phương thức bất đồng bộ
 * Bắt và xử lý các ngoại lệ không được xử lý trong các phương thức @Async
 */
@Component
public class AsyncExceptionHandler implements AsyncUncaughtExceptionHandler {

    /**
     * Xử lý ngoại lệ không được bắt trong các phương thức bất đồng bộ
     * @param ex - Ngoại lệ phát sinh
     * @param method - Phương thức gây ra ngoại lệ
     * @param params - Tham số của phương thức
     */
    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        System.err.println("=== Lỗi bất đồng bộ không được xử lý ===");
        System.err.println("Phương thức: " + method.getDeclaringClass().getName() + "." + method.getName());
        System.err.println("Ngoại lệ: " + ex.getMessage());
        System.err.println("Stack trace:");
        ex.printStackTrace();
        
        // Ở đây bạn có thể thêm logic để ghi log, gửi thông báo, hoặc xử lý lỗi theo cách khác
        // Ví dụ: gửi email thông báo lỗi, lưu lỗi vào cơ sở dữ liệu, v.v.
    }
}