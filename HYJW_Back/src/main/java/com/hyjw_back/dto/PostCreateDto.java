package com.hyjw_back.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostCreateDto {
    private String categoryId;
    private String title;
    private String content;
    private List<String> hashtags;
    private List<FileCreateDto> files;
}