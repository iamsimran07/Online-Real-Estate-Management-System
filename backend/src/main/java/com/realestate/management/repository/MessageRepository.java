package com.realestate.management.repository;

import com.realestate.management.model.Message;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :u1 AND m.receiver = :u2) OR (m.sender = :u2 AND m.receiver = :u1) ORDER BY m.createdAt ASC")
    List<Message> findConversationBetween(@Param("u1") User u1, @Param("u2") User u2);

    List<Message> findByReceiverAndIsReadFalse(User receiver);

    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user UNION SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user")
    List<User> findChatPartners(@Param("user") User user);
}
