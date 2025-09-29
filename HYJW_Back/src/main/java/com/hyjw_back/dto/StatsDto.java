package com.hyjw_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    // 일별 방문자 통계 리스트 (Line Chart 데이터)
    private List<DailyVisitorDto> dailyVisitors;

    // 월별 방문자 통계 리스트 (Bar Chart 데이터)
    private List<MonthlyVisitorDto> monthlyVisitors;
}