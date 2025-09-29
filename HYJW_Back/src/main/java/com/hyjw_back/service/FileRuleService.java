package com.hyjw_back.service;

import com.hyjw_back.dto.FileRuleDto;
import com.hyjw_back.dto.FileSettingsDto;
import com.hyjw_back.entity.FileRule;
import com.hyjw_back.entity.repository.FileRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileRuleService {

    @Autowired
    private FileRuleRepository fileRuleRepository;

    public void updateFileRule(FileRuleDto dto) {
        // 항상 ID 1 기준으로 조회 → 없으면 새로 생성
        FileRule rule = fileRuleRepository.findById(1L).orElse(new FileRule());
        rule.setId(1L); // ID 고정
        rule.setFileMaxNum(dto.getFile_max_num());
        rule.setFileSize(dto.getFile_size());
        rule.setFileType(dto.getFile_type());

        fileRuleRepository.save(rule); // 덮어쓰기
    }

    public FileSettingsDto getCurrentRule() {
        FileRule rule = fileRuleRepository.findById(1L).orElse(new FileRule());

        FileSettingsDto dto = new FileSettingsDto();
        dto.setFile_max_num(rule.getFileMaxNum());
        dto.setFile_size(rule.getFileSize());
        dto.setFile_type(rule.getFileType());

        return dto;
    }
}