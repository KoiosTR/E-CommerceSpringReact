package com.ardagonca.e_commerce.service;

import com.ardagonca.e_commerce.dto.LoginRequest;
import com.ardagonca.e_commerce.dto.RegisterRequest;
import com.ardagonca.e_commerce.model.Role;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.repository.UserRepository;
import com.ardagonca.e_commerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        try {
            log.info("Yeni kullanıcı kaydı başlatılıyor: {}", request.getEmail());
            
            // Validasyonlar
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                log.warn("Email adresi boş");
                throw new IllegalArgumentException("Email adresi boş olamaz");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                log.warn("Şifre boş");
                throw new IllegalArgumentException("Şifre boş olamaz");
            }
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                log.warn("Ad boş");
                throw new IllegalArgumentException("Ad boş olamaz");
            }
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                log.warn("Soyad boş");
                throw new IllegalArgumentException("Soyad boş olamaz");
            }

            // Email kontrolü
            if (userRepository.existsByEmail(request.getEmail())) {
                log.warn("Email zaten kayıtlı: {}", request.getEmail());
                throw new IllegalArgumentException("Bu email adresi zaten kayıtlı");
            }

            // Kullanıcı oluşturma
            User user = User.builder()
                    .firstName(request.getFirstName().trim())
                    .lastName(request.getLastName().trim())
                    .email(request.getEmail().trim().toLowerCase())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();

            log.debug("Kullanıcı nesnesi oluşturuldu: {}", user);

            // Kullanıcıyı kaydet
            User savedUser = userRepository.save(user);
            log.info("Kullanıcı başarıyla kaydedildi: {}", savedUser.getEmail());

            // Token oluştur
            String token = jwtService.generateToken(savedUser);
            log.debug("JWT token oluşturuldu");

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            
            log.info("Kayıt işlemi başarıyla tamamlandı");
            return response;
        } catch (Exception e) {
            log.error("Kayıt işlemi sırasında hata oluştu: {}", e.getMessage(), e);
            throw new RuntimeException("Kayıt işlemi sırasında bir hata oluştu: " + e.getMessage());
        }
    }

    public Map<String, String> login(LoginRequest request) {
        try {
            log.info("Kullanıcı girişi başlatılıyor: {}", request.getEmail());

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                log.warn("Email adresi boş");
                throw new IllegalArgumentException("Email adresi boş olamaz");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                log.warn("Şifre boş");
                throw new IllegalArgumentException("Şifre boş olamaz");
            }

            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );
            } catch (Exception e) {
                log.warn("Kimlik doğrulama başarısız: {}", e.getMessage());
                throw new IllegalArgumentException("Email adresi veya şifre hatalı");
            }

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

            String token = jwtService.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            log.info("Kullanıcı başarıyla giriş yaptı: {}", user.getEmail());
            return response;
        } catch (IllegalArgumentException e) {
            log.warn("Giriş işlemi başarısız: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Giriş işlemi sırasında beklenmeyen hata: {}", e.getMessage(), e);
            throw new RuntimeException("Giriş işlemi sırasında bir hata oluştu");
        }
    }

    public boolean isAdmin(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }
} 