package com.ardagonca.e_commerce.config;

import com.ardagonca.e_commerce.model.Role;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        logger.info("DataInitializer başlatılıyor...");
        try {
            boolean adminExists = userRepository.existsByEmail("admin@example.com");
            if (!adminExists) {
                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("User") 
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                logger.info("Admin kullanıcısı oluşturuldu");
            } else {
                logger.info("Admin kullanıcısı zaten mevcut");
            }
            logger.info("Uygulama başarıyla başlatıldı");
            logger.info("Backend API http://localhost:8080 adresinde çalışıyor");
            logger.info("Frontend http://localhost:5173 adresinde çalışıyor");
        } catch (Exception e) {
            logger.error("Başlatma sırasında hata: ", e);
        }
    }
} 