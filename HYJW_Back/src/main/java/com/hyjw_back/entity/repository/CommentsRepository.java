package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepository extends JpaRepository<Comments, Long> {

    @Query("SELECT c FROM Comments c WHERE c.post.postId = :postId AND c.deleted = false")
    List<Comments> findByPostId(@Param("postId") Long postId);
}