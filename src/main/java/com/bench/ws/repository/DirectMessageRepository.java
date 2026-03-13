package com.bench.ws.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bench.ws.dto.DirectMessage;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {

    @Query("SELECT m FROM DirectMessage m WHERE " +
           "(m.sender = :a AND m.recipient = :b) OR " +
           "(m.sender = :b AND m.recipient = :a) " +
           "ORDER BY m.timestamp ASC")
    List<DirectMessage> findConversation(@Param("a") String a, @Param("b") String b);

    @Query("SELECT m FROM DirectMessage m WHERE m.recipient = :username AND m.seen = false")
    List<DirectMessage> findUnseenByRecipient(@Param("username") String username);
}