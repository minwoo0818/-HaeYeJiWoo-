package com.hyjw_back.entity;

import com.hyjw_back.constant.ADMIN;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private ADMIN userRole = ADMIN.USER;

}