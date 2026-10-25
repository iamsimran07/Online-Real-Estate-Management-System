package com.realestate.management.controller;

import com.realestate.management.dto.ApplicationDto;
import com.realestate.management.model.ApplicationStatus;
import com.realestate.management.model.User;
import com.realestate.management.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Tenant: view own applications
    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<ApplicationDto>> getTenantApplications(@AuthenticationPrincipal User tenant) {
        return ResponseEntity.ok(applicationService.getTenantApplications(tenant));
    }

    // Tenant: submit rental application
    @PostMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<ApplicationDto> submitApplication(@RequestBody ApplicationDto dto,
                                                            @AuthenticationPrincipal User tenant) {
        return ResponseEntity.ok(applicationService.submitApplication(dto, tenant));
    }

    // Manager: view applications for their properties
    @GetMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<List<ApplicationDto>> getManagerApplications(@AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(applicationService.getManagerApplications(manager));
    }

    // Manager: approve or reject application
    @PatchMapping("/manager/{id}/status")
    @PreAuthorize("hasAnyRole('PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(@PathVariable Long id,
                                                                 @RequestBody Map<String, String> body,
                                                                 @AuthenticationPrincipal User user) {
        ApplicationStatus status = ApplicationStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, user));
    }

    // Admin: overview
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getAllApplicationsAdmin() {
        return ResponseEntity.ok(applicationService.getAllApplicationsForAdmin());
    }
}
