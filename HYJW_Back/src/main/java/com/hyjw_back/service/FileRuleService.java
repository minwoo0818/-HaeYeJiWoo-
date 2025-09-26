package com.hyjw_back.service;

import com.hyjw_back.entity.repository.FileRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hyjw_back.dto.FileRuleDto;
import com.hyjw_back.entity.FileRule;


@Service
public class FileRuleService {

    @Autowired
    private FileRuleRepository fileRuleRepository;

    public void updateFileRule(FileRuleDto dto) {
        FileRule rule = new FileRule();
        rule.setFileMaxNum(dto.getFile_max_num());
        rule.setFileSize(dto.getFile_size());
        rule.setFileType(dto.getFile_type());

        fileRuleRepository.save(rule);
    }
}