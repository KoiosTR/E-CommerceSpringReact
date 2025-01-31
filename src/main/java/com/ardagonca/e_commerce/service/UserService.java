package com.ardagonca.e_commerce.service;

import com.ardagonca.e_commerce.dto.UpdateUserRequest;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));
    }

    public void updateUser(String email, UpdateUserRequest request) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Mevcut şifreyi kontrol et
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mevcut şifre yanlış");
        }

        // Email güncelleme
        if (request.getEmail() != null && !request.getEmail().equals(email)) {
            if (repository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Bu email adresi zaten kullanımda");
            }
            user.setEmail(request.getEmail());
        }

        // Şifre güncelleme
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        repository.save(user);
    }
} 