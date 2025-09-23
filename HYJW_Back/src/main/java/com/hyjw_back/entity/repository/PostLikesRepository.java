package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, PostLikes.PostLikesId> {
}