package com.hyjw_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreateDto {
    private String content;
    private Long postId;
    private Long parentCommentId;
}
