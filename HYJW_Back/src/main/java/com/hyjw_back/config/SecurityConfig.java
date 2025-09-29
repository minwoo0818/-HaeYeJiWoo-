package com.hyjw_back.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final AuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                  .authorizeHttpRequests(request -> request
                          .requestMatchers("/admin/**").hasRole("ADMIN")
                          // 인증 없이 접근 가능한 공개 엔드포인트
                          .requestMatchers("/images/**", "/users/login", "/users/checkEmail", "/users/checkNickname",
                                  "/users/signup", "users/", "/postdetail/", "/comments/", "/files/", "/favicon.ico")
                          .permitAll()
                          .requestMatchers(HttpMethod.GET, "/posts/**").permitAll() // GET 요청은 모든 /posts 경로에 대해 허용 (예: 목록, 상세, 좋아요 수 조회)
                          // 인증이 필요한 엔드포인트
                          .requestMatchers(HttpMethod.POST, "/posts/{postId}/like").authenticated() // 게시물 좋아요
                          .requestMatchers(HttpMethod.DELETE, "/posts/{postId}/like").authenticated() // 게시물 좋아요 취소
                          .requestMatchers(HttpMethod.GET, "/posts/{postId}/like/status").authenticated() // 사용자 좋아요 상태 확인
                          .anyRequest().authenticated()) // 위에 명시되지 않은 모든 요청은 인증 필요

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 테스트용: 실제 운영에서는 BCrypt 사용 권장
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
