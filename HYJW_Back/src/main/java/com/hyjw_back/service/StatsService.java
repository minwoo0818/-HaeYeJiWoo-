package com.hyjw_back.service;

import com.hyjw_back.dto.DailyVisitorDto;
import com.hyjw_back.dto.MonthlyVisitorDto;
import com.hyjw_back.dto.StatsDto;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class StatsService {

    /**
     * 일별 및 월별 방문자 통계 데이터를 가져옵니다.
     * (실제 운영 환경에서는 DB의 트래픽 로그를 기반으로 계산해야 합니다.)
     *
     * @return StatsDto (일별/월별 통계 리스트 포함)
     */
    public StatsDto getVisitorStats() {
        // 1. 일별 방문자 통계 (Mock Data)
        List<DailyVisitorDto> dailyStats = Arrays.asList(
                new DailyVisitorDto("9/24", 150),
                new DailyVisitorDto("9/25", 220),
                new DailyVisitorDto("9/26", 180),
                new DailyVisitorDto("9/27", 250),
                new DailyVisitorDto("9/28", 300)
        );

        // 2. 월별 방문자 통계 (Mock Data)
        List<MonthlyVisitorDto> monthlyStats = Arrays.asList(
                new MonthlyVisitorDto("Jan", 4000),
                new MonthlyVisitorDto("Feb", 3000),
                new MonthlyVisitorDto("Mar", 5500),
                new MonthlyVisitorDto("Apr", 4500),
                new MonthlyVisitorDto("May", 6000)
        );

        return new StatsDto(dailyStats, monthlyStats);
    }
}