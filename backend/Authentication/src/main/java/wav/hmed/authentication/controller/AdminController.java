package wav.hmed.authentication.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;
import wav.hmed.authentication.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @GetMapping("/agents")
    public List<User> getAllAgents() {
        return userRepository.findByRole(Role.AGENT);
    }

    @GetMapping("/clients")
    public List<User> getAllClients() {
        return userRepository.findByRole(Role.CLIENT);
    }



    @PostMapping("/agents")
    public ResponseEntity<?> createAgent(@RequestBody RegisterRequest request) {
        logger.info("Received request to create agent: {}", request);

        try {
            // Validate required fields
            if (request.getIdentityType() == null || request.getIdentityNumber() == null ||
                    request.getBirthDate() == null || request.getAddress() == null ||
                    request.getRegistrationNumber() == null || request.getPatentNumber() == null) {
                throw new IllegalArgumentException("All agent fields are required");
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new RuntimeException("Phone number already exists");
            }

            Agent agent = new Agent();
            // Set basic User fields
            agent.setFirstName(request.getFirstName());
            agent.setLastName(request.getLastName());
            agent.setEmail(request.getEmail());
            agent.setPhone(request.getPhone());
            agent.setPassword(passwordEncoder.encode(request.getPassword()));
            agent.setRole(Role.AGENT);

            // Set Agent-specific fields
            try {
                agent.setIdentityType(Agent.IdentityType.valueOf(request.getIdentityType()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid identity type. Must be one of: CIN, PASSPORT, RESIDENT_PERMIT");
            }

            agent.setIdentityNumber(request.getIdentityNumber());
            agent.setBirthDate(request.getBirthDate());
            agent.setAddress(request.getAddress());
            agent.setRegistrationNumber(request.getRegistrationNumber());
            agent.setPatentNumber(request.getPatentNumber());

            logger.info("Saving new agent");
            User savedAgent = userRepository.save(agent);
            logger.info("Successfully created agent with ID: {}", savedAgent.getId());

            return ResponseEntity.ok(savedAgent);
        } catch (Exception e) {
            logger.error("Error creating agent: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/agents/{id}")
    public ResponseEntity<?> deleteAgent(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/agents/{id}")
    public ResponseEntity<?> updateAgent(@PathVariable Long id, @RequestBody RegisterRequest request) {
        try {
            // Find the agent
            Agent agent = (Agent) userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Agent not found with id: " + id));

            // Check if email is being changed and if new email is already in use
            if (!agent.getEmail().equals(request.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    return ResponseEntity.badRequest().body("Email already in use");
                }
            }

            // Check if phone is being changed and if new phone is already in use
            if (!agent.getPhone().equals(request.getPhone())) {
                if (userRepository.existsByPhone(request.getPhone())) {
                    return ResponseEntity.badRequest().body("Phone number already in use");
                }
            }

            // Validate required fields
            if (request.getFirstName() == null || request.getLastName() == null ||
                    request.getEmail() == null || request.getPhone() == null) {
                return ResponseEntity.badRequest().body("Required fields cannot be null");
            }

            // Update basic fields
            agent.setFirstName(request.getFirstName());
            agent.setLastName(request.getLastName());
            agent.setEmail(request.getEmail());
            agent.setPhone(request.getPhone());

            // Update optional fields if provided
            if (request.getAddress() != null) {
                agent.setAddress(request.getAddress());
            }
            if (request.getBirthDate() != null) {
                agent.setBirthDate(request.getBirthDate());
            }
            if (request.getIdentityType() != null) {
                try {
                    agent.setIdentityType(Agent.IdentityType.valueOf(request.getIdentityType()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid identity type");
                }
            }
            if (request.getIdentityNumber() != null) {
                agent.setIdentityNumber(request.getIdentityNumber());
            }
            if (request.getRegistrationNumber() != null) {
                agent.setRegistrationNumber(request.getRegistrationNumber());
            }
            if (request.getPatentNumber() != null) {
                agent.setPatentNumber(request.getPatentNumber());
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                agent.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            // Save and return the updated agent
            User updatedAgent = userRepository.save(agent);
            logger.info("Successfully updated agent with ID: {}", updatedAgent.getId());
            return ResponseEntity.ok(updatedAgent);

        } catch (Exception e) {
            logger.error("Error updating agent: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkIfEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-phone")
    public ResponseEntity<Boolean> checkPhone(@RequestParam String phone) {
        boolean exists = userService.checkIfPhoneExists(phone);
        return ResponseEntity.ok(exists);
    }
}