package com.ardagonca.e_commerce.controller;

import com.ardagonca.e_commerce.dto.ProductRequest;
import com.ardagonca.e_commerce.model.Product;
import com.ardagonca.e_commerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class ProductController {
    private final ProductService productService;
    private static final String UPLOAD_DIR = "uploads/images";

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        log.debug("Ürün oluşturma isteği alındı: {}", request.getName());
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Uploads klasörünü oluştur
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Benzersiz dosya adı oluştur
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Dosyayı kaydet
            Files.copy(file.getInputStream(), filePath);

            // Dosya yolunu döndür
            return ResponseEntity.ok("/uploads/images/" + fileName);
        } catch (IOException e) {
            log.error("Dosya yükleme hatası: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            String fileName = product.getImageUrl().substring(product.getImageUrl().lastIndexOf("/") + 1);
            Path imagePath = Paths.get(UPLOAD_DIR, fileName);
            
            if (!Files.exists(imagePath)) {
                log.error("Resim bulunamadı: {}", imagePath);
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(imagePath);
            MediaType mediaType = MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg");

            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(imageBytes);
        } catch (Exception e) {
            log.error("Resim getirme hatası: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImageByFileName(@PathVariable String fileName) {
        try {
            Path imagePath = Paths.get(UPLOAD_DIR, fileName);
            
            if (!Files.exists(imagePath)) {
                log.error("Resim bulunamadı: {}", imagePath);
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(imagePath);
            MediaType mediaType = MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg");

            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(imageBytes);
        } catch (Exception e) {
            log.error("Resim getirme hatası: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        log.debug("Ürün güncelleme isteği alındı: {}", id);
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
} 