package com.hyjw_back.dto;

public class FileRuleDto {
    private int file_max_num;
    private int file_size;
    private String file_type;

    // Getters and Setters
    public int getFile_max_num() {
        return file_max_num;
    }

    public void setFile_max_num(int file_max_num) {
        this.file_max_num = file_max_num;
    }

    public int getFile_size() {
        return file_size;
    }

    public void setFile_size(int file_size) {
        this.file_size = file_size;
    }

    public String getFile_type() {
        return file_type;
    }

    public void setFile_type(String file_type) {
        this.file_type = file_type;
    }
}