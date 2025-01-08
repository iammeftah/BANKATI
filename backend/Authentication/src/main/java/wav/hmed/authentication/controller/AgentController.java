package wav.hmed.authentication.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.RegisterRequest;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.ClientRepository;
import wav.hmed.authentication.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
public class AgentController {
    private static final Logger logger = LoggerFactory.getLogger(AgentController.class);
    private final ClientRepository clientRepository;
    private final UserService userService;

    public AgentController(ClientRepository clientRepository, UserService userService) {
        this.clientRepository = clientRepository;
        this.userService = userService;
    }

    @PostMapping("/clients")
    public ResponseEntity<?> createClient(@RequestBody RegisterRequest request) {
        logger.info("Received request to create client: {}", request);

        try {
            // Validate only essential fields
            if (request.getPhone() == null) {
                return ResponseEntity.badRequest().body("Phone number is required");
            }

            // Check for existing phone (since it's our primary identifier)
            if (userService.checkIfPhoneExists(request.getPhone())) {
                return ResponseEntity.badRequest().body("Phone number already exists");
            }

            // Check email if provided
            if (request.getEmail() != null && userService.checkIfEmailExists(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            Client client = new Client();
            // Set required field
            client.setPhone(request.getPhone());

            // Set optional fields only if they are provided
            if (request.getFirstName() != null) {
                client.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                client.setLastName(request.getLastName());
            }
            if (request.getEmail() != null) {
                client.setEmail(request.getEmail());
            }
            if (request.getCeilingType() != null) {
                client.setCeilingType(request.getCeilingType());
            }

            // Set password if provided, otherwise generate a temporary one
            String password = request.getPassword();
            if (password == null || password.isEmpty()) {
                // Generate a temporary password using phone number last 4 digits
                password = request.getPhone().substring(Math.max(0, request.getPhone().length() - 4));
            }
            client.setPassword(userService.encodePassword(password));

            client.setRole(Role.CLIENT);
            client.setBalance(0.0); // Initialize balance to 0

            Client savedClient = clientRepository.save(client);
            logger.info("Successfully created client with ID: {}", savedClient.getId());

            // If we generated a temporary password, include it in the response
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("client", savedClient);
                response.put("temporaryPassword", password);
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.ok(savedClient);
        } catch (Exception e) {
            logger.error("Error creating client: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        try {
            List<Client> clients = clientRepository.findAll();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            logger.error("Error fetching clients: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<?> getClient(@PathVariable Long id) {
        try {
            return clientRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching client {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody RegisterRequest request) {
        try {
            return clientRepository.findById(id)
                    .map(client -> {
                        client.setFirstName(request.getFirstName());
                        client.setLastName(request.getLastName());
                        client.setEmail(request.getEmail());
                        client.setPhone(request.getPhone());
                        client.setCeilingType(request.getCeilingType());

                        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                            client.setPassword(userService.encodePassword(request.getPassword()));
                        }

                        Client updatedClient = clientRepository.save(client);
                        return ResponseEntity.ok(updatedClient);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error updating client {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        try {
            if (!clientRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            clientRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting client {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
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