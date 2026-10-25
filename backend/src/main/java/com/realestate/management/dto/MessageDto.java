package com.realestate.management.dto;

import com.realestate.management.model.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class MessageDto {
    private Long id;

    private Long senderId;
    private String senderName;
    private String senderRole;

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    private String receiverName;
    private String receiverRole;

    private Long propertyId;
    private String propertyTitle;

    @NotBlank(message = "Message content is required")
    private String content;

    private Boolean isRead;
    private LocalDateTime createdAt;

    public MessageDto() {}

    public MessageDto(Message msg) {
        if (msg != null) {
            this.id = msg.getId();
            if (msg.getSender() != null) {
                this.senderId = msg.getSender().getId();
                this.senderName = msg.getSender().getName();
                this.senderRole = msg.getSender().getRole().name();
            }
            if (msg.getReceiver() != null) {
                this.receiverId = msg.getReceiver().getId();
                this.receiverName = msg.getReceiver().getName();
                this.receiverRole = msg.getReceiver().getRole().name();
            }
            if (msg.getProperty() != null) {
                this.propertyId = msg.getProperty().getId();
                this.propertyTitle = msg.getProperty().getTitle();
            }
            this.content = msg.getContent();
            this.isRead = msg.getIsRead();
            this.createdAt = msg.getCreatedAt();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverRole() {
        return receiverRole;
    }

    public void setReceiverRole(String receiverRole) {
        this.receiverRole = receiverRole;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
