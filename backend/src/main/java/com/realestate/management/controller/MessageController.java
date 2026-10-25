package com.realestate.management.controller;

import com.realestate.management.dto.MessageDto;
import com.realestate.management.dto.UserDto;
import com.realestate.management.model.User;
import com.realestate.management.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<UserDto>> getContacts(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(messageService.getChatContacts(currentUser));
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getConversation(@PathVariable Long otherUserId,
                                                            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(messageService.getConversation(currentUser, otherUserId));
    }

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody MessageDto dto,
                                                  @AuthenticationPrincipal User sender) {
        return ResponseEntity.ok(messageService.sendMessage(dto, sender));
    }
}
