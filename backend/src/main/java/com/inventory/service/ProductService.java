package com.inventory.service;

import com.inventory.dto.ProductDTO;
import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        // Check if SKU already exists
        if (productRepository.findBySkuIgnoreCase(productDTO.getSku()) != null) {
            throw new RuntimeException("SKU already exists: " + productDTO.getSku());
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setSku(productDTO.getSku());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        product.setImageUrl(productDTO.getImageUrl());

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Optional<Product> existingProduct = productRepository.findById(id);
        
        if (!existingProduct.isPresent()) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        Product product = existingProduct.get();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setSku(productDTO.getSku());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        product.setImageUrl(productDTO.getImageUrl());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDTO getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (!product.isPresent()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return convertToDTO(product.get());
    }

    public List<ProductDTO> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}
