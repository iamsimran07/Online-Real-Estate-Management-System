package com.realestate.management.dto;

import com.realestate.management.model.Application;
import com.realestate.management.model.ApplicationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyAddress;
    private String propertyCity;
    private BigDecimal propertyRent;
    private String propertyImageUrl;

    private Long tenantId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;

    private Long managerId;
    private String managerName;

    private ApplicationStatus status;
    private String notes;
    private LocalDate moveInDate;
    private String employmentInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApplicationDto() {}

    public ApplicationDto(Application app) {
        if (app != null) {
            this.id = app.getId();
            if (app.getProperty() != null) {
                this.propertyId = app.getProperty().getId();
                this.propertyTitle = app.getProperty().getTitle();
                this.propertyAddress = app.getProperty().getAddress();
                this.propertyCity = app.getProperty().getCity();
                this.propertyRent = app.getProperty().getRent();
                this.propertyImageUrl = app.getProperty().getImageUrl();
                if (app.getProperty().getManager() != null) {
                    this.managerId = app.getProperty().getManager().getId();
                    this.managerName = app.getProperty().getManager().getName();
                }
            }
            if (app.getTenant() != null) {
                this.tenantId = app.getTenant().getId();
                this.tenantName = app.getTenant().getName();
                this.tenantEmail = app.getTenant().getEmail();
                this.tenantPhone = app.getTenant().getPhone();
            }
            this.status = app.getStatus();
            this.notes = app.getNotes();
            this.moveInDate = app.getMoveInDate();
            this.employmentInfo = app.getEmploymentInfo();
            this.createdAt = app.getCreatedAt();
            this.updatedAt = app.getUpdatedAt();
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

    public String getPropertyCity() {
        return propertyCity;
    }

    public void setPropertyCity(String propertyCity) {
        this.propertyCity = propertyCity;
    }

    public BigDecimal getPropertyRent() {
        return propertyRent;
    }

    public void setPropertyRent(BigDecimal propertyRent) {
        this.propertyRent = propertyRent;
    }

    public String getPropertyImageUrl() {
        return propertyImageUrl;
    }

    public void setPropertyImageUrl(String propertyImageUrl) {
        this.propertyImageUrl = propertyImageUrl;
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

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getMoveInDate() {
        return moveInDate;
    }

    public void setMoveInDate(LocalDate moveInDate) {
        this.moveInDate = moveInDate;
    }

    public String getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(String employmentInfo) {
        this.employmentInfo = employmentInfo;
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
