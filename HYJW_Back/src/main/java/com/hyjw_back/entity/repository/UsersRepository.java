package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUserNickname(String userNickname);
    Optional<Users> findByEmail(String email);
}