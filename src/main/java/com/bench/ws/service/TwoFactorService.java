package com.bench.ws.service;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * TwoFactorService
 *
 * FEATURE: Security — Two-Factor Authentication (TOTP)
 *
 * Implements RFC 6238 TOTP (Time-based One-Time Password) without any
 * external library — uses only Java standard crypto (javax.crypto).
 *
 * Compatible with Google Authenticator, Authy, Microsoft Authenticator.
 *
 * How it works:
 *   1. User enables 2FA → server generates a random secret
 *   2. Server returns the secret as a QR code URI (otpauth://)
 *   3. User scans with their authenticator app
 *   4. On login, user provides the 6-digit code
 *   5. Server validates: code matches current 30-second window
 *
 * Note: In production, encrypt the secret before storing in the database.
 * Use @Convert with AES encryption on the twoFactorSecret field in User.java.
 */
@Service
public class TwoFactorService {

    private static final int    CODE_DIGITS   = 6;
    private static final int    TIME_STEP     = 30; // seconds per TOTP window
    private static final int    WINDOW        = 1;  // allow 1 window drift (±30s)
    private static final String HMAC_ALGO     = "HmacSHA1";

    // ── Generate a new TOTP secret ─────────────────────────────
    /**
     * Generates a random 20-byte (160-bit) secret encoded as Base32.
     * Store this in User.twoFactorSecret.
     */
    public String generateSecret() {
        byte[] secret = new byte[20];
        new SecureRandom().nextBytes(secret);
        return base32Encode(secret);
    }

    // ── Build QR code URI ──────────────────────────────────────
    /**
     * Returns an otpauth:// URI that can be encoded as a QR code.
     * The frontend should display this as a QR image for the user to scan.
     *
     * @param username  the account identifier (shown in the app)
     * @param secret    the Base32-encoded TOTP secret
     * @param issuer    your app name (e.g. "CosmoChat")
     */
    public String buildOtpauthUri(String username, String secret, String issuer) {
        String encodedIssuer   = urlEncode(issuer);
        String encodedUsername = urlEncode(username);
        return String.format(
            "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30",
            encodedIssuer, encodedUsername, secret, encodedIssuer
        );
    }

    // ── Validate a TOTP code ───────────────────────────────────
    /**
     * Validates a 6-digit TOTP code against the stored secret.
     * Allows ±1 time window to handle minor clock drift.
     *
     * @param secret    the Base32-encoded secret from User.twoFactorSecret
     * @param code      the 6-digit code entered by the user
     * @return true if the code is valid
     */
    public boolean validateCode(String secret, String code) {
        if (secret == null || code == null || code.length() != CODE_DIGITS) return false;

        try {
            byte[] secretBytes = base32Decode(secret);
            long   timeCounter = System.currentTimeMillis() / 1000 / TIME_STEP;

            // Check current window and ±1 for clock drift
            for (int i = -WINDOW; i <= WINDOW; i++) {
                String expected = generateCode(secretBytes, timeCounter + i);
                if (expected.equals(code)) return true;
            }
            return false;

        } catch (Exception e) {
            return false;
        }
    }

    // ── Internal TOTP generation ───────────────────────────────

    /** Generates a TOTP code for a given time counter value. */
    private String generateCode(byte[] secret, long timeCounter)
            throws NoSuchAlgorithmException, InvalidKeyException {

        // Pack time counter into 8 bytes (big-endian)
        byte[] message = ByteBuffer.allocate(8).putLong(timeCounter).array();

        // HMAC-SHA1
        Mac mac = Mac.getInstance(HMAC_ALGO);
        mac.init(new SecretKeySpec(secret, HMAC_ALGO));
        byte[] hash = mac.doFinal(message);

        // Dynamic truncation (RFC 4226)
        int offset = hash[hash.length - 1] & 0x0F;
        int binary = ((hash[offset]     & 0x7F) << 24)
                   | ((hash[offset + 1] & 0xFF) << 16)
                   | ((hash[offset + 2] & 0xFF) << 8)
                   |  (hash[offset + 3] & 0xFF);

        int otp = binary % (int) Math.pow(10, CODE_DIGITS);

        // Zero-pad to CODE_DIGITS digits
        return String.format("%0" + CODE_DIGITS + "d", otp);
    }

    // ── Base32 encoding/decoding ───────────────────────────────
    // Standard Base32 alphabet (RFC 4648)
    private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    private String base32Encode(byte[] data) {
        StringBuilder sb = new StringBuilder();
        int buffer = 0, bitsLeft = 0;
        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xFF);
            bitsLeft += 8;
            while (bitsLeft >= 5) {
                bitsLeft -= 5;
                sb.append(BASE32_CHARS.charAt((buffer >> bitsLeft) & 0x1F));
            }
        }
        if (bitsLeft > 0) {
            buffer <<= (5 - bitsLeft);
            sb.append(BASE32_CHARS.charAt(buffer & 0x1F));
        }
        return sb.toString();
    }

    private byte[] base32Decode(String encoded) {
        encoded = encoded.toUpperCase().replaceAll("[^A-Z2-7]", "");
        byte[] out = new byte[encoded.length() * 5 / 8];
        int buffer = 0, bitsLeft = 0, idx = 0;
        for (char c : encoded.toCharArray()) {
            buffer = (buffer << 5) | BASE32_CHARS.indexOf(c);
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                bitsLeft -= 8;
                out[idx++] = (byte) (buffer >> bitsLeft);
            }
        }
        return out;
    }

    private String urlEncode(String s) {
        return s.replace(" ", "%20").replace(":", "%3A");
    }
}