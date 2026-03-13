package com.bench.ws.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bench.ws.dto.RoomMessage;

@Repository
public interface RoomMessageRepository extends JpaRepository<RoomMessage, Long> {
    List<RoomMessage> findByRoomIdOrderByTimestampAsc(Long roomId);
}