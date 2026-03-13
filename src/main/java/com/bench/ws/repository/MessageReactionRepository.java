package com.bench.ws.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bench.ws.dto.MessageReaction;

@Repository
public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {
    List<MessageReaction> findByMessageId(Long messageId);
    Optional<MessageReaction> findByMessageIdAndUsernameAndEmoji(Long messageId, String username, String emoji);
    void deleteByMessageIdAndUsernameAndEmoji(Long messageId, String username, String emoji);
}