package com.hyjw_back.controller;

import com.hyjw_back.dto.PostCreateDto;
import com.hyjw_back.dto.PostDetailDto;
import com.hyjw_back.dto.PostCardDto;
import com.hyjw_back.dto.CommentResponseDto;
import com.hyjw_back.service.CommentsService;
import com.hyjw_back.service.PostsService;
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

    @Autowired
    private CommentsService commentsService;

    @PostMapping("/{userId}")
    public ResponseEntity<PostDetailDto> createPost(
            @PathVariable Long userId,
            @RequestBody PostCreateDto postCreateDto) {

        PostDetailDto newPost = postsService.createPost(postCreateDto, userId);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    // getAllPosts, getPostDetail 등 다른 메서드는 기존과 동일
    @GetMapping
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

    @GetMapping(params = "id")
    public ResponseEntity<PostDetailDto> getPostDetailByRequestParam(@RequestParam Long id) {
        PostDetailDto postDetail = postsService.getPostDetail(id);
        if (postDetail != null) {
            return new ResponseEntity<>(postDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentsService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
}