package com.realestate.management.controller;

import com.realestate.management.dto.DashboardStatsDto;
import com.realestate.management.model.User;
import com.realestate.management.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getAdminAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('PROPERTY_MANAGER')")
    public ResponseEntity<DashboardStatsDto> getManagerAnalytics(@AuthenticationPrincipal User manager) {
        return ResponseEntity.ok(analyticsService.getManagerAnalytics(manager));
    }
}
