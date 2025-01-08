// Updated AuthenticationService.java
package wav.hmed.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wav.hmed.authentication.dto.AuthenticationRequest;
import wav.hmed.authentication.dto.AuthenticationResponse;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }



    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        return jwtService.generateToken(claims, user);
    }



    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token, user);
    }



    public void updatePassword(String currentPassword, String newPassword) {
        // Get the currently authenticated user
        User user = getCurrentAuthenticatedUser();

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Validate new password (you can add your password validation logic here)
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private User getCurrentAuthenticatedUser() {
        // Get the authentication object from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No user is currently authenticated");
        }

        // Assuming the username is the email or phone stored in the authentication principal
        String currentUserIdentifier = authentication.getName();

        // Retrieve the user from the repository
        return userRepository.findByEmail(currentUserIdentifier)
                .or(() -> userRepository.findByPhone(currentUserIdentifier))
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));
    }

}


