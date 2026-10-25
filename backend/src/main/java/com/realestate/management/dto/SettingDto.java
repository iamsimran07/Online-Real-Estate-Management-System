package com.realestate.management.dto;

import com.realestate.management.model.Setting;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class SettingDto {
    private Long id;

    @NotBlank(message = "Setting key is required")
    private String settingKey;

    private String settingValue;
    private String description;
    private LocalDateTime updatedAt;

    public SettingDto() {}

    public SettingDto(Setting s) {
        if (s != null) {
            this.id = s.getId();
            this.settingKey = s.getSettingKey();
            this.settingValue = s.getSettingValue();
            this.description = s.getDescription();
            this.updatedAt = s.getUpdatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
