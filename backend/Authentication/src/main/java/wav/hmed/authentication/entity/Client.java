package wav.hmed.authentication.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
@PrimaryKeyJoinColumn(name = "user_id")
public class Client extends User {

    @Enumerated(EnumType.STRING)
    @Column(name = "ceiling_type")
    private CeilingType ceilingType;

    @Column(name = "balance")
    private Double balance;

    public enum CeilingType {
        HSSAB1(200.0),
        HSSAB2(5000.0),
        HSSAB3(10000.0);

        private final double limit;

        CeilingType(double limit) {
            this.limit = limit;
        }

        public double getLimit() {
            return limit;
        }
    }

    // Getters and Setters
    public CeilingType getCeilingType() {
        return ceilingType;
    }

    public void setCeilingType(CeilingType ceilingType) {
        this.ceilingType = ceilingType;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}