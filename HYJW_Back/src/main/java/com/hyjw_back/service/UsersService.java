package com.hyjw_back.service;

import com.hyjw_back.dto.UserDto;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean isEmailDuplicate(String email) {
        return usersRepository.findByEmail(email).isPresent();
    }

    public boolean isNicknameDuplicate(String nickname) {
        return usersRepository.findByUserNickname(nickname).isPresent();
    }

    @Transactional
    public UserDto signupUser(UserDto userDto) {
        if (isEmailDuplicate(userDto.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (isNicknameDuplicate(userDto.getUserNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        Users user = new Users();
        user.setUserNickname(userDto.getUserNickname());
        user.setEmail(userDto.getEmail());

        user.setHashedPassword(passwordEncoder.encode(userDto.getHashedPassword())); // 비밀번호 암호화 적용

        Users savedUser = usersRepository.save(user);

        UserDto savedUserDto = new UserDto();
        savedUserDto.setUserId(savedUser.getUserId());
        savedUserDto.setUserNickname(savedUser.getUserNickname());
        savedUserDto.setEmail(savedUser.getEmail());
        return savedUserDto;
    }

}
