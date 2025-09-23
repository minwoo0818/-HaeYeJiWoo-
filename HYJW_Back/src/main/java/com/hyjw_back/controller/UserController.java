package com.hyjw_back.controller;

import com.hyjw_back.dto.UserDto;
import com.hyjw_back.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        // 실제로는 비밀번호 해싱 등 로직이 추가됩니다.
        UserDto registeredUser = usersService.registerUser(userDto);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    // 로그인, 사용자 정보 조회 등의 메서드를 추가할 수 있습니다.
}