package wav.hmed.authentication.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agents")
@PrimaryKeyJoinColumn(name = "user_id")
public class Agent extends User {

    public enum IdentityType {
        CIN,
        PASSPORT,
        RESIDENT_PERMIT
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "identity_type")
    private IdentityType identityType;

    @Column(name = "identity_number")
    private String identityNumber;

    @Column(name = "birth_date")
    private String birthDate;

    @Column(name = "address")
    private String address;

    @Column(name = "registration_number")
    private String registrationNumber;  // immatriculation

    @Column(name = "patent_number")
    private String patentNumber;  // patente

    // Getters and Setters
    public IdentityType getIdentityType() {
        return identityType;
    }

    public void setIdentityType(IdentityType identityType) {
        this.identityType = identityType;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getPatentNumber() {
        return patentNumber;
    }

    public void setPatentNumber(String patentNumber) {
        this.patentNumber = patentNumber;
    }
}