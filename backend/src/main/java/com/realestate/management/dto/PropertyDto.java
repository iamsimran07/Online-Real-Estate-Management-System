package com.realestate.management.dto;

import com.realestate.management.model.ListingStatus;
import com.realestate.management.model.Property;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyDto {
    private Long id;
    private Long managerId;
    private String managerName;
    private String managerEmail;
    private String managerPhone;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String description;

    @NotNull(message = "Rent is required")
    @Positive(message = "Rent must be positive")
    private BigDecimal rent;

    private Integer bedrooms;
    private Integer bathrooms;
    private Integer areaSqft;
    private String propertyType;
    private String imageUrl;
    private ListingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PropertyDto() {}

    public PropertyDto(Property property) {
        if (property != null) {
            this.id = property.getId();
            if (property.getManager() != null) {
                this.managerId = property.getManager().getId();
                this.managerName = property.getManager().getName();
                this.managerEmail = property.getManager().getEmail();
                this.managerPhone = property.getManager().getPhone();
            }
            this.title = property.getTitle();
            this.address = property.getAddress();
            this.city = property.getCity();
            this.description = property.getDescription();
            this.rent = property.getRent();
            this.bedrooms = property.getBedrooms();
            this.bathrooms = property.getBathrooms();
            this.areaSqft = property.getAreaSqft();
            this.propertyType = property.getPropertyType();
            this.imageUrl = property.getImageUrl();
            this.status = property.getStatus();
            this.createdAt = property.getCreatedAt();
            this.updatedAt = property.getUpdatedAt();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getManagerPhone() {
        return managerPhone;
    }

    public void setManagerPhone(String managerPhone) {
        this.managerPhone = managerPhone;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getRent() {
        return rent;
    }

    public void setRent(BigDecimal rent) {
        this.rent = rent;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Integer getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(Integer areaSqft) {
        this.areaSqft = areaSqft;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
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
