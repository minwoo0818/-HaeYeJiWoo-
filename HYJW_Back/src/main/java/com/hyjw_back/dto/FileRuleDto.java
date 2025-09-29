package com.hyjw_back.dto;

public class FileRuleDto {
    private int fileMaxNum;
    private int fileSize;
    private String fileType;

    public int getFile_max_num() { return fileMaxNum; }
    public void setFile_max_num(int fileMaxNum) { this.fileMaxNum = fileMaxNum; }

    public int getFile_size() { return fileSize; }
    public void setFile_size(int fileSize) { this.fileSize = fileSize; }

    public String getFile_type() { return fileType; }
    public void setFile_type(String fileType) { this.fileType = fileType; }
}
