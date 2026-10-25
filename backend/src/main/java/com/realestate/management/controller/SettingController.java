package com.realestate.management.controller;

import com.realestate.management.dto.SettingDto;
import com.realestate.management.model.User;
import com.realestate.management.service.SettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    private final SettingService settingService;

    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SettingDto>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettingDto> updateSetting(@RequestBody SettingDto dto,
                                                    @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(settingService.saveOrUpdateSetting(
                dto.getSettingKey(),
                dto.getSettingValue(),
                dto.getDescription(),
                admin.getId(),
                admin.getName()
        ));
    }
}
