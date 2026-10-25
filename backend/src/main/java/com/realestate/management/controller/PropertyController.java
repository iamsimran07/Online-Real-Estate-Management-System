package com.realestate.management.controller;

import com.realestate.management.dto.PropertyDto;
import com.realestate.management.model.ListingStatus;
import com.realestate.management.model.User;
import com.realestate.management.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Public property search
    @GetMapping("/public")
    public ResponseEntity<List<PropertyDto>> searchProperties(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) Integer bedrooms) {
        return ResponseEntity.ok(propertyService.searchProperties(query, city, propertyType, minRent, maxRent, bedrooms));
    }

    // Public property details
    @GetMapping("/public/{id}")
    public ResponseEntity<PropertyDto> getPropertyPublic(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    // Manager: get own properties
    @GetMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<List<PropertyDto>> getManagerProperties(@AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(propertyService.getPropertiesByManager(manager));
    }

    // Manager: create property
    @PostMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyDto propertyDto,
                                                      @AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(propertyService.createProperty(propertyDto, manager));
    }

    // Manager: update own property
    @PutMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<PropertyDto> updateProperty(@PathVariable Long id,
                                                      @Valid @RequestBody PropertyDto propertyDto,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(propertyService.updateProperty(id, propertyDto, user));
    }

    // Manager: delete own property
    @DeleteMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id, @AuthenticationPrincipal User user) {
        propertyService.deleteProperty(id, user);
        return ResponseEntity.noContent().build();
    }

    // Admin: get all listings
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PropertyDto>> getAllPropertiesAdmin() {
        return ResponseEntity.ok(propertyService.getAllPropertiesForAdmin());
    }

    // Admin: approve or reject listing
    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDto> updateListingStatus(@PathVariable Long id,
                                                          @RequestBody Map<String, String> statusBody,
                                                          @AuthenticationPrincipal User admin) {
        ListingStatus status = ListingStatus.valueOf(statusBody.get("status").toUpperCase());
        return ResponseEntity.ok(propertyService.updateListingStatus(id, status, admin));
    }
}
