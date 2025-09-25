package com.hyjw_back.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileController {

    // 이미지 경로에 해당하는 파일을 제공하는 엔드포인트
    @GetMapping("/images/{filename}")
    public Resource getImage(@PathVariable String filename) {
        // 파일 경로 지정
        String filePath = "C:/-HaYeJiWoo-/images/" + filename;
        return new FileSystemResource(filePath);  // 해당 경로의 파일을 반환
    }
}
