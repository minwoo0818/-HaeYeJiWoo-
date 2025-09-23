package com.hyjw_back.service;

import com.hyjw_back.dto.UserDto;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Transactional
    public UserDto registerUser(UserDto userDto) {
        // DTO를 엔티티로 변환
        Users user = new Users();
        user.setUserNickname(userDto.getUserNickname());
        user.setEmail(userDto.getEmail());
        user.setHashedPassword("dummy_hashed_password"); // 실제로는 비밀번호 해싱 로직 필요

        // 엔티티 저장
        Users savedUser = usersRepository.save(user);

        // 저장된 엔티티를 다시 DTO로 변환하여 반환
        UserDto savedUserDto = new UserDto();
        savedUserDto.setUserId(savedUser.getUserId());
        savedUserDto.setUserNickname(savedUser.getUserNickname());
        savedUserDto.setEmail(savedUser.getEmail());
        return savedUserDto;
    }
}