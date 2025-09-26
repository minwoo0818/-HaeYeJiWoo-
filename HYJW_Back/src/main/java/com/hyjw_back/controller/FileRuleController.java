package com.hyjw_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.hyjw_back.dto.FileRuleDto;
import com.hyjw_back.service.FileRuleService;

@RestController
@RequestMapping("/api/file-rule")
public class FileRuleController {

    @Autowired
    private FileRuleService fileRuleService;

    @PutMapping
    public ResponseEntity<String> updateFileRule(@RequestBody FileRuleDto fileRuleDto) {
        try {
            fileRuleService.updateFileRule(fileRuleDto);
            return ResponseEntity.ok("설정이 저장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("설정 저장 중 오류가 발생했습니다.");
        }
    }
}