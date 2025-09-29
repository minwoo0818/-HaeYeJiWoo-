package com.hyjw_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyVisitorDto {
    // 날짜 (예: "9/28")
    private String day;
    // 방문자 수
    private Integer visitors;
}