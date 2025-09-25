package com.hyjw_back.service;

import com.hyjw_back.dto.CommentCreateDto;
import com.hyjw_back.dto.CommentResponseDto; // Import the new DTO
import com.hyjw_back.entity.Comments;
import com.hyjw_back.entity.Posts;
import com.hyjw_back.entity.Users;
import com.hyjw_back.entity.repository.CommentsRepository;
import com.hyjw_back.entity.repository.PostsRepository;
import com.hyjw_back.entity.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime; // Import LocalDateTime

@Service
@RequiredArgsConstructor
public class CommentsService {

    private final CommentsRepository commentsRepository;
    private final PostsRepository postsRepository;
    private final UsersRepository usersRepository;

    @Transactional
    public CommentResponseDto createComment(CommentCreateDto commentCreateDto, String userEmail) { // Changed return type
        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Posts post = postsRepository.findById(commentCreateDto.getPostId())
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Comments comment = new Comments();
        comment.setContent(commentCreateDto.getContent());
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        if (commentCreateDto.getParentCommentId() != null) {
            Comments parentComment = commentsRepository.findById(commentCreateDto.getParentCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        Comments savedComment = commentsRepository.save(comment); // Save the comment

        // Build and return CommentResponseDto
        return CommentResponseDto.builder()
                .id(savedComment.getCommentsId())
                .nickname(savedComment.getUser().getUserNickname())
                .postId(savedComment.getPost().getPostId())
                .userId(savedComment.getUser().getUserId())
                .content(savedComment.getContent())
                .parentCommentId(savedComment.getParentComment() != null ? savedComment.getParentComment().getCommentsId() : null)
                .createAt(savedComment.getCreatedAt().toLocalDateTime()) // Convert Timestamp to LocalDateTime
                .updateAt(savedComment.getUpdatedAt() != null ? savedComment.getUpdatedAt().toLocalDateTime() : null) // Convert Timestamp to LocalDateTime
                .build();
    }
}
