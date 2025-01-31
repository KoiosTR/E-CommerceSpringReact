package com.ardagonca.e_commerce.repository;

import com.ardagonca.e_commerce.model.Cart;
import com.ardagonca.e_commerce.model.CartItem;
import com.ardagonca.e_commerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
} 