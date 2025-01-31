package com.ardagonca.e_commerce.dto;

import com.ardagonca.e_commerce.model.Cart;
import com.ardagonca.e_commerce.model.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private Double totalPrice;

    public static CartResponse fromCart(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .items(cart.getItems().stream()
                        .map(CartItemResponse::fromCartItem)
                        .collect(Collectors.toList()))
                .totalPrice(cart.getTotalPrice())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Double price;
        private Integer quantity;
        private Double totalPrice;

        public static CartItemResponse fromCartItem(CartItem item) {
            return CartItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .price(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .totalPrice(item.getProduct().getPrice() * item.getQuantity())
                    .build();
        }
    }
} 