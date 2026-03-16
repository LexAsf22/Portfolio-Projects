package com.bench.ws.repository;

import com.bench.ws.dto.MessageEditHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MessageEditHistoryRepository
 *
 * Stores and retrieves edit history for messages.
 * Used by ChatController and RoomController when a message is edited.
 */
@Repository
public interface MessageEditHistoryRepository extends JpaRepository<MessageEditHistory, Long> {

    // Get all edit history for a specific message, sorted oldest-first
    List<MessageEditHistory> findByMessageIdAndMessageTypeOrderByEditNumberAsc(
        Long messageId, String messageType);

    // Count how many times a message has been edited
    int countByMessageIdAndMessageType(Long messageId, String messageType);
}