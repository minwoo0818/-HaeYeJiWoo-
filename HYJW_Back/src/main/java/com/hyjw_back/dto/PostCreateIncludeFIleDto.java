package com.hyjw_back.dto;

import com.hyjw_back.constant.CategoryId;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class PostCreateIncludeFIleDto {
    private CategoryId categoryId;      //enum
    private String title;
    private String content;
    private List<String> hashtags;
//    private List<FileCreateDto> files;  // 여기서 List<FileCreateDto>
// 파일 여러개
    private List<MultipartFile> files;
//    private List<MultipartFile> files = new ArrayList<>(); // 반드시 초기화!
}
