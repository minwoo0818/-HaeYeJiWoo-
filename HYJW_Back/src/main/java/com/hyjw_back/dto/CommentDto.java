package com.hyjw_back.dto;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class CommentDto {
    private Long commentsId;
    private String content;
    private Timestamp createdAt;
    private UserDto user; // 댓글 작성자 정보
}