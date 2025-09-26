package com.hyjw_back.dto;

import com.hyjw_back.constant.CategoryId;
import lombok.Data;

import java.util.List;

@Data
public class PostCreateDto {
    private CategoryId categoryId;      //enum
    private String title;
    private String content;
    private List<String> hashtags;
}
