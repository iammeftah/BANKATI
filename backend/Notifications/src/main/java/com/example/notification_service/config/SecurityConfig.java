package com.example.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsFilter corsFilter;

    public SecurityConfig(CorsFilter corsFilter) {
        this.corsFilter = corsFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF as we're using tokens
                .csrf(AbstractHttpConfigurer::disable)

                // Add CORS filter
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)

                // Configure authorization
                .authorizeHttpRequests(auth -> auth
                        // Allow email endpoint without authentication
                        .requestMatchers("/send-email/**").permitAll()
                        .requestMatchers("/api/notifications/**").permitAll()
                        // Require authentication for all other requests
                        .anyRequest().authenticated()
                )

                // Disable form login as we're using API endpoints
                .formLogin(AbstractHttpConfigurer::disable)

                // Disable HTTP Basic
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}