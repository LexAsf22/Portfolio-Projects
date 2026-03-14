package com.bench.ws.repository;

// ─────────────────────────────────────────────────────────────────
// FIX: MessageRepository additions
//
// Add these two methods to your existing MessageRepository interface.
// They are required by AuthController.deleteAccount().
//
// If your MessageRepository already extends JpaRepository<Message, Long>,
// just add the two method signatures below to your existing file.
// ─────────────────────────────────────────────────────────────────

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bench.ws.dto.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByOrderByTimestampAsc();

    List<Message> findByContentContainingIgnoreCaseOrderByTimestampAsc(String q);

    // FIX: Required by deleteAccount — removes all messages from a user
    void deleteBySender(String sender);
}