package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_nickname", nullable = false, length = 10, unique = true)
    private String userNickname;

    @Column(name = "email", nullable = false, length = 50, unique = true)
    private String email;

    @Column(name = "hashed_password", nullable = false, length = 50)
    private String hashedPassword;

}