package com.hyjw_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyVisitorDto {
    // 월 (예: "Jan", "Feb")
    private String month;
    // 방문자 수
    private Integer visitors;
}