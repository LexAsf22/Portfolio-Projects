package com.bench.ws.service;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

/**
 * ModerationService
 *
 * FEATURE: Moderation Tools — Message Filtering & Auto-Moderation
 *
 * Provides:
 *   1. filterMessage()  — replaces banned words with asterisks
 *   2. containsSpam()   — detects repeated characters / spam patterns
 *   3. containsLink()   — detects URLs (for link-access feature)
 *   4. shouldBlock()    — returns true if message should be blocked entirely
 *   5. processMessage() — full pipeline: block check + filter
 *
 * To add more banned words: extend the BANNED_WORDS list.
 * In production, move the list to a database table for hot-reloading.
 */
@Service
public class ModerationService {

    // ── Auto-moderation word list ──────────────────────────────
    // Replace or extend this list with your platform's banned words.
    // Stored lowercase — comparison is case-insensitive.
    private static final List<String> BANNED_WORDS = Arrays.asList(
        "spam_word_1",   // placeholder — replace with real banned words
        "spam_word_2"
    );

    // Detects URLs in message content
    private static final Pattern URL_PATTERN = Pattern.compile(
        "(https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+)",
        Pattern.CASE_INSENSITIVE
    );

    // Detects excessive repeated characters (aaaaaaa, !!!!!!, etc.)
    private static final Pattern SPAM_PATTERN = Pattern.compile(
        "(.)\\1{9,}" // same character repeated 10+ times
    );

    /**
     * Filters banned words from a message, replacing them with asterisks.
     * Example: "you are a spam_word_1 person" → "you are a *** person"
     */
    public String filterMessage(String content) {
        if (content == null || content.isBlank()) return content;

        String filtered = content;
        for (String word : BANNED_WORDS) {
            String replacement = "*".repeat(word.length());
            // Case-insensitive whole-word replacement
            filtered = filtered.replaceAll(
                "(?i)\\b" + Pattern.quote(word) + "\\b",
                replacement
            );
        }
        return filtered;
    }

    /**
     * Returns true if the message looks like spam.
     * Currently detects: 10+ repeated characters.
     */
    public boolean containsSpam(String content) {
        if (content == null) return false;
        return SPAM_PATTERN.matcher(content).find();
    }

    /**
     * Returns true if the message contains a URL.
     * Used by the link-access feature to wrap links as clickable anchors.
     */
    public boolean containsLink(String content) {
        if (content == null) return false;
        return URL_PATTERN.matcher(content).find();
    }

    /**
     * Returns true if the message should be blocked entirely.
     * Currently blocks messages that are ONLY spam characters
     * and short enough to be pure noise (e.g. "aaaaaaaaaaaaa").
     */
    public boolean shouldBlock(String content) {
        if (content == null || content.isBlank()) return false;
        return containsSpam(content) && content.length() < 30;
    }

    /**
     * Full processing pipeline:
     *   1. Check if message should be blocked → return null if so
     *   2. Filter banned words → return cleaned content
     *
     * ChatController calls this before saving any message.
     * A null return means the message is dropped entirely.
     */
    public String processMessage(String content) {
        if (shouldBlock(content)) return null;
        return filterMessage(content);
    }
}