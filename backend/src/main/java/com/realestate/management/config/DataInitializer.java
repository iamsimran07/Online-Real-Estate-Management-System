package com.realestate.management.config;

import com.realestate.management.model.*;
import com.realestate.management.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${app.seed.admin-password:}")
    private String adminPassword;

    @Value("${app.seed.manager-password:}")
    private String managerPassword;

    @Value("${app.seed.tenant-password:}")
    private String tenantPassword;

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ApplicationRepository applicationRepository;
    private final AgreementRepository agreementRepository;
    private final MessageRepository messageRepository;
    private final SettingRepository settingRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PropertyRepository propertyRepository,
                           ApplicationRepository applicationRepository,
                           AgreementRepository agreementRepository,
                           MessageRepository messageRepository,
                           SettingRepository settingRepository,
                           NotificationRepository notificationRepository,
                           ActivityLogRepository activityLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.applicationRepository = applicationRepository;
        this.agreementRepository = agreementRepository;
        this.messageRepository = messageRepository;
        this.settingRepository = settingRepository;
        this.notificationRepository = notificationRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Seed data already present
        }

        System.out.println(">>> Initializing seed data for Online Real Estate Management System...");

        String resolvedAdminPassword = (adminPassword != null && !adminPassword.trim().isEmpty())
                ? adminPassword
                : "admin123";
        String resolvedManagerPassword = (managerPassword != null && !managerPassword.trim().isEmpty())
                ? managerPassword
                : "manager123";
        String resolvedTenantPassword = (tenantPassword != null && !tenantPassword.trim().isEmpty())
                ? tenantPassword
                : "tenant123";

        // 1. Seed Users (1 Admin, 1 Manager, 1 Tenant as required, plus secondary users)
        User admin = new User(
                "Alexander Wright",
                "admin@realestate.com",
                passwordEncoder.encode(resolvedAdminPassword),
                Role.ADMIN,
                "+1 (555) 019-2834",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(admin);

        User manager = new User(
                "Sarah Jenkins",
                "manager@realestate.com",
                passwordEncoder.encode(resolvedManagerPassword),
                Role.PROPERTY_MANAGER,
                "+1 (555) 384-9102",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(manager);

        User tenant = new User(
                "David Miller",
                "tenant@realestate.com",
                passwordEncoder.encode(resolvedTenantPassword),
                Role.TENANT,
                "+1 (555) 782-4419",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(tenant);

        User tenant2 = new User(
                "Emma Watson",
                "emma.tenant@realestate.com",
                passwordEncoder.encode(resolvedTenantPassword),
                Role.TENANT,
                "+1 (555) 902-3311",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(tenant2);

        // 2. Seed Sample Properties
        Property p1 = new Property(
                manager,
                "The Grand Azure Luxury Penthouse",
                "742 Evergreen Terrace, Hudson Yards",
                "New York",
                "Spectacular 360-degree city skyline panoramas, Italian marble bathrooms, custom Poliform chef kitchen, and private rooftop garden terrace.",
                new BigDecimal("4850.00"),
                3, 3, 2400,
                "Penthouse",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.APPROVED
        );
        propertyRepository.save(p1);

        Property p2 = new Property(
                manager,
                "Midtown Modern Studio Loft",
                "120 E 34th Street, Murray Hill",
                "New York",
                "Contemporary sun-drenched industrial loft featuring 14ft high timber-beamed ceilings, exposed polished brick, smart climate control, and Bosch appliances.",
                new BigDecimal("2400.00"),
                1, 1, 850,
                "Studio",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.APPROVED
        );
        propertyRepository.save(p2);

        Property p3 = new Property(
                manager,
                "Coastal Palms Beachfront Villa",
                "450 Ocean Drive, South Beach",
                "Miami",
                "Ultra-luxury private sanctuary right on the sandy coastline. Features infinity salt pool, private dock, hurricane impact glass, and smart home automation.",
                new BigDecimal("6200.00"),
                4, 4, 3800,
                "Villa",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.APPROVED
        );
        propertyRepository.save(p3);

        Property p4 = new Property(
                manager,
                "Pacific Heights Historic Townhome",
                "2104 Broadway St, Pacific Heights",
                "San Francisco",
                "Elegantly restored Victorian residence blending classic architectural moldings with bespoke Scandinavian minimalism, gas fireplace, and wine cellar.",
                new BigDecimal("5300.00"),
                3, 2, 2100,
                "Townhouse",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.APPROVED
        );
        propertyRepository.save(p4);

        Property p5 = new Property(
                manager,
                "Highland Park Bohemian Bungalow",
                "5822 Figueroa St, Highland Park",
                "Los Angeles",
                "Charming eco-friendly bungalow with xeriscaped drought-tolerant succulent garden, EV charging port, and serene outdoor wood deck.",
                new BigDecimal("3100.00"),
                2, 2, 1350,
                "House",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.APPROVED
        );
        propertyRepository.save(p5);

        Property p6 = new Property(
                manager,
                "Skyview Tower Luxury 2BR Flat",
                "880 S Michigan Ave, South Loop",
                "Chicago",
                "Panoramic Lake Michigan vistas, floor-to-ceiling soundproof glass, quartz island counter, 24/7 concierge, state-of-the-art gym, and indoor heated pool.",
                new BigDecimal("2900.00"),
                2, 2, 1250,
                "Apartment",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                ListingStatus.PENDING
        );
        propertyRepository.save(p6);

        // 3. Seed Rental Applications
        Application app1 = new Application(
                p2,
                tenant,
                ApplicationStatus.APPROVED,
                "Software engineer working remotely at a fintech company. Non-smoker, excellent credit score (>780), looking for an 18-month lease.",
                LocalDate.now().plusDays(15),
                "Senior Engineer at Stripe ($165,000/yr)"
        );
        applicationRepository.save(app1);

        Application app2 = new Application(
                p1,
                tenant2,
                ApplicationStatus.PENDING,
                "Management consultant relocating from Boston. Quiet tenant, no pets.",
                LocalDate.now().plusDays(25),
                "Engagement Manager at McKinsey ($190,000/yr)"
        );
        applicationRepository.save(app2);

        // 4. Seed Rental Agreement
        Agreement agr1 = new Agreement(
                p2,
                tenant,
                manager,
                LocalDate.now().minusMonths(1),
                LocalDate.now().plusMonths(11),
                new BigDecimal("2400.00"),
                new BigDecimal("2400.00"),
                "Standard 12-month residential lease agreement. Utilities included: Water, Trash, and High-Speed Fiber Internet. Rent due on the 1st of each month.",
                AgreementStatus.ACTIVE
        );
        agreementRepository.save(agr1);

        // 5. Seed Direct Messages
        Message m1 = new Message(
                tenant,
                manager,
                p2,
                "Hello Sarah, I submitted an application for the Midtown Modern Studio Loft! When might I expect an update?"
        );
        messageRepository.save(m1);

        Message m2 = new Message(
                manager,
                tenant,
                p2,
                "Hi David! Your application and credit profile look stellar. I'm approving it right now and drafting the lease agreement."
        );
        messageRepository.save(m2);

        Message m3 = new Message(
                tenant,
                manager,
                p2,
                "That's wonderful news, thank you so much! Looking forward to moving in."
        );
        messageRepository.save(m3);

        // 6. Seed System Settings
        settingRepository.save(new Setting("platform_name", "EstateSphere Pro", "Official platform brand name displayed in headers"));
        settingRepository.save(new Setting("platform_currency", "USD ($)", "Default display and transaction currency"));
        settingRepository.save(new Setting("commission_rate", "5.0", "Platform service fee percentage on closed rental agreements"));
        settingRepository.save(new Setting("auto_approve_listings", "false", "Whether property manager listings bypass admin approval queue"));
        settingRepository.save(new Setting("max_listing_images", "10", "Maximum image attachments permitted per property listing"));
        settingRepository.save(new Setting("maintenance_mode", "false", "Restricts portal access for scheduled maintenance"));

        // 7. Seed Notifications
        notificationRepository.save(new Notification(
                tenant,
                "Application Approved!",
                "Great news! Your rental application for Midtown Modern Studio Loft has been approved."
        ));
        notificationRepository.save(new Notification(
                manager,
                "New Application Received",
                "Emma Watson submitted a new application for The Grand Azure Luxury Penthouse."
        ));
        notificationRepository.save(new Notification(
                admin,
                "New Listing Awaiting Review",
                "Sarah Jenkins submitted \"Skyview Tower Luxury 2BR Flat\" for verification."
        ));

        // 8. Seed Activity Logs
        activityLogRepository.save(new ActivityLog(admin.getId(), admin.getName(), "ADMIN", "SYSTEM_STARTUP", "Online Real Estate System initialized successfully"));
        activityLogRepository.save(new ActivityLog(manager.getId(), manager.getName(), "PROPERTY_MANAGER", "CREATE_PROPERTY", "Created new listing: The Grand Azure Luxury Penthouse"));
        activityLogRepository.save(new ActivityLog(admin.getId(), admin.getName(), "ADMIN", "APPROVE_LISTING", "Approved listing: Midtown Modern Studio Loft"));
        activityLogRepository.save(new ActivityLog(tenant.getId(), tenant.getName(), "TENANT", "SUBMIT_APPLICATION", "Submitted rental application for Midtown Modern Studio Loft"));
        activityLogRepository.save(new ActivityLog(manager.getId(), manager.getName(), "PROPERTY_MANAGER", "CREATE_AGREEMENT", "Finalized active lease agreement #1 for David Miller"));

        System.out.println(">>> Seed data initialization complete!");
    }
}
