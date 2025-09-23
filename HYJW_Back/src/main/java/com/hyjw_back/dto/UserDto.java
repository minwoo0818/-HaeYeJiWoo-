package com.hyjw_back.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long userId;
    private String userNickname;
    private String email;
}