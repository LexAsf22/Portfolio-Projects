package com.bench.ws.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.bench.ws.dto.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByName(String name);
    boolean existsByName(String name);

    @Query("SELECT r FROM Room r WHERE :username MEMBER OF r.members")
    List<Room> findByMember(@Param("username") String username);
}