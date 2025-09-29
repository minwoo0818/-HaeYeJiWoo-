package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.FileRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRuleRepository extends JpaRepository<FileRule, Long> {
    FileRule findTopByOrderByIdDesc();
}