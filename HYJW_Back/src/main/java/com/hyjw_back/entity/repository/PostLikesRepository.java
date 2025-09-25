package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.PostLikes;
import com.hyjw_back.entity.Posts;
import com.hyjw_back.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, Long> {
    Integer countByPost_PostId(Long postId);

    void deleteByPost(Posts post);

    Optional<PostLikes> findByPostAndUser(Posts post, Users user);
}