package com.ardagonca.e_commerce.controller;

import com.ardagonca.e_commerce.dto.LoginRequest;
import com.ardagonca.e_commerce.dto.RegisterRequest;
import com.ardagonca.e_commerce.dto.ErrorResponse;
import com.ardagonca.e_commerce.dto.UserResponse;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.repository.UserRepository;
import com.ardagonca.e_commerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
@Validated
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.debug("Kayıt isteği alındı: {}", request.getEmail());
            var response = authService.register(request);
            log.info("Kullanıcı başarıyla kaydedildi: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Kayıt isteği geçersiz: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Kayıt işlemi sırasında beklenmeyen hata: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Kayıt işlemi sırasında bir hata oluştu"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.debug("Giriş isteği alındı: {}", request.getEmail());
            var response = authService.login(request);
            log.info("Kullanıcı başarıyla giriş yaptı: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Giriş isteği geçersiz: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Giriş işlemi sırasında hata: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Giriş işlemi başarısız"));
        }
    }

    @GetMapping("/check-admin") 
    public ResponseEntity<Boolean> checkAdmin(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.badRequest().body(false);
            }
            return ResponseEntity.ok(authService.isAdmin(authentication.getName()));
        } catch (Exception e) {
            log.error("Admin kontrolü sırasında hata: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(false);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Oturum bulunamadı"));
            }
            
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));
            
            return ResponseEntity.ok(UserResponse.builder()
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build());
        } catch (Exception e) {
            log.error("Kullanıcı bilgileri alınırken hata: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Kullanıcı bilgileri alınamadı"));
        }
    }
} 