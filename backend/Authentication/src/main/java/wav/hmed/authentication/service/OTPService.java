package wav.hmed.authentication.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import wav.hmed.authentication.dto.EmailRequest;
import java.util.HashMap;
import java.util.Map;

@Service
public class OTPService {
    private final Map<String, OTPData> otpStorage = new HashMap<>();
    private final RestTemplate restTemplate;
    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    @Value("${mail.service.url}")
    private String mailServiceUrl;

    public OTPService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void generateAndSendOTP(String email) {
        String otp = generateOTP();
        otpStorage.put(email, new OTPData(otp, System.currentTimeMillis()));
        sendOTPEmail(email, otp);
    }

    private String generateOTP() {
        return String.format("%06d", new java.util.Random().nextInt(999999));
    }

    private void sendOTPEmail(String email, String otp) {
        EmailRequest emailRequest = new EmailRequest(
                email,
                "Your OTP Code",
                "Your OTP code is: " + otp + ". Valid for 5 minutes."
        );
        try {
            restTemplate.postForObject(mailServiceUrl, emailRequest, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    public boolean validateOTP(String email, String otp) {
        OTPData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }

        // Check if OTP is expired
        if (System.currentTimeMillis() - otpData.getTimestamp() > OTP_VALID_DURATION) {
            otpStorage.remove(email);
            return false;
        }

        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    // Inner class to store OTP data with timestamp
    private static class OTPData {
        private final String otp;
        private final long timestamp;

        public OTPData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() {
            return otp;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}