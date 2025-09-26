package com.hyjw_back.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateDto {
    private String email;
    private String userNickname;
    private String password;
}
