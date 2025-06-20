package com.cart.ecom_proj;

import com.cart.ecom_proj.exception.AsyncExceptionHandler;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@SpringBootApplication
@EnableAsync // Kích hoạt tính năng bất đồng bộ
public class EcomProjApplication implements AsyncConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(EcomProjApplication.class, args);
	}
	
	/**
	 * Cấu hình ThreadPoolTaskExecutor để xử lý các tác vụ bất đồng bộ
	 * - corePoolSize: Số lượng thread tối thiểu luôn hoạt động
	 * - maxPoolSize: Số lượng thread tối đa có thể được tạo
	 * - queueCapacity: Số lượng tác vụ có thể đợi trong hàng đợi
	 * - threadNamePrefix: Tiền tố cho tên thread để dễ dàng debug
	 */
	@Bean(name = "asyncExecutor")
	public Executor asyncExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(3);
		executor.setMaxPoolSize(5);
		executor.setQueueCapacity(100);
		executor.setThreadNamePrefix("AsyncThread-");
		executor.initialize();
		return executor;
	}
	
	/**
	 * Cấu hình Executor mặc định cho các phương thức @Async
	 * @return Executor - Đối tượng thực thi các tác vụ bất đồng bộ
	 */
	@Override
	public Executor getAsyncExecutor() {
		return asyncExecutor();
	}
	
	/**
	 * Cấu hình xử lý ngoại lệ cho các phương thức bất đồng bộ
	 * @return AsyncUncaughtExceptionHandler - Đối tượng xử lý ngoại lệ
	 */
	@Override
	public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
		return new AsyncExceptionHandler();
	}
}
