package com.realestate.management.service;

import com.realestate.management.dto.RegisterRequest;
import com.realestate.management.dto.UserDto;
import com.realestate.management.model.Role;
import com.realestate.management.model.User;
import com.realestate.management.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityService activityService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ActivityService activityService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityService = activityService;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return new UserDto(user);
    }

    public UserDto createUser(RegisterRequest request, User admin) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User(
                request.getName().trim(),
                cleanEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getPhone(),
                request.getAvatarUrl()
        );

        User saved = userRepository.save(user);
        activityService.logActivity(admin.getId(), admin.getName(), "ADMIN", "CREATE_USER", "Admin created user: " + saved.getEmail() + " (" + saved.getRole() + ")");
        return new UserDto(saved);
    }

    public UserDto updateUser(Long id, UserDto dto, User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }

        // Only Admin can change roles
        if (currentUser.getRole() == Role.ADMIN && dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        User updated = userRepository.save(user);
        activityService.logActivity(currentUser.getId(), currentUser.getName(), currentUser.getRole().name(), "UPDATE_USER", "Updated profile/user: " + updated.getEmail());
        return new UserDto(updated);
    }

    public void deleteUser(Long id, User admin) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (user.getId().equals(admin.getId())) {
            throw new IllegalArgumentException("Admin cannot delete their own account");
        }

        userRepository.delete(user);
        activityService.logActivity(admin.getId(), admin.getName(), "ADMIN", "DELETE_USER", "Admin deleted user: " + user.getEmail());
    }
}
