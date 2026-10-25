package com.realestate.management.service;

import com.realestate.management.dto.DashboardStatsDto;
import com.realestate.management.model.*;
import com.realestate.management.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ApplicationRepository applicationRepository;
    private final AgreementRepository agreementRepository;
    private final ActivityService activityService;

    public AnalyticsService(UserRepository userRepository,
                            PropertyRepository propertyRepository,
                            ApplicationRepository applicationRepository,
                            AgreementRepository agreementRepository,
                            ActivityService activityService) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.applicationRepository = applicationRepository;
        this.agreementRepository = agreementRepository;
        this.activityService = activityService;
    }

    public DashboardStatsDto getAdminAnalytics() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalAdmins(userRepository.countByRole(Role.ADMIN));
        stats.setTotalManagers(userRepository.countByRole(Role.PROPERTY_MANAGER));
        stats.setTotalTenants(userRepository.countByRole(Role.TENANT));

        stats.setTotalProperties(propertyRepository.count());
        stats.setApprovedProperties(propertyRepository.countByStatus(ListingStatus.APPROVED));
        stats.setPendingProperties(propertyRepository.countByStatus(ListingStatus.PENDING));
        stats.setRejectedProperties(propertyRepository.countByStatus(ListingStatus.REJECTED));

        stats.setTotalApplications(applicationRepository.count());
        stats.setPendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING));
        stats.setApprovedApplications(applicationRepository.countByStatus(ApplicationStatus.APPROVED));

        stats.setTotalAgreements(agreementRepository.count());
        stats.setActiveAgreements(agreementRepository.countByStatus(AgreementStatus.ACTIVE));

        // Calculate rental volume
        BigDecimal totalVolume = agreementRepository.findByStatus(AgreementStatus.ACTIVE)
                .stream()
                .map(Agreement::getMonthlyRent)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthlyRentalVolume(totalVolume);

        // Property type distribution
        Map<String, Integer> typeCounts = new HashMap<>();
        for (Property p : propertyRepository.findAll()) {
            String type = p.getPropertyType() != null ? p.getPropertyType() : "Other";
            typeCounts.put(type, typeCounts.getOrDefault(type, 0) + 1);
        }
        List<Map<String, Object>> typeList = new ArrayList<>();
        typeCounts.forEach((k, v) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", k);
            map.put("value", v);
            typeList.add(map);
        });
        stats.setPropertyTypeDistribution(typeList);

        // Revenue trends simulation for Recharts
        List<Map<String, Object>> revenueTrends = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"};
        int baseVal = 18000;
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("revenue", baseVal + (i * 2400) + (i % 2 == 0 ? 1200 : -500));
            point.put("target", 20000 + (i * 2000));
            revenueTrends.add(point);
        }
        stats.setMonthlyRevenueTrends(revenueTrends);

        // Application trends
        List<Map<String, Object>> appTrends = new ArrayList<>();
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("applications", 12 + (i * 3) + (i % 3));
            point.put("approved", 8 + (i * 2));
            appTrends.add(point);
        }
        stats.setApplicationTrends(appTrends);

        stats.setRecentActivities(activityService.getRecentActivities());
        return stats;
    }

    public DashboardStatsDto getManagerAnalytics(User manager) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Property> managerProps = propertyRepository.findByManager(manager);
        stats.setTotalProperties(managerProps.size());
        stats.setApprovedProperties(managerProps.stream().filter(p -> p.getStatus() == ListingStatus.APPROVED).count());
        stats.setPendingProperties(managerProps.stream().filter(p -> p.getStatus() == ListingStatus.PENDING).count());
        stats.setRejectedProperties(managerProps.stream().filter(p -> p.getStatus() == ListingStatus.REJECTED).count());

        List<Agreement> agreements = agreementRepository.findByManagerOrderByCreatedAtDesc(manager);
        stats.setTotalAgreements(agreements.size());
        stats.setActiveAgreements(agreements.stream().filter(a -> a.getStatus() == AgreementStatus.ACTIVE).count());

        stats.setTotalApplications(applicationRepository.countByManager(manager));
        stats.setPendingApplications(applicationRepository.countByManagerAndStatus(manager, ApplicationStatus.PENDING));
        stats.setApprovedApplications(applicationRepository.countByManagerAndStatus(manager, ApplicationStatus.APPROVED));

        BigDecimal monthlyRevenue = agreements.stream()
                .filter(a -> a.getStatus() == AgreementStatus.ACTIVE)
                .map(Agreement::getMonthlyRent)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthlyRentalVolume(monthlyRevenue);

        // Property type distribution for manager
        Map<String, Integer> typeCounts = new HashMap<>();
        for (Property p : managerProps) {
            String type = p.getPropertyType() != null ? p.getPropertyType() : "Other";
            typeCounts.put(type, typeCounts.getOrDefault(type, 0) + 1);
        }
        List<Map<String, Object>> typeList = new ArrayList<>();
        typeCounts.forEach((k, v) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", k);
            map.put("value", v);
            typeList.add(map);
        });
        stats.setPropertyTypeDistribution(typeList);

        // Performance trends
        List<Map<String, Object>> revenueTrends = new ArrayList<>();
        String[] months = {"May", "Jun", "Jul", "Aug", "Sep", "Oct"};
        double base = monthlyRevenue.doubleValue() > 0 ? monthlyRevenue.doubleValue() * 0.7 : 7500.0;
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("revenue", (int)(base + (i * 900)));
            point.put("occupancyRate", Math.min(98, 75 + (i * 4)));
            revenueTrends.add(point);
        }
        stats.setMonthlyRevenueTrends(revenueTrends);

        stats.setRecentActivities(activityService.getRecentActivities());
        return stats;
    }
}
