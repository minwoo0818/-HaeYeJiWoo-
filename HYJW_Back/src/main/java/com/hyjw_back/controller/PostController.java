package com.hyjw_back.controller;

import com.hyjw_back.dto.PostCreateDto;
import com.hyjw_back.dto.PostDetailDto;
import com.hyjw_back.dto.PostCardDto;
import com.hyjw_back.entity.Posts;
import com.hyjw_back.service.PostsService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostsService postsService;

    @PostMapping("/{userId}")
    public ResponseEntity<PostDetailDto> createPost(
            @PathVariable Long userId,
            @RequestBody PostCreateDto postCreateDto) {

        PostDetailDto newPost = postsService.createPost(postCreateDto, userId);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    // 유저: 소프트 삭제 (isDelete = true)
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> softDeletePost(@PathVariable Long postId) {
        postsService.softDeletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // 관리자: 하드 삭제 (DB에서 완전히 삭제)
    @DeleteMapping("/admin/{postId}")
    public ResponseEntity<Void> hardDeletePost(@PathVariable Long postId) {
        postsService.hardDeletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // 관리자: 삭제된 게시글 목록 확인
    @GetMapping("/admin/deleted")
    public ResponseEntity<List<PostCardDto>> getDeletedPosts() {
        return ResponseEntity.ok(postsService.getDeletedPosts());
    }

    // getAllPosts, getPostDetail 등 다른 메서드는 기존과 동일
    @GetMapping("/all")
    public ResponseEntity<List<PostCardDto>> getAllPosts() {
        List<PostCardDto> posts = postsService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailDto> getPostDetail(@PathVariable Long postId) {
        PostDetailDto postDetail = postsService.getPostDetail(postId);
        if (postDetail != null) {
            return new ResponseEntity<>(postDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}