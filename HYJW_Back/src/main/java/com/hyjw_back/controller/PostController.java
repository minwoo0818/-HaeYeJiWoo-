package com.hyjw_back.controller;

import com.hyjw_back.dto.*;
import com.hyjw_back.service.CommentsService;
import com.hyjw_back.service.PostsService;
import jakarta.persistence.Id;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:5173") //프론트 URL 허용
public class PostController {

    @Autowired
    private PostsService postsService;

    @Autowired
    private CommentsService commentsService;

    // 첨부파일 있을때
    @PostMapping("/create/file/{userId}")
    public ResponseEntity<PostDetailDto> createPost(
            @PathVariable Long userId,
            @ModelAttribute PostCreateIncludeFIleDto postCreateIncludeFIleDto) {  // @ModelAttribute → @RequestBody
        PostDetailDto newPost = postsService.createPost(postCreateIncludeFIleDto, userId);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    // 첨부파일 없을때
    @PostMapping("/create/no_file/{userId}")
    public ResponseEntity<PostDetailDto> createNoFile (
            @PathVariable Long userId,
            @ModelAttribute PostCreateDto postCreateDto) {  // @ModelAttribute → @RequestBody
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
        List<PostCardDto> searchResults = postsService.getDeletedPosts();
        return ResponseEntity.ok(searchResults);
    }

    // getAllPosts, getPostDetail 등 다른 메서드는 기존과 동일
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

    @PutMapping("/{id}")
    public ResponseEntity<PostDetailDto> updatePost(
            @PathVariable("id") Long postId,
            // ⭐️ DTO는 @RequestPart로 받습니다 (Content-Type: application/json 부분)
            @RequestPart("postUpdateDto") PostUpdateDto postUpdateDto,
            // ⭐️ 파일 목록은 @RequestParam으로 받습니다 (필수가 아닐 수 있으므로 required = false)
            @RequestParam(value = "newFiles", required = false) List<MultipartFile> newFiles) {

        postUpdateDto.setNewFiles(newFiles);

        PostDetailDto updatedPost = postsService.updatePost(postId, postUpdateDto);
        return ResponseEntity.ok(updatedPost); // 200 OK와 수정된 DTO 반환
    }



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

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId, Principal principal) {
        // 임시: 인증 기능이 없으므로 하드코딩된 사용자 이메일 사용 (테스트용, 실제 구현 시 변경 필요)
        String userEmail = "testuser@example.com"; // 실제 사용자 이메일로 대체 필요
        postsService.addLike(postId, userEmail);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId, Principal principal) {
        // 임시: 인증 기능이 없으므로 하드코딩된 사용자 이메일 사용 (테스트용, 실제 구현 시 변경 필요)
        String userEmail = "testuser@example.com"; // 실제 사용자 이메일로 대체 필요
        postsService.removeLike(postId, userEmail);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/like/status")
    public ResponseEntity<Boolean> getPostLikeStatus(@PathVariable Long postId, Principal principal) {
        // 임시: 인증 기능이 없으므로 하드코딩된 사용자 이메일 사용 (테스트용, 실제 구현 시 변경 필요)
        String userEmail = "testuser@example.com"; // 실제 사용자 이메일로 대체 필요
        boolean isLiked = postsService.getPostLikeStatus(postId, userEmail);
        return ResponseEntity.ok(isLiked);
    }
}