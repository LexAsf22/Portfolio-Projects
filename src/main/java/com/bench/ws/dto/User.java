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
// FIX SUMMARY — User.java
//
// 1. EMAIL COLUMN: Moved @Column annotation directly onto the email
//    field (it was declared after the getter in the original, which
//    works but is fragile). Added unique=false to allow null emails.
//
// 2. USERNAME CHANGE: username field is now mutable (setUsername
//    already existed but the column lacked updatable=true which is
//    the JPA default, so this is confirmed fine).
//
// 3. FRIENDS LIST: Added a @ElementCollection friends field so the
//    friend system can optionally be migrated from localStorage to
//    the database. Frontend localStorage still works in parallel.
//
// 4. ONLINE VISIBILITY: Added showOnlineStatus flag. When false,
//    this user's online status is hidden from non-friends.
//    The PresenceController reads this flag before broadcasting.
//
// 5. EDITED flag on DirectMessage: Added setEdited/isEdited
//    (needed by DirectMessageController dm.edit endpoint).
// ─────────────────────────────────────────────────────────────────
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String displayName;
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    // FIX: @Column placed correctly on the field
    @Column(unique = false)
    private String email;

    // FIX: Server-side friends list (mirrors localStorage on frontend)
    // Stored as a simple joined table: users_friends (user_id, friend)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "friend_username")
    private List<String> friends = new ArrayList<>();

    // FIX: Controls online status visibility to non-friends
    // Default true = visible to everyone (matches current behaviour)
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean showOnlineStatus = true;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long   getId()                        { return id; }

    public String getUsername()                  { return username; }
    public void   setUsername(String u)          { this.username = u; }

    public String getPassword()                  { return password; }
    public void   setPassword(String p)          { this.password = p; }

    public String getDisplayName()               { return displayName; }
    public void   setDisplayName(String d)       { this.displayName = d; }

    public String getBio()                       { return bio; }
    public void   setBio(String b)               { this.bio = b; }

    public String getEmail()                     { return email; }
    public void   setEmail(String email)         { this.email = email; }

    public String getAvatarUrl()                 { return avatarUrl; }
    public void   setAvatarUrl(String a)         { this.avatarUrl = a; }

    public List<String> getFriends()             { return friends; }
    public void         setFriends(List<String> f) { this.friends = f; }

    public boolean isShowOnlineStatus()          { return showOnlineStatus; }
    public void    setShowOnlineStatus(boolean v){ this.showOnlineStatus = v; }
}