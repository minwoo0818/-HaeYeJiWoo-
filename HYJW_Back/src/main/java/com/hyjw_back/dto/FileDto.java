package com.hyjw_back.dto;

import lombok.Data;

@Data
public class FileDto {
    private String fileOriginalName;
    private String url;
    private String fileType;
    private Integer fileSize;
    private Integer downloads;
}