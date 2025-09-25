package com.hyjw_back.entity.repository;

import com.hyjw_back.constant.CategoryId;
import com.hyjw_back.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findByCategoryId(CategoryId categoryId);
}