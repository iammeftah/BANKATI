// Updated AuthenticationController.java
package wav.hmed.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.AuthenticationRequest;
import wav.hmed.authentication.dto.AuthenticationResponse;
import wav.hmed.authentication.dto.PasswordUpdateRequest;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/register/initiate")
    public ResponseEntity<String> initiateRegistration(@RequestBody RegisterRequest request) {
        service.initiateRegistration(request);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/register/complete")
    public ResponseEntity<AuthenticationResponse> completeRegistration(
            @RequestBody RegisterRequest request,
            @RequestParam String otp
    ) {
        return ResponseEntity.ok(service.completeRegistration(request, otp));
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
}