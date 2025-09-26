package com.hyjw_back.service;

import com.fasterxml.classmate.AnnotationOverrides;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.sql.Date;

@Service
public class JwtService {

    @Autowired
    private UsersRepository usersRepository;

    static final String PREFIX = "Bearer ";
    static final long EXPIRATIONTIME = 24 * 60 * 60 * 1000;
    static final Key SINING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(SINING_KEY)
                .compact();
    }

    public String parseToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(PREFIX)) {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SINING_KEY)
                    .build();
            String username = parser.parseClaimsJws(header.replace(PREFIX,""))
                    .getBody()
                    .getSubject();
            if(username != null){
                return username;
            }
        }
        return null;
    }

    // ✅ 여기에 넣어야 합니다!
    public Users loadUserByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }
}
