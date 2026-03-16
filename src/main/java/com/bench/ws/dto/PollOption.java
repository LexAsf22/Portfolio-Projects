package com.bench.ws.dto;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * PollOption entity
 *
 * One row per option in a poll.
 * Votes are stored as a list of usernames (or "anonymous_N" if anonymous).
 */
@Entity
@Table(name = "poll_options")
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @Column(nullable = false)
    private String optionText;

    // Position in the list (0-indexed for ordering)
    @Column(nullable = false)
    private int position;

    // Optional emoji for reaction-style voting
    private String emoji;

    // List of usernames who voted for this option
    // If poll is anonymous, we store "anon_N" instead of real usernames
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "poll_votes", joinColumns = @JoinColumn(name = "option_id"))
    @Column(name = "voter_username")
    private List<String> voters = new ArrayList<>();

    public PollOption() {}

    public PollOption(Poll poll, String optionText, int position) {
        this.poll       = poll;
        this.optionText = optionText;
        this.position   = position;
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long         getId()                      { return id; }

    public Poll         getPoll()                    { return poll; }
    public void         setPoll(Poll p)              { this.poll = p; }

    public String       getOptionText()              { return optionText; }
    public void         setOptionText(String t)      { this.optionText = t; }

    public int          getPosition()                { return position; }
    public void         setPosition(int p)           { this.position = p; }

    public String       getEmoji()                   { return emoji; }
    public void         setEmoji(String e)           { this.emoji = e; }

    public List<String> getVoters()                  { return voters; }
    public void         setVoters(List<String> v)    { this.voters = v; }

    /** Returns the vote count for this option. */
    public int getVoteCount() {
        return voters.size();
    }

    /** Returns true if the given username has voted for this option. */
    public boolean hasVoted(String username) {
        return voters.contains(username);
    }
}