package com.hyjw_back.dto;

import com.hyjw_back.constant.CategoryId;
import lombok.Data;
import java.sql.Timestamp;
import java.util.List;

@Data
public class PostCardDto {
    private Long postId;
    private String title;
    private String userNickname;
    private String url;
    private CategoryId categoryId;
    private Timestamp createdAt;
    private Integer views;
    private List<String> hashtags;
    private Integer likesCount;
}