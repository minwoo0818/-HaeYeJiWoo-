package com.hyjw_back.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostUpdateDto {

    // 1. 제목 (필수)
    @NotBlank(message = "제목은 반드시 입력해야 합니다.")
    @Size(max = 100, message = "제목은 100자를 초과할 수 없습니다.")
    private String title;

    // 2. 내용 (필수)
    @NotBlank(message = "내용은 반드시 입력해야 합니다.")
    private String content;

    // 3. 해시태그 목록 (전체 목록을 새로 받음)
    private List<String> hashtags;

    // 4. 카테고리 변경 (선택 사항 - 카테고리 이동을 허용할 경우)
    // private CategoryId categoryId;

    // 5. 파일 변경 정보 (가장 일반적인 방식: 삭제할 파일 ID와 새로 추가할 파일 정보)

    // 5-1. 기존 첨부파일 중 삭제할 파일의 ID 목록
    private List<Long> fileIdsToDelete;

//    private List<MultipartFile> fileIdsToUpdate;

}
