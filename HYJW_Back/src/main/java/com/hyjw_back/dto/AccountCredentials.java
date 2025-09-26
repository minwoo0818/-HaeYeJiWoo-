package com.hyjw_back.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString(exclude = "password")
@EqualsAndHashCode
public class AccountCredentials {
    private String email;
    private String password; //
}
