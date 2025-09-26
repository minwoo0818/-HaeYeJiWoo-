package com.hyjw_back.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "file_rule")
public class FileRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int fileMaxNum;
    private int fileSize;
    private String fileType;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public int getFileMaxNum() {
        return fileMaxNum;
    }

    public void setFileMaxNum(int fileMaxNum) {
        this.fileMaxNum = fileMaxNum;
    }

    public int getFileSize() {
        return fileSize;
    }

    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public void setId(Long id) {
        this.id = id;
    }

}