package com.bench.ws.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getId()                      { return id; }
    public String getUsername()              { return username; }
    public void setUsername(String u)        { this.username = u; }
    public String getPassword()              { return password; }
    public void setPassword(String p)        { this.password = p; }
    public String getDisplayName()           { return displayName; }
    public void setDisplayName(String d)     { this.displayName = d; }
    public String getBio()                   { return bio; }
    public void setBio(String b)             { this.bio = b; }

    private String email;
    public String getEmail()                 { return email; }
    public void setEmail(String email)       { this.email = email; }
    public String getAvatarUrl()             { return avatarUrl; }
    public void setAvatarUrl(String a)       { this.avatarUrl = a; }
}