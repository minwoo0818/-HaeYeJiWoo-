package com.hyjw_back.dto;

import com.hyjw_back.entity.Files;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
public class FileDto {
//    private String fileOriginalName;
//    private String url;
//    private String fileType;


    // 파일 ID를 추가하여 클라이언트가 특정 파일을 식별하고 삭제 요청 등에 사용할 수 있게 함
    private Long filesId;

    private String fileOriginalName;
    private String url;
    private String fileType;
    // 파일 크기나 다운로드 수도 DTO에 포함할 수 있습니다.
    private Integer fileSize;

    // ✅ Files 엔티티를 인자로 받는 생성자 추가
    public FileDto(Files file) {
        this.filesId = file.getFilesId();
        this.fileOriginalName = file.getFileOriginalName();
        this.url = file.getUrl();
        this.fileType = file.getFileType();
        this.fileSize = file.getFileSize(); // 엔티티에서 fileSize 가져오기
    }
}