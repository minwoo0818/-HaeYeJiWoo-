package com.hyjw_back.service;

import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        return new User(
                user.getEmail(),
                user.getHashedPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getUserRole()))
        );
    }
}
