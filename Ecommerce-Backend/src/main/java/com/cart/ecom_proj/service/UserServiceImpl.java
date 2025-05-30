package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.LoginRequest;
import com.cart.ecom_proj.dto.RegisterRequest;
import com.cart.ecom_proj.model.Role;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.RoleRepository;
import com.cart.ecom_proj.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password .PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (encoder.matches(request.getPassword(), user.getPassword())) {
            return "Login successful";
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Override
    public void register(RegisterRequest request) {
        if(userRepository.findByUsername(request.getUsername()).isPresent())
            throw new RuntimeException("Username already exists!");

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(Collections.singleton(userRole));
        userRepository.save(user);
    }
}
