package com.hyjw_back.controller;

import com.hyjw_back.constant.CategoryId;
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

    // 모든 게시물을 조회하는 엔드포인트
    // URL: /all
    @GetMapping("/all")
    public ResponseEntity<List<PostCardDto>> getAllPosts() {
        System.out.println("GET /all 엔드포인트 호출됨.");
        List<PostCardDto> posts = postsService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // 특정 카테고리 게시물을 조회하는 엔드포인트
    // URL: /{type} (예: /FREE, /GAME)
    @GetMapping("/{type}")
    public ResponseEntity<List<PostCardDto>> getPostsByCategory(@PathVariable String type) {
        System.out.println("GET /{type} 엔드포인트 호출됨. type: " + type);
        List<PostCardDto> posts = postsService.getPostsByCategory(type);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // 게시물 검색을 위한 엔드포인트
    // URL: /{type}/search (예: /FREE/search?searchType=title&searchText=제목)
    @GetMapping("/{type}/search")
    public ResponseEntity<List<PostCardDto>> searchPosts(
            @PathVariable String type,
            @RequestParam("searchType") String searchType,
            @RequestParam("searchText") String searchText) {

        System.out.println("검색 요청 수신: " + "카테고리=" + type + ", 검색조건=" + searchType + ", 검색어=" + searchText);

        List<PostCardDto> searchResults = postsService.searchPosts(type, searchType, searchText);

        return ResponseEntity.ok(searchResults);
    }

    //수정해야할수도 있음 
//    @GetMapping(params = "id")
//    public ResponseEntity<PostDetailDto> getPostDetailByRequestParam(@RequestParam Long id) {
//        PostDetailDto postDetail = postsService.getPostDetail(id);
//        if (postDetail != null) {
//            return new ResponseEntity<>(postDetail, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
//



    @GetMapping("/detail/{id}")
    public ResponseEntity<PostDetailDto> getPostDetail(@PathVariable Long id) {
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