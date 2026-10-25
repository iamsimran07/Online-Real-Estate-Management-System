package com.realestate.management.service;

import com.realestate.management.model.ActivityLog;
import com.realestate.management.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void logActivity(Long userId, String userName, String role, String action, String details) {
        ActivityLog log = new ActivityLog(userId, userName, role, action, details);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}
