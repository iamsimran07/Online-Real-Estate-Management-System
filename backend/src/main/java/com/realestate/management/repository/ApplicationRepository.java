package com.realestate.management.repository;

import com.realestate.management.model.Application;
import com.realestate.management.model.ApplicationStatus;
import com.realestate.management.model.Property;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByTenantOrderByCreatedAtDesc(User tenant);

    List<Application> findByPropertyOrderByCreatedAtDesc(Property property);

    List<Application> findByPropertyManagerOrderByCreatedAtDesc(User manager);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByPropertyAndTenant(Property property, User tenant);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.property.manager = :manager")
    long countByManager(@Param("manager") User manager);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.property.manager = :manager AND a.status = :status")
    long countByManagerAndStatus(@Param("manager") User manager, @Param("status") ApplicationStatus status);
}
