package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "file_rule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_rule_id")
    private Long fileRuleId;

    @Column(name = "file_max_num", nullable = false)
    private Integer fileMaxNum;

    @Column(name = "file_size", nullable = false)
    private Integer fileSize;

    @Column(name = "file_type", nullable = false, length = 20)
    private String fileType;
}