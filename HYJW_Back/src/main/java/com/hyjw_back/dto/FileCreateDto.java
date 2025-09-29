package com.hyjw_back.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList; // 1. ArrayList import 추가
import java.util.List;

@Data
public class





FileCreateDto {
    private String fileOriginalName;
    private String url;
    private String fileType;

    // 실제 업로드 파일 받기
    //  2. 선언과 동시에 ArrayList로 초기화
    private List<MultipartFile> files = new ArrayList<>();
}