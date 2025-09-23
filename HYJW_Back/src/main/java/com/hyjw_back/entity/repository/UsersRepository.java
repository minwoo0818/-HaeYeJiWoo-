package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUserNickname(String userNickname);
}