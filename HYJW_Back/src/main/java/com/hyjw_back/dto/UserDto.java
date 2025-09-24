package com.hyjw_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hyjw_back.constant.ADMIN;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UserDto {
    private Long userId;

    @NotNull(message = "닉네임은 필수 입력 값입니다.")
    private String userNickname;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호는' 필수입니다.")
    private String hashedPassword;

    @Enumerated(EnumType.STRING)
    private ADMIN userRole = ADMIN.USER;
}