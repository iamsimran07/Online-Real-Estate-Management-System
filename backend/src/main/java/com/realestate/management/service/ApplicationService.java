package com.realestate.management.service;

import com.realestate.management.dto.ApplicationDto;
import com.realestate.management.model.*;
import com.realestate.management.repository.ApplicationRepository;
import com.realestate.management.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PropertyRepository propertyRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              PropertyRepository propertyRepository,
                              ActivityService activityService,
                              NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.propertyRepository = propertyRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    public List<ApplicationDto> getTenantApplications(User tenant) {
        return applicationRepository.findByTenantOrderByCreatedAtDesc(tenant)
                .stream()
                .map(ApplicationDto::new)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getManagerApplications(User manager) {
        return applicationRepository.findByPropertyManagerOrderByCreatedAtDesc(manager)
                .stream()
                .map(ApplicationDto::new)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplicationsForAdmin() {
        return applicationRepository.findAll()
                .stream()
                .map(ApplicationDto::new)
                .collect(Collectors.toList());
    }

    public ApplicationDto submitApplication(ApplicationDto dto, User tenant) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + dto.getPropertyId()));

        if (property.getStatus() != ListingStatus.APPROVED) {
            throw new IllegalStateException("You can only apply to approved properties");
        }

        // Check if application already exists
        if (applicationRepository.findByPropertyAndTenant(property, tenant).isPresent()) {
            throw new IllegalStateException("You have already submitted an application for this property");
        }

        Application application = new Application(
                property,
                tenant,
                ApplicationStatus.PENDING,
                dto.getNotes(),
                dto.getMoveInDate(),
                dto.getEmploymentInfo()
        );

        Application saved = applicationRepository.save(application);

        // Notify property manager
        notificationService.createNotification(
                property.getManager(),
                "New Rental Application",
                tenant.getName() + " applied for your listing \"" + property.getTitle() + "\"."
        );

        activityService.logActivity(tenant.getId(), tenant.getName(), "TENANT", "SUBMIT_APPLICATION", "Submitted application for: " + property.getTitle());
        return new ApplicationDto(saved);
    }

    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status, User manager) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + applicationId));

        // Check manager authorization if not admin
        if (manager.getRole() != Role.ADMIN && !application.getProperty().getManager().getId().equals(manager.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this application");
        }

        application.setStatus(status);
        Application saved = applicationRepository.save(application);

        // Notify tenant
        notificationService.createNotification(
                application.getTenant(),
                "Application " + status.name(),
                "Your application for \"" + application.getProperty().getTitle() + "\" was " + status.name().toLowerCase() + "."
        );

        activityService.logActivity(manager.getId(), manager.getName(), manager.getRole().name(), "UPDATE_APPLICATION_STATUS", "Set application #" + saved.getId() + " status to " + status.name());
        return new ApplicationDto(saved);
    }
}
