package com.ardagonca.e_commerce.controller;

import com.ardagonca.e_commerce.dto.UpdateUserRequest;
import com.ardagonca.e_commerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(Authentication authentication, @RequestBody UpdateUserRequest request) {
        try {
            userService.updateUser(authentication.getName(), request);
            return ResponseEntity.ok().body(new MessageResponse("Kullanıcı bilgileri başarıyla güncellendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
} 