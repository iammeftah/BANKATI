package wav.hmed.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wav.hmed.authentication.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

}