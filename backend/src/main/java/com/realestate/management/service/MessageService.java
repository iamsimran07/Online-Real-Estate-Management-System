package com.realestate.management.service;

import com.realestate.management.dto.MessageDto;
import com.realestate.management.dto.UserDto;
import com.realestate.management.model.Message;
import com.realestate.management.model.Property;
import com.realestate.management.model.User;
import com.realestate.management.repository.MessageRepository;
import com.realestate.management.repository.PropertyRepository;
import com.realestate.management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository,
                          PropertyRepository propertyRepository,
                          NotificationService notificationService,
                          ActivityService activityService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.notificationService = notificationService;
        this.activityService = activityService;
    }

    public List<MessageDto> getConversation(User currentUser, Long otherUserId) {
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + otherUserId));

        List<Message> conversation = messageRepository.findConversationBetween(currentUser, otherUser);

        // Mark incoming messages as read
        for (Message msg : conversation) {
            if (msg.getReceiver().getId().equals(currentUser.getId()) && !Boolean.TRUE.equals(msg.getIsRead())) {
                msg.setIsRead(true);
                messageRepository.save(msg);
            }
        }

        return conversation.stream().map(MessageDto::new).collect(Collectors.toList());
    }

    public List<UserDto> getChatContacts(User currentUser) {
        return messageRepository.findChatPartners(currentUser)
                .stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    public MessageDto sendMessage(MessageDto dto, User sender) {
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with id: " + dto.getReceiverId()));

        Property property = null;
        if (dto.getPropertyId() != null) {
            property = propertyRepository.findById(dto.getPropertyId()).orElse(null);
        }

        Message message = new Message(sender, receiver, property, dto.getContent());
        Message saved = messageRepository.save(message);

        // Notify receiver
        notificationService.createNotification(
                receiver,
                "New message from " + sender.getName(),
                dto.getContent().length() > 60 ? dto.getContent().substring(0, 57) + "..." : dto.getContent()
        );

        return new MessageDto(saved);
    }
}
