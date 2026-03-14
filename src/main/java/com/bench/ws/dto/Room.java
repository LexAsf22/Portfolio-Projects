package com.bench.ws.dto;

import java.util.ArrayList;
import java.util.List;

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

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — Room.java
//
// 1. Added `emoji` field — sent by CreateRoomModal, displayed in sidebar.
//    Without this the room emoji always showed as null/default.
//
// 2. Added `template` field — stores which template was used.
//
// 3. Added `roomType` field — "public" or "private".
//
// 4. Added `description` field — was likely already in your Room entity
//    but included here for completeness.
//
// Replace your existing Room.java with this file.
// ─────────────────────────────────────────────────────────────────
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String createdBy;

    // FIX: emoji, template, roomType fields
    private String emoji    = "🌟";
    private String template = "own";
    private String roomType = "public"; // "public" | "private"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_members", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "username")
    private List<String> members = new ArrayList<>();

    public Room() {}

    public Room(String name, String description, String createdBy) {
        this.name        = name;
        this.description = description;
        this.createdBy   = createdBy;
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long         getId()                      { return id; }

    public String       getName()                    { return name; }
    public void         setName(String n)            { this.name = n; }

    public String       getDescription()             { return description; }
    public void         setDescription(String d)     { this.description = d; }

    public String       getCreatedBy()               { return createdBy; }
    public void         setCreatedBy(String c)       { this.createdBy = c; }

    public String       getEmoji()                   { return emoji; }
    public void         setEmoji(String e)           { this.emoji = e; }

    public String       getTemplate()                { return template; }
    public void         setTemplate(String t)        { this.template = t; }

    public String       getRoomType()                { return roomType; }
    public void         setRoomType(String t)        { this.roomType = t; }

    public List<String> getMembers()                 { return members; }
    public void         setMembers(List<String> m)   { this.members = m; }
}