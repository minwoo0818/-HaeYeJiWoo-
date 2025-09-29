package com.hyjw_back.config;

import com.hyjw_back.entity.Users;
import com.hyjw_back.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        System.out.println("🔐 JwtFilter 요청 URI: " + uri);

        String jwtHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (jwtHeader != null && jwtHeader.startsWith("Bearer ")) {
            try {
                String email = jwtService.parseToken(request);
                if (email != null) {
                    Users user = jwtService.loadUserByEmail(email);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name()))
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ 인증 성공: " + user.getEmail());
                } else {
                    System.out.println("⚠️ 토큰에서 이메일 추출 실패");
                }
            } catch (Exception e) {
                System.out.println("❌ JWT 인증 오류: " + e.getMessage());
            }
        } else {
            System.out.println("🚫 Authorization 헤더 없음 또는 형식 오류");
        }

        filterChain.doFilter(request, response);
    }
}