package com.inventory.service;

import com.inventory.model.User;
import com.inventory.dto.LoginRequest;
import com.inventory.dto.LoginResponse;
import com.inventory.dto.RegisterRequest;
import com.inventory.repository.UserRepository;
// import com.inventory.repository.AuthRepository;
// import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getActive()) {
            throw new RuntimeException("User account is inactive");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getFullName(), jwtService.getExpirationTime());
    }
    
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole("USER");
        user.setActive(true);
        
        userRepository.save(user);
    }
}
