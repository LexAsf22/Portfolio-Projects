package com.bench.ws.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bench.ws.dto.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByOrderByTimestampAsc();

    List<Message> findByContentContainingIgnoreCaseOrderByTimestampAsc(String content);
}