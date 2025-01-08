package wav.hmed.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wav.hmed.authentication.service.UserService;

@RestController
@RequestMapping("/api/client")
public class PublicController {
    private final UserService userService;

    public PublicController(UserService userService) {
        this.userService = userService;
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