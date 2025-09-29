package com.hyjw_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.hyjw_back.dto.FileRuleDto;
import com.hyjw_back.dto.FileSettingsDto; // FileSettingsDto import 추가
import com.hyjw_back.dto.StatsDto; // 💡 StatsDto 추가
import com.hyjw_back.service.FileRuleService;
import com.hyjw_back.service.StatsService; // 💡 StatsService 추가

@PreAuthorize("hasRole('ADMIN')")
@RestController
// 클라이언트가 "/api/admin/main"과 "/api/admin/stats"로 요청하는 것을 고려하여
// @RequestMapping("/admin")으로 변경하거나, 요청 경로를 확인해야 합니다.
// 클라이언트 코드가 '/api/admin/main'을 사용하므로, 백엔드 경로를 '/admin/main'으로 유지하고,
// '/stats'는 이 경로에 종속시키거나 별도로 빼는 것이 좋습니다.
// 여기서는 별도의 엔드포인트를 사용하기 위해 클래스 매핑을 더 포괄적으로 변경합니다.
// 💡 클라이언트 요청 URL에 맞게 '/api'와 '/admin'을 분리하여 처리하는 것이 일반적이지만,
// 💡 현재 구조에서는 URL 충돌을 피하기 위해 /admin/stats 엔드포인트를 추가합니다.
@RequestMapping("/admin")
// 🚨 주의: 클라이언트 코드가 '/api/admin/main' 대신 '/admin/main'을 호출하는 경우에만 작동합니다.
// 클라이언트 요청 경로가 "/api/admin/main" 이었다면 @RequestMapping("/api/admin")을 사용해야 합니다.
// 여기서는 클라이언트의 GET/PUT 경로가 /admin/main 이고, stats 경로가 /admin/stats 라고 가정하고 @RequestMapping("/admin")을 사용했습니다.
public class FileRuleController { // 클래스 이름을 FileRuleController 대신 AdminController로 변경하는 것이 좋습니다.

    @Autowired
    private FileRuleService fileRuleService;

    // 💡 StatsService 주입
    @Autowired
    private StatsService statsService;

    // ======================== 첨부파일 설정 엔드포인트 (기존 로직 유지) ========================

    @PutMapping("/main")
    public ResponseEntity<String> updateFileRule(@RequestBody FileRuleDto fileRuleDto, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            fileRuleService.updateFileRule(fileRuleDto);
            return ResponseEntity.ok("설정이 저장되었습니다.");
        } catch (Exception e) {
            // 상세 오류 로깅 필요
            return ResponseEntity.status(500).body("설정 저장 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/main")
    public ResponseEntity<FileRuleDto> getFileRule() {
        try {
            FileRuleDto dto = fileRuleService.getCurrentRule();
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            // 상세 오류 로깅 필요
            return ResponseEntity.status(500).build();
        }
    }

    // ======================== 💡 방문자 통계 엔드포인트 추가 ========================

    /**
     * [GET] /admin/stats
     * 일별 및 월별 방문자 통계를 반환합니다.
     * @return StatsDto (일별/월별 통계 리스트 포함)
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getVisitorStats() {
        try {
            // StatsService를 호출하여 통계 데이터 가져오기 (Service는 Mock 데이터를 반환하도록 구현됨)
            StatsDto stats = statsService.getVisitorStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // 상세 오류 로깅 필요
            return ResponseEntity.status(500).build(); // 통계 로드 실패 시 500 응답
        }
    }
}