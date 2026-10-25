package com.realestate.management.dto;

import com.realestate.management.model.ActivityLog;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalAdmins;
    private long totalManagers;
    private long totalTenants;

    private long totalProperties;
    private long approvedProperties;
    private long pendingProperties;
    private long rejectedProperties;

    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;

    private long totalAgreements;
    private long activeAgreements;
    private BigDecimal monthlyRentalVolume;

    private List<Map<String, Object>> propertyTypeDistribution;
    private List<Map<String, Object>> monthlyRevenueTrends;
    private List<Map<String, Object>> applicationTrends;
    private List<ActivityLog> recentActivities;

    public DashboardStatsDto() {}

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public long getTotalTenants() {
        return totalTenants;
    }

    public void setTotalTenants(long totalTenants) {
        this.totalTenants = totalTenants;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getApprovedProperties() {
        return approvedProperties;
    }

    public void setApprovedProperties(long approvedProperties) {
        this.approvedProperties = approvedProperties;
    }

    public long getPendingProperties() {
        return pendingProperties;
    }

    public void setPendingProperties(long pendingProperties) {
        this.pendingProperties = pendingProperties;
    }

    public long getRejectedProperties() {
        return rejectedProperties;
    }

    public void setRejectedProperties(long rejectedProperties) {
        this.rejectedProperties = rejectedProperties;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getTotalAgreements() {
        return totalAgreements;
    }

    public void setTotalAgreements(long totalAgreements) {
        this.totalAgreements = totalAgreements;
    }

    public long getActiveAgreements() {
        return activeAgreements;
    }

    public void setActiveAgreements(long activeAgreements) {
        this.activeAgreements = activeAgreements;
    }

    public BigDecimal getMonthlyRentalVolume() {
        return monthlyRentalVolume;
    }

    public void setMonthlyRentalVolume(BigDecimal monthlyRentalVolume) {
        this.monthlyRentalVolume = monthlyRentalVolume;
    }

    public List<Map<String, Object>> getPropertyTypeDistribution() {
        return propertyTypeDistribution;
    }

    public void setPropertyTypeDistribution(List<Map<String, Object>> propertyTypeDistribution) {
        this.propertyTypeDistribution = propertyTypeDistribution;
    }

    public List<Map<String, Object>> getMonthlyRevenueTrends() {
        return monthlyRevenueTrends;
    }

    public void setMonthlyRevenueTrends(List<Map<String, Object>> monthlyRevenueTrends) {
        this.monthlyRevenueTrends = monthlyRevenueTrends;
    }

    public List<Map<String, Object>> getApplicationTrends() {
        return applicationTrends;
    }

    public void setApplicationTrends(List<Map<String, Object>> applicationTrends) {
        this.applicationTrends = applicationTrends;
    }

    public List<ActivityLog> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityLog> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
