package com.hyjw_back.controller;

import com.hyjw_back.dto.AccountCredentials;
import com.hyjw_back.dto.UserDto;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
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
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsersRepository usersRepository;

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
    public ResponseEntity<?> loginUser(@RequestBody AccountCredentials credentials) {
        // 1~5: 인증 처리
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(credentials.getEmail(), credentials.getPassword());

        Authentication authentication = authenticationManager.authenticate(token);
        String jwtToken = jwtService.generateToken(authentication.getName());

        // ✅ 닉네임 조회 (DB에서 사용자 정보 가져오기)
        Users user = usersRepository.findByEmail(credentials.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // ✅ 응답 본문에 nickname과 token 포함
        Map<String, String> response = new HashMap<>();
        response.put("nickname", user.getUserNickname());
        response.put("token", "Bearer " + jwtToken);

        return ResponseEntity.ok(response); // ✅ JSON 응답
    }

}