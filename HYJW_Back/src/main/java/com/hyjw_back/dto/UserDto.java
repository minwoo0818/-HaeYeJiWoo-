package com.hyjw_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.hyjw_back.constant.Role;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import com.hyjw_back.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long userId;

    @NotNull(message = "닉네임은 필수 입력 값입니다.")
    private String userNickname;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호는' 필수입니다.")
    private String hashedPassword;

    // ✅ Users 엔티티를 인자로 받는 생성자 추가
    public UserDto(Users user) {
        this.userId = user.getUserId(); // Users 엔티티에 getUserId()가 있다고 가정
        this.userNickname = user.getUserNickname(); // Users 엔티티에 getUserNickname()이 있다고 가정
        this.email = user.getEmail(); // Users 엔티티에 getEmail()이 있다고 가정
    }
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role userRole = Role.USER;

}
