package wav.hmed.authentication.dto;

import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.Role;

public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private Role role;
    // Added Agent-specific fields
    private String identityType;
    private String identityNumber;
    private String birthDate;
    private String address;
    private String registrationNumber;
    private String patentNumber;

    // Added Client-specific fields
    private Client.CeilingType ceilingType;
    private Double balance;

    // Default constructor
    public RegisterRequest() {
    }

    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public String getIdentityType() { return identityType; }
    public String getIdentityNumber() { return identityNumber; }
    public String getBirthDate() { return birthDate; }
    public String getAddress() { return address; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getPatentNumber() { return patentNumber; }
    public Client.CeilingType getCeilingType() {
        return ceilingType;
    }
    public Double getBalance() {
        return balance;
    }



    // Setters
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(Role role) { this.role = role; }
    public void setIdentityType(String identityType) { this.identityType = identityType; }
    public void setIdentityNumber(String identityNumber) { this.identityNumber = identityNumber; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
    public void setAddress(String address) { this.address = address; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public void setPatentNumber(String patentNumber) { this.patentNumber = patentNumber; }
    public void setCeilingType(Client.CeilingType ceilingType) {
        this.ceilingType = ceilingType;
    }
    public void setBalance(Double balance) {
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role=" + role +
                ", identityType='" + identityType + '\'' +
                ", identityNumber='" + identityNumber + '\'' +
                ", birthDate='" + birthDate + '\'' +
                ", address='" + address + '\'' +
                ", registrationNumber='" + registrationNumber + '\'' +
                ", patentNumber='" + patentNumber + '\'' +
                '}';
    }
}