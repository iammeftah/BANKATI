// Updated AuthenticationService.java
package wav.hmed.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wav.hmed.authentication.dto.AuthenticationRequest;
import wav.hmed.authentication.dto.AuthenticationResponse;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OTPService otpService;

    @Autowired
    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OTPService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    public void initiateRegistration(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Generate and send OTP
        otpService.generateAndSendOTP(request.getEmail());
    }

    public AuthenticationResponse completeRegistration(RegisterRequest request, String otp) {
        if (!otpService.validateOTP(request.getEmail(), otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        User user = new User();
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token, savedUser);
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
}


