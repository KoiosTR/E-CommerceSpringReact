package com.ardagonca.e_commerce.service;

import com.ardagonca.e_commerce.dto.ProductRequest;
import com.ardagonca.e_commerce.model.Product;
import com.ardagonca.e_commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;

    @Transactional
    public Product createProduct(ProductRequest request) {
        log.debug("Yeni ürün oluşturuluyor: {}", request.getName());
        
        var product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .build();
        
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        log.debug("Ürün güncelleniyor: {}", id);
        
        var product = getProductById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + id));
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.debug("Ürün siliniyor: {}", id);
        productRepository.deleteById(id);
    }
} 