package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.PostHashtags;
import com.hyjw_back.entity.PostHashtags.PostHashtagsId;
import com.hyjw_back.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostHashtagsRepository extends JpaRepository<PostHashtags, PostHashtags.PostHashtagsId> {

    // postId 기준으로 전체 삭제
    void deleteByPost(Posts post);

    // 게시글 ID로 연결된 해시태그의 '태그' 이름만 조회
    @Query("SELECT ph.hashtag.tag FROM PostHashtags ph WHERE ph.post.postId = :postId")
    List<String> findHashtagTagsByPostId(@Param("postId") Long postId);
}