package com.realestate.management.service;

import com.realestate.management.dto.AgreementDto;
import com.realestate.management.model.*;
import com.realestate.management.repository.AgreementRepository;
import com.realestate.management.repository.PropertyRepository;
import com.realestate.management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgreementService {

    private final AgreementRepository agreementRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    public AgreementService(AgreementRepository agreementRepository,
                            PropertyRepository propertyRepository,
                            UserRepository userRepository,
                            ActivityService activityService,
                            NotificationService notificationService) {
        this.agreementRepository = agreementRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    public List<AgreementDto> getTenantAgreements(User tenant) {
        return agreementRepository.findByTenantOrderByCreatedAtDesc(tenant)
                .stream()
                .map(AgreementDto::new)
                .collect(Collectors.toList());
    }

    public List<AgreementDto> getManagerAgreements(User manager) {
        return agreementRepository.findByManagerOrderByCreatedAtDesc(manager)
                .stream()
                .map(AgreementDto::new)
                .collect(Collectors.toList());
    }

    public List<AgreementDto> getAllAgreementsForAdmin() {
        return agreementRepository.findAll()
                .stream()
                .map(AgreementDto::new)
                .collect(Collectors.toList());
    }

    public AgreementDto createAgreement(AgreementDto dto, User manager) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + dto.getPropertyId()));

        User tenant = userRepository.findById(dto.getTenantId())
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with id: " + dto.getTenantId()));

        Agreement agreement = new Agreement(
                property,
                tenant,
                manager,
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getMonthlyRent() != null ? dto.getMonthlyRent() : property.getRent(),
                dto.getDepositAmount(),
                dto.getTerms(),
                dto.getStatus() != null ? dto.getStatus() : AgreementStatus.ACTIVE
        );

        Agreement saved = agreementRepository.save(agreement);

        notificationService.createNotification(
                tenant,
                "New Rental Agreement Created",
                "A lease agreement for \"" + property.getTitle() + "\" has been prepared by " + manager.getName() + "."
        );

        activityService.logActivity(manager.getId(), manager.getName(), manager.getRole().name(), "CREATE_AGREEMENT", "Created lease agreement #" + saved.getId() + " for " + tenant.getName());
        return new AgreementDto(saved);
    }

    public AgreementDto updateAgreementStatus(Long agreementId, AgreementStatus status, User user) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found with id: " + agreementId));

        if (user.getRole() != Role.ADMIN &&
            (agreement.getManager() != null && !agreement.getManager().getId().equals(user.getId())) &&
            !agreement.getTenant().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this agreement");
        }

        agreement.setStatus(status);
        Agreement saved = agreementRepository.save(agreement);

        // Notify other party
        User recipient = user.getId().equals(agreement.getTenant().getId()) ? agreement.getManager() : agreement.getTenant();
        if (recipient != null) {
            notificationService.createNotification(
                    recipient,
                    "Agreement Status Updated",
                    "Agreement #" + saved.getId() + " for \"" + agreement.getProperty().getTitle() + "\" is now " + status.name() + "."
            );
        }

        activityService.logActivity(user.getId(), user.getName(), user.getRole().name(), "UPDATE_AGREEMENT", "Agreement #" + saved.getId() + " set to " + status.name());
        return new AgreementDto(saved);
    }
}
