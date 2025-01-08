package com.ismailourakh.wallet_service.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.ismailourakh.wallet_service.config.AuthServiceProperties;

@Component
public class AuthServiceClient {
    private final RestTemplate restTemplate;
    private final AuthServiceProperties properties;

    public AuthServiceClient(RestTemplate restTemplate, @Qualifier("authServiceProperties") AuthServiceProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    public boolean validateToken(String token, String userId) {
        int retries = 0;
        while (retries < properties.getValidation().getMaxRetries()) {
            try {
                String tokenValue = token.startsWith("Bearer ") ? token : "Bearer " + token;

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", tokenValue);

                headers.add("Authorization", "Bearer " + token);

                HttpEntity<?> entity = new HttpEntity<>(headers);

                String url = UriComponentsBuilder.fromHttpUrl(properties.getUrl())
                        .path("/api/auth/validate")
                        .queryParam("userId", userId)
                        .build()
                        .toUriString();

                System.out.println("Attempting to validate token at URL: " + url);

                ResponseEntity<Boolean> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        Boolean.class
                );

                if (response.getStatusCode() == HttpStatus.OK && Boolean.TRUE.equals(response.getBody())) {
                    System.out.println("Token validation successful");
                    return true;
                }

                System.out.println("Token validation failed, attempt " + (retries + 1) + " of " + properties.getValidation().getMaxRetries());
                retries++;

                if (retries < properties.getValidation().getMaxRetries()) {
                    Thread.sleep(properties.getValidation().getRetryDelay());
                }
            } catch (Exception e) {
                System.err.println("Validation attempt " + (retries + 1) + " failed: " + e.getMessage());
                retries++;
                if (retries < properties.getValidation().getMaxRetries()) {
                    try {
                        Thread.sleep(properties.getValidation().getRetryDelay());
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return false;
                    }
                }
            }
        }
        return false;
    }
}