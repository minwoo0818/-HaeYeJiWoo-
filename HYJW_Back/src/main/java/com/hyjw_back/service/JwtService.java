package com.hyjw_back.service;

import com.fasterxml.classmate.AnnotationOverrides;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.sql.Date;

@Service
public class JwtService {
    // 서버와 클라이언트가 주고받는 토큰 ==> HTTP Header 내 Authorization 헤더 값에 저장.
    //ex) Authorization 헤더에 붙는 토큰 앞 접두어 Bearer asdfasdf~~(토큰값)
    static final String PREFIX = "Bearer ";
    // 토큰의 만료시간 (24시간)
    static final long EXPIRATIONTIME = 24 * 60 * 60 * 1000; // 1Day (86400000ms)
    // JWT 서명에 사용할 비밀키 (HS256 알고리즘 기반으로 랜덤 생성)
    static final Key SINING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // username(ID)를 받아서 JWT 토큰을 생성한다.
    public String generateToken(String email) {
        return Jwts.builder()
                // 토큰읠 주제를 username으로 지정
                .setSubject(email)
                // 만료 시간 설정 (현재시간 + 유효시간)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                // 비밀키로 서명 (HS256방식)
                .signWith(SINING_KEY)
                // 최종적으로 compact()를 호출해 문자열 형태의 토큰 생성
                .compact();
    }

    // 요청의 Authorization 헤더에서 토큰을 가져온뒤 토큰을 확인하고 사용자 이름을 가져옴
    public String parseToken(HttpServletRequest request) {
        // Authorization 헤더 값 꺼내기 (예: "Bearer asdfasdf...")
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        // 헤더가 존재하고 "Bearer "로 시작하면
        if (header != null && header.startsWith(PREFIX)) {
            // JWT 파서 객체 생성 (서명 검증용 키 세팅)
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SINING_KEY)
                    .build();
            // "Bearer " 접두어를 제거하고 순수 토큰만 남김
            // → parser로 파싱 및 서명 검증 수행
            String username = parser.parseClaimsJws(header.replace(PREFIX,""))
                    .getBody()
                    .getSubject(); // 토큰의 subject(username) 추출
            // username이 존재하면 반환
            if(username !=null){
                return username;
            }
        }
        // 토큰이 없거나 유효하지 않은 경우 null 반환
        return null;
    }
}
