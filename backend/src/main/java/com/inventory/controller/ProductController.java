package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.ProductDTO;
import com.inventory.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        try {
            List<ProductDTO> products = productService.getAllProducts();
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "Error retrieving products: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Product not found: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            ProductDTO createdProduct = productService.createProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", createdProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, "Error creating product: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        try {
            ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Product not found: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Product not found: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchByName(@RequestParam String name) {
        try {
            List<ProductDTO> products = productService.searchByName(name);
            return ResponseEntity.ok(ApiResponse.success("Search results", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "Error searching products: " + e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse> getByCategory(@PathVariable String category) {
        try {
            List<ProductDTO> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Products by category retrieved", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "Error retrieving products: " + e.getMessage()));
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse> getLowStockProducts() {
        try {
            List<ProductDTO> products = productService.getLowStockProducts();
            return ResponseEntity.ok(ApiResponse.success("Low stock products retrieved", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "Error retrieving low stock products: " + e.getMessage()));
        }
    }
}
