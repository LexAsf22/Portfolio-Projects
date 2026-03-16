package com.bench.ws.repository;

import com.bench.ws.dto.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PollRepository
 * Retrieves polls for a given channel, room, or DM context.
 */
@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

    // All polls in a channel (contextType=CHANNEL)
    List<Poll> findByContextTypeOrderByCreatedAtDesc(String contextType);

    // All polls in a specific room (contextType=ROOM, contextId=roomId)
    List<Poll> findByContextTypeAndContextIdOrderByCreatedAtDesc(
        String contextType, String contextId);

    // All polls created by a specific user
    List<Poll> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}