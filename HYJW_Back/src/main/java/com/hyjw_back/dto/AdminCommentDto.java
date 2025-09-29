package com.hyjw_back.dto;

import java.sql.Timestamp;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminCommentDto {
    private Long id;
    private String title;
    private String nickname;
    private Long userId;
    private String content;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}