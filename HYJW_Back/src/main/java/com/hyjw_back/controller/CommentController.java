package com.hyjw_back.controller;

import com.hyjw_back.dto.CommentCreateDto;
import com.hyjw_back.dto.CommentResponseDto; // Import the new DTO
import com.hyjw_back.service.CommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentsService commentsService;

    @PostMapping
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
}
