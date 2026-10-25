package com.realestate.management.service;

import com.realestate.management.config.JwtUtils;
import com.realestate.management.dto.AuthRequest;
import com.realestate.management.dto.AuthResponse;
import com.realestate.management.dto.RegisterRequest;
import com.realestate.management.dto.UserDto;
import com.realestate.management.model.User;
import com.realestate.management.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       ActivityService activityService,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user);
        activityService.logActivity(user.getId(), user.getName(), user.getRole().name(), "LOGIN", "User logged into system");

        return new AuthResponse(token, new UserDto(user));
    }

    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                request.getName().trim(),
                cleanEmail,
                encodedPassword,
                request.getRole(),
                request.getPhone(),
                request.getAvatarUrl() != null && !request.getAvatarUrl().isEmpty()
                        ? request.getAvatarUrl()
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        );

        User savedUser = userRepository.save(user);

        // Welcome notification
        notificationService.createNotification(
                savedUser,
                "Welcome to RealEstatePro!",
                "Your account has been successfully created as " + savedUser.getRole().name() + ". Enjoy exploring our real estate platform."
        );

        activityService.logActivity(savedUser.getId(), savedUser.getName(), savedUser.getRole().name(), "REGISTER", "New user registered");

        String token = jwtUtils.generateToken(savedUser);
        return new AuthResponse(token, new UserDto(savedUser));
    }
}
