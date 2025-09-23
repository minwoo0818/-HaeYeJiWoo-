package com.hyjw_back.dto;

import lombok.Data;
import java.sql.Timestamp;
import java.util.List;

@Data
public class PostCardDto {
    private Long postId;
    private String title;
    private String userNickname;
    private String url;
    private String categoryId;
    private Timestamp createdAt;
    private Integer views;
    private List<String> hashtags;
    private Integer likesCount;
}