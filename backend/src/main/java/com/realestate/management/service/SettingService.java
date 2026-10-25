package com.realestate.management.service;

import com.realestate.management.dto.SettingDto;
import com.realestate.management.model.Setting;
import com.realestate.management.repository.SettingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettingService {

    private final SettingRepository settingRepository;
    private final ActivityService activityService;

    public SettingService(SettingRepository settingRepository, ActivityService activityService) {
        this.settingRepository = settingRepository;
        this.activityService = activityService;
    }

    public List<SettingDto> getAllSettings() {
        return settingRepository.findAll()
                .stream()
                .map(SettingDto::new)
                .collect(Collectors.toList());
    }

    public SettingDto getSettingByKey(String key) {
        return settingRepository.findBySettingKey(key)
                .map(SettingDto::new)
                .orElse(null);
    }

    public SettingDto saveOrUpdateSetting(String key, String value, String description, Long adminId, String adminName) {
        Setting setting = settingRepository.findBySettingKey(key).orElse(new Setting(key, value, description));
        setting.setSettingValue(value);
        if (description != null) {
            setting.setDescription(description);
        }
        Setting saved = settingRepository.save(setting);
        activityService.logActivity(adminId, adminName, "ADMIN", "UPDATE_SETTING", "Updated system setting: " + key + " = " + value);
        return new SettingDto(saved);
    }
}
