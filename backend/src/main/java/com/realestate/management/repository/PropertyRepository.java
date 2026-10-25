package com.realestate.management.repository;

import com.realestate.management.model.ListingStatus;
import com.realestate.management.model.Property;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByManager(User manager);

    List<Property> findByStatus(ListingStatus status);

    List<Property> findByStatusOrderByCreatedAtDesc(ListingStatus status);

    List<Property> findAllByOrderByCreatedAtDesc();

    long countByStatus(ListingStatus status);

    @Query("SELECT p FROM Property p WHERE p.status = 'APPROVED' AND " +
           "(:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(p.city) = LOWER(:city)) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
           "(:minRent IS NULL OR p.rent >= :minRent) AND " +
           "(:maxRent IS NULL OR p.rent <= :maxRent) AND " +
           "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) " +
           "ORDER BY p.createdAt DESC")
    List<Property> searchApprovedProperties(
            @Param("query") String query,
            @Param("city") String city,
            @Param("propertyType") String propertyType,
            @Param("minRent") BigDecimal minRent,
            @Param("maxRent") BigDecimal maxRent,
            @Param("bedrooms") Integer bedrooms
    );
}
