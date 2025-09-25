package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findByIsDeleteFalse(); // 살아있는 게시글
    List<Posts> findByIsDeleteTrue();  // 삭제된 게시글
}