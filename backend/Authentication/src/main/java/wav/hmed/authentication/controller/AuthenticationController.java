// Updated AuthenticationController.java
package wav.hmed.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.AuthenticationRequest;
import wav.hmed.authentication.dto.AuthenticationResponse;
import wav.hmed.authentication.dto.PasswordUpdateRequest;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.service.AuthenticationService;
import wav.hmed.authentication.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService service;
    private final JwtService jwtService;


    public AuthenticationController(AuthenticationService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }



    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(
            @RequestBody PasswordUpdateRequest request
    ) {
        service.updatePassword(request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }


    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String userId) {
        try {
            // Log the incoming request
            System.out.println("=== Token Validation Request ===");
            System.out.println("Auth Header: " + authHeader);
            System.out.println("User ID: " + userId);

            String token = authHeader.replace("Bearer ", "");
            boolean isValid = jwtService.validateTokenAndUserId(token, userId);

            // Log the result
            System.out.println("Validation Result: " + isValid);

            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            System.err.println("Validation Error: " + e.getMessage());
            return ResponseEntity.ok(false);
        }
    }
}