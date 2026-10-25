package com.realestate.management.controller;

import com.realestate.management.dto.AgreementDto;
import com.realestate.management.model.AgreementStatus;
import com.realestate.management.model.User;
import com.realestate.management.service.AgreementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agreements")
public class AgreementController {

    private final AgreementService agreementService;

    public AgreementController(AgreementService agreementService) {
        this.agreementService = agreementService;
    }

    // Tenant: view agreements
    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<AgreementDto>> getTenantAgreements(@AuthenticationPrincipal User tenant) {
        return ResponseEntity.ok(agreementService.getTenantAgreements(tenant));
    }

    // Manager: view agreements
    @GetMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<List<AgreementDto>> getManagerAgreements(@AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(agreementService.getManagerAgreements(manager));
    }

    // Manager: create agreement
    @PostMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<AgreementDto> createAgreement(@RequestBody AgreementDto dto,
                                                        @AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(agreementService.createAgreement(dto, manager));
    }

    // Update status (e.g., ACTIVE, TERMINATED, COMPLETED)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PROPERTY_MANAGER', 'TENANT', 'ADMIN')")
    public ResponseEntity<AgreementDto> updateAgreementStatus(@PathVariable Long id,
                                                              @RequestBody Map<String, String> body,
                                                              @AuthenticationPrincipal User user) {
        AgreementStatus status = AgreementStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(agreementService.updateAgreementStatus(id, status, user));
    }

    // Admin: overview
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AgreementDto>> getAllAgreementsAdmin() {
        return ResponseEntity.ok(agreementService.getAllAgreementsForAdmin());
    }
}
