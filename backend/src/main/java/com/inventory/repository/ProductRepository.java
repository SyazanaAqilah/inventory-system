package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findBySkuIgnoreCase(String sku);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.quantity < 10")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.category = :category ORDER BY p.price DESC")
    List<Product> findByCategoryOrderByPriceDesc(String category);
}
