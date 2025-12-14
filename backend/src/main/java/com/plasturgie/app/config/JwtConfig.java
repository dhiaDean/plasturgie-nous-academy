package com.plasturgie.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${app.jwt.secret:JWTSuperSecretKey_PlasturgieTunisiaSecure_2025_ApplicationSecretKeyLongEnoughForHS512}")
    private String secret;

    @Value("${app.jwt.expiration:86400000}")
    private int expiration; // Default: 24 hours

    @Value("${app.jwt.issuer:PlasturgieApp}")
    private String issuer;
    
    // Getters and Setters
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public int getExpiration() {
        return expiration;
    }
    
    public void setExpiration(int expiration) {
        this.expiration = expiration;
    }
    
    public String getIssuer() {
        return issuer;
    }
    
    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
}
