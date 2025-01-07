package wav.hmed.authentication.config;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Check if admin exists by email
        if (!userRepository.existsByEmail("meftahahmedreda02@gmail.com")) {
            User adminUser = new User();
            adminUser.setEmail("meftahahmedreda02@gmail.com");
            adminUser.setFirstName("Ahmed Reda");
            adminUser.setLastName("Meftah");
            adminUser.setPassword(passwordEncoder.encode("meftah"));
            adminUser.setPhone("0707641333");
            adminUser.setRole(Role.ADMIN);

            userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
        } else {
            System.out.println("Admin user already exists - skipping initialization");
        }
    }
}