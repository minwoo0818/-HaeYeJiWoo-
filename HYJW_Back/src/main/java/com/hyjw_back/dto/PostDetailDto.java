package com.hyjw_back.dto;

import java.sql.Timestamp;
import java.util.List;
import lombok.Data;

@Data
public class PostDetailDto {
    private Long postId;
    private Integer views;
    private Integer likesCount;
    private String title;
    private UserDto user; // 작성자 정보
    private Timestamp createdAt;
    private String content;
    private List<String> hashtags; // 해시태그 목록
    private List<FileDto> files; // 첨부파일 목록
    private List<CommentDto> comments; // 댓글 목록
}