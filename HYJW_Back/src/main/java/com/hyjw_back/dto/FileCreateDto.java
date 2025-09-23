package com.hyjw_back.dto;

import lombok.Data;

@Data
public class FileCreateDto {
    private String fileOriginalName;
    private String url;
    private String fileType;
}