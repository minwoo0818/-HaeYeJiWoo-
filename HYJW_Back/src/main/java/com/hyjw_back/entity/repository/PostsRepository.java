package com.hyjw_back.entity.repository;

import com.hyjw_back.constant.CategoryId;
import com.hyjw_back.dto.PostCardDto;
import com.hyjw_back.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// package, import 문은 그대로 둡니다.
@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {

    // 카테고리별 게시물 조회
    List<Posts> findByCategoryId(CategoryId categoryId);

    List<Posts> findByIsDeleteFalse(); // 살아있는 게시글

    List<Posts> findByIsDeleteTrue();  // 삭제된 게시글

    // 제목으로 검색
    List<Posts> findByCategoryIdAndTitleContaining(CategoryId categoryId, String searchText);

    // 내용으로 검색
    List<Posts> findByCategoryIdAndContentContaining(CategoryId categoryId, String searchText);

    // 작성자 닉네임으로 검색
    List<Posts> findByCategoryIdAndUserUserNicknameContaining(CategoryId categoryId, String searchText);

    // 해시태그로 검색 (JPQL 사용)
    @Query("SELECT p FROM Posts p "
            + "JOIN PostHashtags ph ON p.postId = ph.post.postId "
            + "JOIN Hashtags h ON ph.hashtag.hashtagsId = h.hashtagsId "
            + "WHERE p.categoryId = :categoryId AND h.tag LIKE %:tag%")
    List<Posts> findByCategoryIdAndTagContaining(
            @Param("categoryId") CategoryId categoryId,
            @Param("tag") String tag);

    List<Posts> findByTitleContaining(String searchText);

    List<Posts> findByContentContaining(String searchText);

    List<Posts> findByUserUserNicknameContaining(String searchText);

    @Query("SELECT p FROM Posts p "
            + "JOIN PostHashtags ph ON p.postId = ph.post.postId "
            + "JOIN Hashtags h ON ph.hashtag.hashtagsId = h.hashtagsId "
            + "WHERE h.tag LIKE %:tag%") // 카테고리 조건이 없습니다.
    List<Posts> findByTagContaining(@Param("tag") String tag);
}
