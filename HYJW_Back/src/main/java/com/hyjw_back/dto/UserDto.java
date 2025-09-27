package com.hyjw_back.dto;

import com.hyjw_back.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long userId;
    private String userNickname;
    private String email;

    // ✅ Users 엔티티를 인자로 받는 생성자 추가
    public UserDto(Users user) {
        this.userId = user.getUserId(); // Users 엔티티에 getUserId()가 있다고 가정
        this.userNickname = user.getUserNickname(); // Users 엔티티에 getUserNickname()이 있다고 가정
        this.email = user.getEmail(); // Users 엔티티에 getEmail()이 있다고 가정
    }
}