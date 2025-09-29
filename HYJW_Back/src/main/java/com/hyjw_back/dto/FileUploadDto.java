
package com.hyjw_back.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FileUploadDto {
    private MultipartFile file;  // 실제 업로드 파일
}
