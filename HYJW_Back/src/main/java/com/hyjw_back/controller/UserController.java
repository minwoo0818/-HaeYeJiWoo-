package com.hyjw_back.controller;

import com.hyjw_back.dto.AccountCredentials;
import com.hyjw_back.dto.UserDto;
import com.hyjw_back.service.JwtService;
import com.hyjw_back.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signupUser(@Valid @RequestBody UserDto userDto) {
        UserDto signedUpUser = usersService.signupUser(userDto);
        return new ResponseEntity<>(signedUpUser, HttpStatus.CREATED);
    }

    @GetMapping("/checkEmail")
    public ResponseEntity<String> checkEmail(@RequestParam String value) {
        if (value == null || value.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("이메일을 입력해주세요.");
        }

        boolean isDuplicate = usersService.isEmailDuplicate(value);
        if (isDuplicate) {
            return ResponseEntity.ok("이미 사용 중인 이메일입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 이메일입니다.");
        }
    }

    @GetMapping("/checkNickname")
    public ResponseEntity<String> checkNickname(@RequestParam String value) {
        if (value == null || value.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("닉네임을 입력해주세요.");
        }

        boolean isDuplicate = usersService.isNicknameDuplicate(value);
        if (isDuplicate) {
            return ResponseEntity.ok("이미 사용 중인 닉네임입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 닉네임입니다.");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AccountCredentials credentials){
        // 1. user의 id pw 정보를 기반으로 UsernamePasswordAuthenticationToken을 생성한다.
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(credentials.getEmail(), credentials.getPassword());
        // 2. 생성된 UsernamePasswordAuthenticationToken을 authenticationManager에게 전달.
        // 3. authenticationManager은 UserDetailsService의 loadUserByUsername을 호출 (DB에 있는 유저정보 UserDetails객체를 불러옴)
        // 4. 조회된 유저정보(UserDetails와 UsernamePasswordAuthenticationToken을 비교해 인증처리.
        Authentication authentication = authenticationManager.authenticate(token);
        // 5. 최종 반환된 Authentication(인증된 유저 정보)를 기반으로 JWT TOKEN 발급
        String jwtToken = jwtService.generateToken(authentication.getName());
        // 6. 컨트롤러는 응답 헤더(Authorication)에 Bearer <JWT TOKEN VALUE> 형태로 응답
        // 이후 클라이언트는 이 토큰을 가지고 다른 API 요청시 Authorization 헤더에 넣어 인증을 받게됨.
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                .build();
    }
}