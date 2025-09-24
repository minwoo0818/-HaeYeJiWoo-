package com.hyjw_back.dto;

import com.hyjw_back.constant.CategoryId;
import lombok.Data;
import java.util.List;

@Data
public class PostCreateDto {
    private CategoryId categoryId;
    private String title;
    private String content;
    private List<String> hashtags;
    private List<FileCreateDto> files;
}