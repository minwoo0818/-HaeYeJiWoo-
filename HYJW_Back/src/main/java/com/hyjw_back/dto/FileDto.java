package com.hyjw_back.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class FileDto {
    private String fileOriginalName;
    private String url;
    private String fileType;

}