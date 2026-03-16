package com.bench.ws.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * JacksonConfig
 *
 * Fixes LocalDateTime serialization so message timestamps reach the frontend
 * as ISO-8601 strings (e.g. "2025-01-15T14:32:00") instead of a numeric array
 * [2025,1,15,14,32,0]. The frontend parses these with new Date(timestamp).
 *
 * Required by: Message, DirectMessage, RoomMessage timestamp fields.
 */
@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Register the module that handles java.time types
        mapper.registerModule(new JavaTimeModule());
        // Write dates as ISO strings, not numeric timestamps
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}