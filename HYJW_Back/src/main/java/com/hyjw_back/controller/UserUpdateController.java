package com.hyjw_back.controller;

import com.hyjw_back.dto.UserDto;
import com.hyjw_back.dto.UserUpdateDto;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserUpdateController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getUserInfo(Authentication authentication) {
        Users user = (Users) authentication.getPrincipal();
        UserDto dto = new UserDto();
        dto.setEmail(user.getEmail());
        dto.setUserNickname(user.getUserNickname());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@AuthenticationPrincipal Users users, @RequestBody UserUpdateDto dto) {
        // 1. 비밀번호 확인
        if (!passwordEncoder.matches(dto.getPassword(), users.getHashedPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
        // 2. 수정 진행
        users.setEmail(dto.getEmail());
        users.setUserNickname(dto.getUserNickname());
        usersRepository.save(users);

        return ResponseEntity.ok("수정 완료");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@AuthenticationPrincipal Users users, @RequestBody UserUpdateDto dto) {
        // 1. 비밀번호 확인
        if (!passwordEncoder.matches(dto.getPassword(), users.getHashedPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
