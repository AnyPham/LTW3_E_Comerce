package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.LoginRequest;
import com.cart.ecom_proj.dto.RegisterRequest;
import com.cart.ecom_proj.model.User;

public interface UserService {
    String login(LoginRequest request);
    void register(RegisterRequest request);
}
