package com.hyjw_back.dto;

import com.hyjw_back.entity.Files;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
public class FileDto {
    // private String fileOriginalName;
    // private String url;
    // private String fileType;

    // 파일 ID를 추가하여 클라이언트가 특정 파일을 식별하고 삭제 요청 등에 사용할 수 있게 함
    private Long filesId;

    private String fileOriginalName;
    private String url;
    private String fileType;
    private Integer fileSize;
    private Integer downloads;
}