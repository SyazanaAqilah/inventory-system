package com.inventory.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expirationMs}")
    private Long expirationTime;

    public String generateToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
                
    }

    public String extractEmail(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (Exception e) {
            return null;
        }
    }
    
    public boolean isTokenValid(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    // public String extractEmail(String token) {
    //     try {
    //         SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    //         return Jwts.parserBuilder()
    //             .setSigningKey(key)
    //             .build()
    //             .parseClaimsJws(token)
    //             .getBody()
    //             .getSubject();
    //     } catch (Exception e) {
    //         return null;
    //     }
    // }
    
    // public boolean isTokenValid(String token) {
    //     try {
    //         SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    //         Jwts.parserBuilder()
    //             .setSigningKey(key)
    //             .build()
    //             .parseClaimsJws(token);
    //         return true;
    //     } catch (Exception e) {
    //         return false;
    //     }
    // }
    
    public long getExpirationTime() {
        return expirationTime;
    }
}

