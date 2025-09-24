package com.hyjw_back.config;


import com.hyjw_back.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        System.out.println("JwtFilter 요청 URI: " + uri); // ✅ 여기에 추가


        if (uri.contains("/api/users/register") ||
                uri.contains("/api/users/checkEmail") ||
                uri.contains("/api/users/checkNickname")) {
            System.out.println("JwtFilter 예외 처리 통과: " + uri); // ✅ 통과 로그 추가
            filterChain.doFilter(request, response);
            return;
        }



        String jwtToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (jwtToken != null) {
            String email = jwtService.parseToken(request);
            if (email != null) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        java.util.Collections.emptyList()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

}
