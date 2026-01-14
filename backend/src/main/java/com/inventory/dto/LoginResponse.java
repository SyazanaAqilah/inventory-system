package com.inventory.dto;

public class LoginResponse {
    private String token;
    private String email;
    private String fullName;
    private Long expiresIn;

    public LoginResponse() {}

    public LoginResponse(String token, String email, String fullName, Long expiresIn) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}
