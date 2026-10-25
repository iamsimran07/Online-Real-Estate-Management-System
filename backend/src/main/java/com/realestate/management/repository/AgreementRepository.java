package com.realestate.management.repository;

import com.realestate.management.model.Agreement;
import com.realestate.management.model.AgreementStatus;
import com.realestate.management.model.Property;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Long> {

    List<Agreement> findByTenantOrderByCreatedAtDesc(User tenant);

    List<Agreement> findByManagerOrderByCreatedAtDesc(User manager);

    List<Agreement> findByPropertyOrderByCreatedAtDesc(Property property);

    List<Agreement> findByStatus(AgreementStatus status);

    long countByStatus(AgreementStatus status);

    @Query("SELECT COUNT(a) FROM Agreement a WHERE a.manager = :manager")
    long countByManager(@Param("manager") User manager);

    @Query("SELECT COUNT(a) FROM Agreement a WHERE a.manager = :manager AND a.status = :status")
    long countByManagerAndStatus(@Param("manager") User manager, @Param("status") AgreementStatus status);
}
