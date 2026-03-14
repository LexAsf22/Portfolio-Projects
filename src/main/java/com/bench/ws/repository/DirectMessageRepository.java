package com.bench.ws.repository;

// ─────────────────────────────────────────────────────────────────
// FIX: DirectMessageRepository additions
//
// Add the new methods below to your existing DirectMessageRepository.
// Required by:
//   - AuthController.deleteAccount()  → deleteBySenderOrRecipient()
//   - DirectMessageController        → findById() already on JpaRepository
// ─────────────────────────────────────────────────────────────────

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bench.ws.dto.DirectMessage;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {

    // Existing method — keep as-is
    @Query("SELECT m FROM DirectMessage m WHERE " +
           "(m.sender = :a AND m.recipient = :b) OR " +
           "(m.sender = :b AND m.recipient = :a) " +
           "ORDER BY m.timestamp ASC")
    List<DirectMessage> findConversation(
        @Param("a") String userA,
        @Param("b") String userB);

    // FIX: Required by deleteAccount
    void deleteBySenderOrRecipient(String sender, String recipient);
}