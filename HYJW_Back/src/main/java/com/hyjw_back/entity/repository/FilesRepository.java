package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Files;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FilesRepository extends JpaRepository<Files, Long> {

    // JPQL을 사용하여 Files 엔티티의 'post' 필드에 있는 'postId'로 조회
    @Query("SELECT f FROM Files f WHERE f.post.postId = :postId")
    List<Files> findByPostId(@Param("postId") Long postId);
}