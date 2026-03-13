package com.bench.ws.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;
    private String createdBy;
    private LocalDateTime createdAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_members", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "username")
    private Set<String> members = new HashSet<>();

    public Room() {}

    public Room(String name, String description, String createdBy) {
        this.name        = name;
        this.description = description;
        this.createdBy   = createdBy;
        this.createdAt   = LocalDateTime.now();
        this.members.add(createdBy);
    }

    public Long getId()                          { return id; }
    public String getName()                      { return name; }
    public void setName(String n)                { this.name = n; }
    public String getDescription()               { return description; }
    public void setDescription(String d)         { this.description = d; }
    public String getCreatedBy()                 { return createdBy; }
    public void setCreatedBy(String c)           { this.createdBy = c; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime t)    { this.createdAt = t; }
    public Set<String> getMembers()              { return members; }
    public void setMembers(Set<String> m)        { this.members = m; }
}