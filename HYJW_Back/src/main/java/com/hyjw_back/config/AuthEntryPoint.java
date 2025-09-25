package com.hyjw_back.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class AuthEntryPoint implements AuthenticationEntryPoint{

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        System.out.println("🚫 AuthEntryPoint 호출됨: " + request.getRequestURI());
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.println("인증에 실패했습니다. Error : "+ authException.getMessage());
    }
}
