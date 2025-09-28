package com.hyjw_back.service;

import com.hyjw_back.dto.AdminCommentDto;
import com.hyjw_back.dto.AdminCommentDto.AdminCommentDtoBuilder;
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
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService {

        private final CommentsRepository commentsRepository;
        private final PostsRepository postsRepository;
        private final UsersRepository usersRepository;

        @Transactional
        public CommentResponseDto createComment(CommentCreateDto commentCreateDto, String userEmail) { // Changed return
                                                                                                       // type
                Users user = usersRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                Posts post = postsRepository.findById(commentCreateDto.getPostId())
                                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

                Comments comment = new Comments();
                comment.setContent(commentCreateDto.getContent());
                comment.setPost(post);
                comment.setUser(user);
                comment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                comment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

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
                                .parentCommentId(savedComment.getParentComment() != null
                                                ? savedComment.getParentComment().getCommentsId()
                                                : null)
                                .createAt(savedComment.getCreatedAt().toLocalDateTime()) // Convert Timestamp to// LocalDateTime
                                .updateAt(savedComment.getUpdatedAt() != null
                                                ? savedComment.getUpdatedAt().toLocalDateTime()
                                                : null) // Convert Timestamp to LocalDateTime
                                .build();
        }

        @Transactional(readOnly = true)
        public List<CommentResponseDto> getCommentsByPostId(Long postId) {
                List<Comments> comments = commentsRepository.findByPostId(postId);
                return comments.stream()
                                .map(comment -> CommentResponseDto.builder()
                                                .id(comment.getCommentsId())
                                                .nickname(comment.getUser().getUserNickname())
                                                .postId(comment.getPost().getPostId())
                                                .userId(comment.getUser().getUserId())
                                                .content(comment.getContent())
                                                .parentCommentId(comment.getParentComment() != null
                                                                ? comment.getParentComment().getCommentsId()
                                                                : null)
                                                .createAt(comment.getCreatedAt().toLocalDateTime())
                                                .updateAt(comment.getUpdatedAt() != null
                                                                ? comment.getUpdatedAt().toLocalDateTime()
                                                                : null)
                                                .build())
                                .collect(Collectors.toList());
        }

        @Transactional
        public void deleteComment(Long commentId) {
                Comments comment = commentsRepository.findById(commentId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Comment not found with id: " + commentId));
                commentsRepository.delete(comment);
        }

        @Transactional
        public CommentResponseDto updateComment(Long commentId, String newContent) {
                Comments comment = commentsRepository.findById(commentId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Comment not found with id: " + commentId));

                comment.setContent(newContent);
                comment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

                Comments updatedComment = commentsRepository.save(comment);

                return CommentResponseDto.builder()
                                .id(updatedComment.getCommentsId())
                                .nickname(updatedComment.getUser().getUserNickname())
                                .postId(updatedComment.getPost().getPostId())
                                .userId(updatedComment.getUser().getUserId())
                                .content(updatedComment.getContent())
                                .parentCommentId(updatedComment.getParentComment() != null
                                                ? updatedComment.getParentComment().getCommentsId()
                                                : null)
                                .createAt(updatedComment.getCreatedAt().toLocalDateTime())
                                .updateAt(updatedComment.getUpdatedAt() != null
                                                ? updatedComment.getUpdatedAt().toLocalDateTime()
                                                : null)
                                .build();
        }

        @Transactional(readOnly = true)
        public CommentResponseDto getCommentById(Long commentId) {
                Comments comment = commentsRepository.findById(commentId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Comment not found with id: " + commentId));

                return CommentResponseDto.builder()
                                .id(comment.getCommentsId())
                                .nickname(comment.getUser().getUserNickname())
                                .postId(comment.getPost().getPostId())
                                .userId(comment.getUser().getUserId())
                                .content(comment.getContent())
                                .parentCommentId(comment.getParentComment() != null
                                                ? comment.getParentComment().getCommentsId()
                                                : null)
                                .createAt(comment.getCreatedAt().toLocalDateTime())
                                .updateAt(comment.getUpdatedAt() != null ? comment.getUpdatedAt().toLocalDateTime()
                                                : null)
                                .build();
        }

        @Transactional(readOnly = true)
        public List<AdminCommentDto> getCommentsForAdmin() {

                List<AdminCommentDto> list = commentsRepository.findAll().stream()
                                .map(comment -> AdminCommentDto.builder()
                                                .id(comment.getCommentsId())
                                                .title(comment.getPost().getTitle())
                                                .nickname(comment.getUser().getUserNickname())
                                                .userId(comment.getUser().getUserId())
                                                .content(comment.getContent())
                                                .createdAt(comment.getCreatedAt())
                                                .updatedAt(comment.getUpdatedAt())
                                                .build())
                                .collect(Collectors.toList());

                return list;
        }
}
