package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.PostLikes;
import com.hyjw_back.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, Long> {
    Integer countByPost_PostId(Long postId);

    void deleteByPost(Posts post);
}