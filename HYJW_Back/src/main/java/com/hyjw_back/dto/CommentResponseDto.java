package com.hyjw_back.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CommentResponseDto {
    private Long id;
    private String nickname;
    private Long postId;
    private Long userId;
    private String content;
    private Long parentCommentId;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
