package com.bench.ws.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

/**
 * User entity — extended for new features:
 *
 * FEATURE: Mood Status System
 *   - moodStatus: "ONLINE" | "FOCUSED" | "GAMING" | "STUDYING" | "BUSY" | "CHILL" | "OFFLINE"
 *   - moodEmoji: optional custom emoji for the mood
 *
 * FEATURE: Roles & Permissions
 *   - role: "OWNER" | "ADMIN" | "MODERATOR" | "VIP" | "MEMBER"
 *
 * FEATURE: Moderation Tools
 *   - banned: whether this user is banned from the platform
 *   - bannedUntil: null = permanent ban, non-null = temp ban expiry
 *   - mutedUntil: timeout — user cannot send messages until this datetime
 *   - bannedBy: who issued the ban
 *   - banReason: reason for the ban
 *
 * FEATURE: Security
 *   - twoFactorEnabled: whether TOTP 2FA is active
 *   - twoFactorSecret: base32 TOTP secret (stored encrypted in production)
 *   - blockedUsers: list of usernames this user has blocked
 *
 * FEATURE: Privacy
 *   - showOnlineStatus: already existed, kept
 */
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

    @Column(unique = false)
    private String email;

    // ── Mood Status ────────────────────────────────────────────
    // Default = ONLINE so existing users appear online on login
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'ONLINE'")
    private String moodStatus = "ONLINE";

    // Optional custom emoji displayed next to the username
    private String moodEmoji;

    // ── Role ──────────────────────────────────────────────────
    // OWNER > ADMIN > MODERATOR > VIP > MEMBER
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'MEMBER'")
    private String role = "MEMBER";

    // ── Moderation ────────────────────────────────────────────
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean banned = false;

    // null = permanent ban; non-null = temporary ban expiry
    private LocalDateTime bannedUntil;

    // Muted (timeout) — cannot send messages until this time
    private LocalDateTime mutedUntil;

    private String bannedBy;

    @Column(columnDefinition = "TEXT")
    private String banReason;

    // ── Security ──────────────────────────────────────────────
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean twoFactorEnabled = false;

    // TOTP secret — store encrypted in production (use @Convert + AES)
    @Column(columnDefinition = "TEXT")
    private String twoFactorSecret;

    // Blocked users — this user cannot receive messages from these usernames
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_blocked", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "blocked_username")
    private List<String> blockedUsers = new ArrayList<>();

    // ── Privacy / Friends ─────────────────────────────────────
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "friend_username")
    private List<String> friends = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean showOnlineStatus = true;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long   getId()                               { return id; }

    public String getUsername()                         { return username; }
    public void   setUsername(String u)                 { this.username = u; }

    public String getPassword()                         { return password; }
    public void   setPassword(String p)                 { this.password = p; }

    public String getDisplayName()                      { return displayName; }
    public void   setDisplayName(String d)              { this.displayName = d; }

    public String getBio()                              { return bio; }
    public void   setBio(String b)                      { this.bio = b; }

    public String getEmail()                            { return email; }
    public void   setEmail(String e)                    { this.email = e; }

    public String getAvatarUrl()                        { return avatarUrl; }
    public void   setAvatarUrl(String a)                { this.avatarUrl = a; }

    // Mood
    public String getMoodStatus()                       { return moodStatus; }
    public void   setMoodStatus(String m)               { this.moodStatus = m; }

    public String getMoodEmoji()                        { return moodEmoji; }
    public void   setMoodEmoji(String e)                { this.moodEmoji = e; }

    // Role
    public String getRole()                             { return role; }
    public void   setRole(String r)                     { this.role = r; }

    // Moderation
    public boolean       isBanned()                     { return banned; }
    public void          setBanned(boolean b)           { this.banned = b; }

    public LocalDateTime getBannedUntil()               { return bannedUntil; }
    public void          setBannedUntil(LocalDateTime t){ this.bannedUntil = t; }

    public LocalDateTime getMutedUntil()                { return mutedUntil; }
    public void          setMutedUntil(LocalDateTime t) { this.mutedUntil = t; }

    public String        getBannedBy()                  { return bannedBy; }
    public void          setBannedBy(String b)          { this.bannedBy = b; }

    public String        getBanReason()                 { return banReason; }
    public void          setBanReason(String r)         { this.banReason = r; }

    // Security
    public boolean isTwoFactorEnabled()                 { return twoFactorEnabled; }
    public void    setTwoFactorEnabled(boolean t)       { this.twoFactorEnabled = t; }

    public String  getTwoFactorSecret()                 { return twoFactorSecret; }
    public void    setTwoFactorSecret(String s)         { this.twoFactorSecret = s; }

    public List<String> getBlockedUsers()               { return blockedUsers; }
    public void         setBlockedUsers(List<String> b) { this.blockedUsers = b; }

    // Privacy / Friends
    public List<String> getFriends()                    { return friends; }
    public void         setFriends(List<String> f)      { this.friends = f; }

    public boolean isShowOnlineStatus()                 { return showOnlineStatus; }
    public void    setShowOnlineStatus(boolean v)       { this.showOnlineStatus = v; }

    // ── Helpers ────────────────────────────────────────────────

    /** Returns true if this user is currently banned (permanent or active temp ban). */
    public boolean isCurrentlyBanned() {
        if (!banned) return false;
        // If bannedUntil is null, it's permanent
        if (bannedUntil == null) return true;
        // If ban has expired, user is no longer banned
        return LocalDateTime.now().isBefore(bannedUntil);
    }

    /** Returns true if this user is currently muted (timed out). */
    public boolean isCurrentlyMuted() {
        if (mutedUntil == null) return false;
        return LocalDateTime.now().isBefore(mutedUntil);
    }

    /** Returns true if this user has blocked the given username. */
    public boolean hasBlocked(String username) {
        return blockedUsers != null && blockedUsers.contains(username);
    }
}