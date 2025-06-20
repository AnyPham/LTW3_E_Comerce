package com.cart.ecom_proj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Lớp cấu hình chi tiết cho xử lý bất đồng bộ
 * Cung cấp các cấu hình nâng cao cho ThreadPoolTaskExecutor
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Cấu hình ThreadPoolTaskExecutor cho các tác vụ bất đồng bộ
     * @return Executor - Đối tượng thực thi các tác vụ bất đồng bộ
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Số lượng thread cốt lõi trong pool
        executor.setCorePoolSize(2);
        
        // Số lượng thread tối đa trong pool
        executor.setMaxPoolSize(4);
        
        // Kích thước hàng đợi
        executor.setQueueCapacity(50);
        
        // Tiền tố cho tên thread
        executor.setThreadNamePrefix("ProductAsync-");
        
        // Cấu hình xử lý khi từ chối tác vụ
        executor.setRejectedExecutionHandler((r, e) -> {
            // Xử lý khi thread pool bị quá tải
            System.err.println("Tác vụ bị từ chối do thread pool quá tải");
        });
        
        // Đặt thời gian chờ trước khi hủy thread không hoạt động (60 giây)
        executor.setKeepAliveSeconds(60);
        
        // Cho phép thread cốt lõi hết thời gian chờ
        executor.setAllowCoreThreadTimeOut(true);
        
        // Đợi tất cả các tác vụ hoàn thành khi shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);
        
        // Thời gian tối đa đợi các tác vụ hoàn thành khi shutdown (10 giây)
        executor.setAwaitTerminationSeconds(10);
        
        // Khởi tạo executor
        executor.initialize();
        
        return executor;
    }
}