package com.ardagonca.e_commerce.service;

import com.ardagonca.e_commerce.model.Cart;
import com.ardagonca.e_commerce.model.CartItem;
import com.ardagonca.e_commerce.model.Product;
import com.ardagonca.e_commerce.model.User;
import com.ardagonca.e_commerce.repository.CartItemRepository;
import com.ardagonca.e_commerce.repository.CartRepository;
import com.ardagonca.e_commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart getOrCreateCart(User user) {
        log.debug("Kullanıcı için sepet getiriliyor: {}", user.getEmail());
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    log.debug("Yeni sepet oluşturuluyor: {}", user.getEmail());
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .totalPrice(0.0)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public CartItem addToCart(User user, Long productId, Integer quantity) {
        log.debug("Sepete ürün ekleniyor: {} - {} adet", productId, quantity);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı"));

        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (existingItem != null) {
            log.debug("Mevcut ürün güncelleniyor: {}", existingItem.getId());
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.updatePrices();
            cart.calculateTotalPrice();
            cartRepository.save(cart);
            return existingItem;
        }

        log.debug("Yeni ürün ekleniyor");
        CartItem newItem = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(quantity)
                .build();
        newItem.updatePrices();
        cart.addItem(newItem);
        cartRepository.save(cart);
        return newItem;
    }

    @Transactional
    public void removeFromCart(User user, Long productId) {
        log.debug("Sepetten ürün çıkarılıyor: {}", productId);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı"));

        CartItem itemToRemove = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new IllegalArgumentException("Ürün sepette bulunamadı"));

        cart.removeItem(itemToRemove);
        cartRepository.save(cart);
        log.debug("Ürün sepetten çıkarıldı: {}", productId);
    }

    @Transactional
    public void updateQuantity(User user, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Miktar 0'dan büyük olmalıdır");
        }

        log.debug("Ürün miktarı güncelleniyor: {} - {} adet", productId, quantity);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new IllegalArgumentException("Ürün sepette bulunamadı"));

        item.setQuantity(quantity);
        item.updatePrices();
        cart.calculateTotalPrice();
        cartRepository.save(cart);
        log.debug("Ürün miktarı güncellendi: {}", productId);
    }

    @Transactional
    public Cart getCart(User user) {
        try {
            log.debug("Sepet getiriliyor. User: {}", user.getEmail());
            Cart cart = cartRepository.findByUserWithItems(user)
                    .orElseGet(() -> {
                        log.debug("Kullanıcı için sepet bulunamadı, yeni sepet oluşturuluyor");
                        Cart newCart = Cart.builder()
                                .user(user)
                                .items(new ArrayList<>())
                                .totalPrice(0.0)
                                .build();
                        return cartRepository.save(newCart);
                    });

            // Sepetteki ürünlerin fiyatlarını güncelle
            if (cart.getItems() != null) {
                boolean priceUpdated = false;
                for (CartItem item : cart.getItems()) {
                    Product product = item.getProduct();
                    if (item.getUnitPrice() != product.getPrice()) {
                        log.debug("Ürün fiyatı güncelleniyor - Ürün: {}, Eski Fiyat: {}, Yeni Fiyat: {}", 
                            product.getId(), item.getUnitPrice(), product.getPrice());
                        item.setUnitPrice(product.getPrice());
                        item.updatePrices();
                        priceUpdated = true;
                    }
                }
                if (priceUpdated) {
                    cart.calculateTotalPrice();
                    cart = cartRepository.save(cart);
                    log.debug("Sepet fiyatları güncellendi. Yeni toplam: {}", cart.getTotalPrice());
                }
            }

            log.debug("Sepet bulundu. ID: {}, Toplam Fiyat: {}", cart.getId(), cart.getTotalPrice());
            if (cart.getItems() != null) {
                log.debug("Sepetteki ürünler:");
                cart.getItems().forEach(item -> {
                    log.debug("Ürün - ID: {}, İsim: {}, Miktar: {}, Birim Fiyat: {}, Toplam: {}",
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getTotalPrice());
                });
            } else {
                log.warn("Sepet items listesi null!");
            }
            return cart;
        } catch (Exception e) {
            log.error("Sepet getirilirken hata oluştu: {}", e.getMessage(), e);
            throw e;
        }
    }
} 