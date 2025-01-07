package wav.hmed.authentication.dto;

import wav.hmed.authentication.entity.User;

public class AuthenticationResponse {
    private String token;
    private User user;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
