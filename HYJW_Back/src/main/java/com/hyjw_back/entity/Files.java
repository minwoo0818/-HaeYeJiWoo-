package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Files {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "files_id")
    private Long filesId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "post_id", nullable = false)
    private Posts post;

    @Column(name = "file_original_name", nullable = false, length = 255)
    private String fileOriginalName;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @Column(name = "file_type", nullable = false, length = 20)
    private String fileType;

    @Column(name = "file_size")
    private Integer fileSize;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @ColumnDefault("0")
    @Column(name = "downloads")
    private Integer downloads;
}