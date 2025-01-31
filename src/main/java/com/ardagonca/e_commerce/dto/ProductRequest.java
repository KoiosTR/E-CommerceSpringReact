package com.ardagonca.e_commerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Ürün adı boş olamaz")
    private String name;

    private String description;

    @NotNull(message = "Ürün fiyatı boş olamaz")
    @Positive(message = "Ürün fiyatı pozitif olmalıdır")
    private Double price;

    @NotBlank(message = "Ürün görseli boş olamaz")
    private String imageUrl;
} 