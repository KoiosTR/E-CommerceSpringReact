package com.ardagonca.e_commerce.controller;

import com.ardagonca.e_commerce.dto.CartResponse;
import com.ardagonca.e_commerce.model.Cart;
import com.ardagonca.e_commerce.model.CartItem;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {
    private final CartService cartService;
    private static final Logger log = LoggerFactory.getLogger(CartController.class);

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal(errorOnInvalidType = false) User user) {
        log.debug("Gelen user: {}", user != null ? user.getEmail() : "null");
        try {
            if (user == null) {
                log.debug("Anonim kullanıcı için boş sepet döndürülüyor");
                return ResponseEntity.ok(CartResponse.builder()
                        .totalPrice(0.0)
                        .items(new ArrayList<>())
                        .build());
            }
            Cart cart = cartService.getCart(user);
            log.debug("Bulunan sepet: ID: {}, Ürün sayısı: {}", cart.getId(), cart.getItems().size());
            return ResponseEntity.ok(CartResponse.fromCart(cart));
        } catch (Exception e) {
            log.error("Sepet getirme hatası: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        cartService.removeFromCart(user, productId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<Void> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        cartService.updateQuantity(user, productId, quantity);
        return ResponseEntity.ok().build();
    }
} 