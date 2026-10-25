package com.realestate.management.service;

import com.realestate.management.dto.PropertyDto;
import com.realestate.management.model.ListingStatus;
import com.realestate.management.model.Property;
import com.realestate.management.model.Role;
import com.realestate.management.model.User;
import com.realestate.management.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    public PropertyService(PropertyRepository propertyRepository,
                           ActivityService activityService,
                           NotificationService notificationService) {
        this.propertyRepository = propertyRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    public List<PropertyDto> getApprovedProperties() {
        return propertyRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.APPROVED)
                .stream()
                .map(PropertyDto::new)
                .collect(Collectors.toList());
    }

    public List<PropertyDto> searchProperties(String query, String city, String propertyType,
                                              BigDecimal minRent, BigDecimal maxRent, Integer bedrooms) {
        return propertyRepository.searchApprovedProperties(query, city, propertyType, minRent, maxRent, bedrooms)
                .stream()
                .map(PropertyDto::new)
                .collect(Collectors.toList());
    }

    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));
        return new PropertyDto(property);
    }

    public List<PropertyDto> getAllPropertiesForAdmin() {
        return propertyRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PropertyDto::new)
                .collect(Collectors.toList());
    }

    public List<PropertyDto> getPropertiesByManager(User manager) {
        return propertyRepository.findByManager(manager)
                .stream()
                .map(PropertyDto::new)
                .collect(Collectors.toList());
    }

    public PropertyDto createProperty(PropertyDto dto, User manager) {
        Property property = new Property(
                manager,
                dto.getTitle(),
                dto.getAddress(),
                dto.getCity() != null ? dto.getCity() : "New York",
                dto.getDescription(),
                dto.getRent(),
                dto.getBedrooms() != null ? dto.getBedrooms() : 2,
                dto.getBathrooms() != null ? dto.getBathrooms() : 2,
                dto.getAreaSqft() != null ? dto.getAreaSqft() : 1200,
                dto.getPropertyType() != null ? dto.getPropertyType() : "Apartment",
                dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()
                        ? dto.getImageUrl()
                        : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                ListingStatus.PENDING // Automatically starts as PENDING for admin approval
        );

        Property saved = propertyRepository.save(property);
        activityService.logActivity(manager.getId(), manager.getName(), manager.getRole().name(), "CREATE_PROPERTY", "Submitted property for review: " + saved.getTitle());
        return new PropertyDto(saved);
    }

    public PropertyDto updateProperty(Long id, PropertyDto dto, User user) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));

        // Check ownership if not admin
        if (user.getRole() != Role.ADMIN && !property.getManager().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only edit your own listings");
        }

        property.setTitle(dto.getTitle());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setDescription(dto.getDescription());
        property.setRent(dto.getRent());
        if (dto.getBedrooms() != null) property.setBedrooms(dto.getBedrooms());
        if (dto.getBathrooms() != null) property.setBathrooms(dto.getBathrooms());
        if (dto.getAreaSqft() != null) property.setAreaSqft(dto.getAreaSqft());
        if (dto.getPropertyType() != null) property.setPropertyType(dto.getPropertyType());
        if (dto.getImageUrl() != null) property.setImageUrl(dto.getImageUrl());

        Property updated = propertyRepository.save(property);
        activityService.logActivity(user.getId(), user.getName(), user.getRole().name(), "UPDATE_PROPERTY", "Updated property details: " + updated.getTitle());
        return new PropertyDto(updated);
    }

    public void deleteProperty(Long id, User user) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));

        if (user.getRole() != Role.ADMIN && !property.getManager().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only delete your own listings");
        }

        propertyRepository.delete(property);
        activityService.logActivity(user.getId(), user.getName(), user.getRole().name(), "DELETE_PROPERTY", "Deleted property: " + property.getTitle());
    }

    public PropertyDto updateListingStatus(Long id, ListingStatus status, User admin) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));

        property.setStatus(status);
        Property saved = propertyRepository.save(property);

        // Notify property manager
        notificationService.createNotification(
                property.getManager(),
                "Property Listing " + status.name(),
                "Your property \"" + property.getTitle() + "\" has been " + status.name().toLowerCase() + " by Admin."
        );

        activityService.logActivity(admin.getId(), admin.getName(), "ADMIN", "UPDATE_LISTING_STATUS", "Listing \"" + property.getTitle() + "\" status set to " + status.name());
        return new PropertyDto(saved);
    }
}
