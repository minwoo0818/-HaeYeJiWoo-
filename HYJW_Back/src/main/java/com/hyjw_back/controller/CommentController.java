package com.hyjw_back.controller;

import com.hyjw_back.dto.CommentCreateDto;
import com.hyjw_back.dto.CommentResponseDto;
import com.hyjw_back.service.CommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class CommentUpdateDto {
    private String content;
}

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentsService commentsService;

    @PostMapping("")
    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentCreateDto commentCreateDto, Principal principal) { // Changed return type
        String userEmail;
        if (principal != null) {
            userEmail = principal.getName();
        } else {
            // For testing purposes when no user is logged in
            userEmail = "anonymous@example.com"; // Or a specific test user email
            System.out.println("Warning: No principal found, using anonymous@example.com for comment creation.");
        }
        CommentResponseDto createdCommentResponse = commentsService.createComment(commentCreateDto, userEmail); // Changed variable name
        return ResponseEntity.ok(createdCommentResponse); // Return the DTO
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentsService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentsService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(@PathVariable Long commentId, @RequestBody CommentUpdateDto commentUpdateDto) {
        CommentResponseDto updatedComment = commentsService.updateComment(commentId, commentUpdateDto.getContent());
        return ResponseEntity.ok(updatedComment);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
