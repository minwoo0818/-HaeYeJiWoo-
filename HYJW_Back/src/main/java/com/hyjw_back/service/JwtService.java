package com.hyjw_back.service;

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
import java.util.Date;

@Service
public class JwtService {

    @Autowired
    private UsersRepository usersRepository;

    static final String PREFIX = "Bearer ";
    // 토큰의 만료시간 (24시간)
    static final long EXPIRATIONTIME = 24 * 60 * 60 * 1000; // 1Day (86400000ms)
    // JWT 서명에 사용할 비밀키 (HS256 알고리즘 기반으로 랜덤 생성)
    static final Key SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) //
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                // 비밀키로 서명 (HS256방식)
                .signWith(SIGNING_KEY)
                // 최종적으로 compact()를 호출해 문자열 형태의 토큰 생성
                .compact();
    }


    public String parseToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(PREFIX)) {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
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

    public Users loadUserByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }
}
