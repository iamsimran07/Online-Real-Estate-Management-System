package com.realestate.management.dto;

import com.realestate.management.model.Agreement;
import com.realestate.management.model.AgreementStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AgreementDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyAddress;

    private Long tenantId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;

    private Long managerId;
    private String managerName;
    private String managerEmail;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private BigDecimal depositAmount;
    private String terms;
    private AgreementStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AgreementDto() {}

    public AgreementDto(Agreement ag) {
        if (ag != null) {
            this.id = ag.getId();
            if (ag.getProperty() != null) {
                this.propertyId = ag.getProperty().getId();
                this.propertyTitle = ag.getProperty().getTitle();
                this.propertyAddress = ag.getProperty().getAddress();
            }
            if (ag.getTenant() != null) {
                this.tenantId = ag.getTenant().getId();
                this.tenantName = ag.getTenant().getName();
                this.tenantEmail = ag.getTenant().getEmail();
                this.tenantPhone = ag.getTenant().getPhone();
            }
            if (ag.getManager() != null) {
                this.managerId = ag.getManager().getId();
                this.managerName = ag.getManager().getName();
                this.managerEmail = ag.getManager().getEmail();
            }
            this.startDate = ag.getStartDate();
            this.endDate = ag.getEndDate();
            this.monthlyRent = ag.getMonthlyRent();
            this.depositAmount = ag.getDepositAmount();
            this.terms = ag.getTerms();
            this.status = ag.getStatus();
            this.createdAt = ag.getCreatedAt();
            this.updatedAt = ag.getUpdatedAt();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getPropertyAddress() {
        return propertyAddress;
    }

    public void setPropertyAddress(String propertyAddress) {
        this.propertyAddress = propertyAddress;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public String getTenantEmail() {
        return tenantEmail;
    }

    public void setTenantEmail(String tenantEmail) {
        this.tenantEmail = tenantEmail;
    }

    public String getTenantPhone() {
        return tenantPhone;
    }

    public void setTenantPhone(String tenantPhone) {
        this.tenantPhone = tenantPhone;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getManagerEmail() {
        return managerEmail;
    }

    public void setManagerEmail(String managerEmail) {
        this.managerEmail = managerEmail;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getTerms() {
        return terms;
    }

    public void setTerms(String terms) {
        this.terms = terms;
    }

    public AgreementStatus getStatus() {
        return status;
    }

    public void setStatus(AgreementStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
